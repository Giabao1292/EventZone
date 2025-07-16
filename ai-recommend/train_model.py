import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import json
# Load dữ liệu từ interaction_data.csv
df = pd.read_csv("interaction_data.csv")

# Chuyển interaction_score > 0 thành 1 (tương tác), 0 là không tương tác
df['interaction'] = (df['interaction_score'] > 0).astype(int)

# Encode user_id và event_id
user_ids = df['user_id'].unique()
event_ids = df['event_id'].unique()
user2idx = {user_id: idx for idx, user_id in enumerate(user_ids)}
event2idx = {event_id: idx for idx, event_id in enumerate(event_ids)}

df['user'] = df['user_id'].map(user2idx)
df['event'] = df['event_id'].map(event2idx)

# Chuẩn bị tensor
X = torch.tensor(df[['user', 'event']].values, dtype=torch.long)
y = torch.tensor(df['interaction'].values, dtype=torch.float32)

# Mô hình NCF
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

# Khởi tạo model
model = NCF(len(user_ids), len(event_ids))
criterion = nn.BCELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# Huấn luyện
for epoch in range(50):
    model.train()
    pred = model(X[:, 0], X[:, 1]).squeeze()
    loss = criterion(pred, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    if epoch % 10 == 0:
        print(f"Epoch {epoch}, Loss: {loss.item():.4f}")

# Lưu model
torch.save(model.state_dict(), "model.pth")

# Lưu mapping để Flask dùng
with open("user2idx.json", "w") as f:
    json.dump({str(k): v for k, v in user2idx.items()}, f)

with open("event2idx.json", "w") as f:
    json.dump({str(k): v for k, v in event2idx.items()}, f)
