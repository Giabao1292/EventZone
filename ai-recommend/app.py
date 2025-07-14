from flask import Flask, request, jsonify
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
import pandas as pd
import json
import os
import subprocess
import sys
import threading
from sqlalchemy import create_engine

app = Flask(__name__)

# 🟢 Cấu hình kết nối MySQL
DB_USER = "root"
DB_PASSWORD = "123456"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "event"
engine = create_engine(f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

# 🟢 Neural Collaborative Filtering Model
class NCF(nn.Module):
    def __init__(self, num_users, num_events, embedding_dim=8):
        super(NCF, self).__init__()
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.event_embedding = nn.Embedding(num_events, embedding_dim)
        self.fc = nn.Sequential(
            nn.Linear(embedding_dim * 2, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )

    def forward(self, user, event):
        u = self.user_embedding(user)
        e = self.event_embedding(event)
        x = torch.cat([u, e], dim=1)
        return self.fc(x)

# 🟡 Global variables
model = None
user2idx = {}
event2idx = {}
idx2event = {}

# 🔄 Train model and reload mappings
def retrain_and_reload():
    print("🔄 Retraining model due to new user...")
    python_exec = sys.executable
    subprocess.run([python_exec, "load_data.py"], check=True)
    subprocess.run([python_exec, "train_model.py"], check=True)
    load_model_and_mappings()
    print("✅ Model retrained successfully.")

# 🔁 Load model and ID mappings
def load_model_and_mappings():
    global model, user2idx, event2idx, idx2event
    try:
        with open("user2idx.json") as f:
            user2idx = json.load(f)
        with open("event2idx.json") as f:
            event2idx = json.load(f)
        idx2event = {v: int(k) for k, v in event2idx.items()}
        
        # Tạo mô hình mới với kích thước hiện tại
        model = NCF(num_users=len(user2idx), num_events=len(event2idx))
        
        if os.path.exists("model.pth"):
            state_dict = torch.load("model.pth")
            # Cập nhật embedding mà không sử dụng in-place operation
            if 'user_embedding.weight' in state_dict:
                old_user_weight = state_dict['user_embedding.weight']
                new_user_weight = torch.zeros(len(user2idx), 8)
                min_size = min(old_user_weight.size(0), len(user2idx))
                new_user_weight[:min_size] = old_user_weight[:min_size]
                if len(user2idx) > old_user_weight.size(0):
                    new_user_weight[old_user_weight.size(0):] = torch.randn(len(user2idx) - old_user_weight.size(0), 8)
                model.user_embedding.weight.data = new_user_weight
                del state_dict['user_embedding.weight']
            
            if 'event_embedding.weight' in state_dict:
                old_event_weight = state_dict['event_embedding.weight']
                new_event_weight = torch.zeros(len(event2idx), 8)
                min_size = min(old_event_weight.size(0), len(event2idx))
                new_event_weight[:min_size] = old_event_weight[:min_size]
                if len(event2idx) > old_event_weight.size(0):
                    new_event_weight[old_event_weight.size(0):] = torch.randn(len(event2idx) - old_event_weight.size(0), 8)
                model.event_embedding.weight.data = new_event_weight
                del state_dict['event_embedding.weight']
            
            # Tải các tham số còn lại, bỏ qua lỗi kích thước
            model.load_state_dict(state_dict, strict=False)
        
        model.eval()
        print("✅ Model and mappings loaded successfully")
    except Exception as e:
        print(f"❌ Error loading model and mappings: {str(e)}")

# ✅ Prepare model if not already trained
def prepare_if_needed():
    if not (os.path.exists("model.pth") and os.path.exists("user2idx.json") and os.path.exists("event2idx.json")):
        retrain_and_reload()
    else:
        load_model_and_mappings()

# 🟢 Update mappings for new users/events
def update_mappings(new_users, new_events):
    global user2idx, event2idx, idx2event
    updated = False
    for user_id in new_users:
        if user_id not in user2idx:
            user2idx[user_id] = len(user2idx)
            updated = True
    for event_id in new_events:
        if event_id not in event2idx:
            event2idx[event_id] = len(event2idx)
            updated = True
    if updated:
        idx2event = {v: int(k) for k, v in event2idx.items()}
        with open("user2idx.json", "w") as f:
            json.dump(user2idx, f)
        with open("event2idx.json", "w") as f:
            json.dump(event2idx, f)
        print("✅ Mappings updated")

# 🟢 Incremental training
def incremental_train():
    global model, user2idx, event2idx, idx2event
    try:
        # Chạy load_data.py để đồng bộ dữ liệu từ MySQL
        python_exec = sys.executable
        subprocess.run([python_exec, "load_data.py"], check=True)
        
        # Đọc dữ liệu từ interaction_data.csv
        if not os.path.exists("interaction_data.csv"):
            print("No new interactions for training")
            return
        
        interaction_df = pd.read_csv("interaction_data.csv")
        if interaction_df.empty:
            print("No new interactions for training")
            return
        
        # Cập nhật ánh xạ
        new_users = set(interaction_df["user_id"].astype(str))
        new_events = set(interaction_df["event_id"].astype(str))
        update_mappings(new_users, new_events)
        
        # Tạo mô hình mới với kích thước hiện tại
        model = NCF(num_users=len(user2idx), num_events=len(event2idx))
        
        if os.path.exists("model.pth"):
            state_dict = torch.load("model.pth")
            # Cập nhật embedding mà không sử dụng in-place operation
            if 'user_embedding.weight' in state_dict:
                old_user_weight = state_dict['user_embedding.weight']
                new_user_weight = torch.zeros(len(user2idx), 8)
                min_size = min(old_user_weight.size(0), len(user2idx))
                new_user_weight[:min_size] = old_user_weight[:min_size]
                if len(user2idx) > old_user_weight.size(0):
                    new_user_weight[old_user_weight.size(0):] = torch.randn(len(user2idx) - old_user_weight.size(0), 8)
                model.user_embedding.weight.data = new_user_weight
                del state_dict['user_embedding.weight']
            
            if 'event_embedding.weight' in state_dict:
                old_event_weight = state_dict['event_embedding.weight']
                new_event_weight = torch.zeros(len(event2idx), 8)
                min_size = min(old_event_weight.size(0), len(event2idx))
                new_event_weight[:min_size] = old_event_weight[:min_size]
                if len(event2idx) > old_event_weight.size(0):
                    new_event_weight[old_event_weight.size(0):] = torch.randn(len(event2idx) - old_event_weight.size(0), 8)
                model.event_embedding.weight.data = new_event_weight
                del state_dict['event_embedding.weight']
            
            # Tải các tham số còn lại, bỏ qua lỗi kích thước
            model.load_state_dict(state_dict, strict=False)
        
        optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
        criterion = nn.BCELoss()
        
        # Chuẩn bị dữ liệu huấn luyện
        users = []
        events = []
        labels = []
        for _, row in interaction_df.iterrows():
            user_id = str(row["user_id"])
            event_id = str(row["event_id"])
            if user_id in user2idx and event_id in event2idx:
                users.append(user2idx[user_id])
                events.append(event2idx[event_id])
                labels.append(min(row["interaction_score"] / 3.0, 1.0))
        
        if not users:
            print("No valid interactions for training")
            return
        
        users = torch.tensor(users, dtype=torch.long)
        events = torch.tensor(events, dtype=torch.long)
        labels = torch.tensor(labels, dtype=torch.float32)
        
        dataset = TensorDataset(users, events, labels)
        dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
        
        # Huấn luyện mô hình
        model.train()
        for epoch in range(5):
            for user_batch, event_batch, label_batch in dataloader:
                optimizer.zero_grad()
                outputs = model(user_batch, event_batch).squeeze()
                loss = criterion(outputs, label_batch)
                loss.backward()
                optimizer.step()
            print(f"Epoch {epoch+1}, Loss: {loss.item():.4f}")
        
        # Lưu và tải lại mô hình
        torch.save(model.state_dict(), "model.pth")
        load_model_and_mappings()
        print("✅ Incremental training completed")
    except Exception as e:
        print(f"❌ Error in incremental training: {str(e)}")

# 🟢 Schedule incremental training every 3 minutes
def schedule_incremental_train():
    try:
        incremental_train()
    except Exception as e:
        print(f"❌ Error in incremental training: {str(e)}")
    threading.Timer(180, schedule_incremental_train).start()

# 🟢 Log interaction endpoint
@app.route("/log_interaction", methods=["POST"])
def log_interaction():
    data = request.get_json()
    user_id = data.get("user_id")
    event_id = data.get("event_id")
    interaction_type = data.get("interaction_type")
    
    if not all([user_id, event_id, interaction_type]):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Lưu tương tác vào MySQL
    try:
        if interaction_type == "booking":
            showing_time_df = pd.read_sql(
                f"SELECT showing_time_id FROM tbl_showing_time WHERE event_id = '{event_id}' LIMIT 1", engine
            )
            if showing_time_df.empty:
                return jsonify({"error": "No showing time found for event_id"}), 400
            showing_time_id = showing_time_df.iloc[0]["showing_time_id"]
            pd.DataFrame([{
                "user_id": user_id,
                "showing_time_id": showing_time_id,
                "payment_status": "CONFIRMED"
            }]).to_sql("tbl_booking", engine, if_exists="append", index=False)
        elif interaction_type == "wishlist":
            pd.DataFrame([{
                "user_id": user_id,
                "event_id": event_id
            }]).to_sql("tbl_wishlist", engine, if_exists="append", index=False)
        elif interaction_type == "view":
            pd.DataFrame([{
                "user_id": user_id,
                "event_id": event_id
            }]).to_sql("tbl_event_view", engine, if_exists="append", index=False)
        else:
            return jsonify({"error": "Invalid interaction_type"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to log interaction: {str(e)}"}), 500
    
    return jsonify({"status": "interaction logged"}), 200

# 📡 Recommendation API
@app.route("/recommend", methods=["GET"])
def recommend():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    
    if user_id not in user2idx:
        retrain_and_reload()
        if user_id not in user2idx:
            return jsonify({"error": f"user_id '{user_id}' not found after retraining"}), 400
    
    user_idx = torch.tensor([user2idx[user_id]] * len(event2idx), dtype=torch.long)
    event_idxs = torch.tensor(list(range(len(event2idx))), dtype=torch.long)
    
    try:
        with torch.no_grad():
            scores = model(user_idx, event_idxs).squeeze()
            k = min(5, len(event2idx))
            if k == 0:
                return jsonify({"user_id": user_id, "recommendations": []}), 200
            
            top_indices = torch.topk(scores, k=k).indices
            recommendations = [idx2event[i.item()] for i in top_indices]
        
        return jsonify({"user_id": user_id, "recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": f"Failed to generate recommendations: {str(e)}"}), 500

# 📦 Run at startup
if __name__ == "__main__":
    prepare_if_needed()
    threading.Timer(180, schedule_incremental_train).start()
    app.run(debug=True)