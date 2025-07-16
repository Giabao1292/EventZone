import pandas as pd
from sqlalchemy import create_engine

# Cấu hình kết nối MySQL
DB_USER = "root"
DB_PASSWORD = "123456"
DB_HOST = "localhost"
DB_PORT = "3306"
DB_NAME = "event"
engine = create_engine(f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

def load_data():
    # Lấy dữ liệu từ tbl_booking
    booking_query = """
    SELECT b.user_id, s.event_id, 3 AS interaction_score
    FROM tbl_booking b
    JOIN tbl_showing_time s ON b.showing_time_id = s.showing_time_id
    WHERE b.payment_status = 'CONFIRMED'
    """
    booking_df = pd.read_sql(booking_query, engine)

    # Lấy dữ liệu từ tbl_wishlist
    wishlist_query = """
    SELECT user_id, event_id, 2 AS interaction_score
    FROM tbl_wishlist
    """
    wishlist_df = pd.read_sql(wishlist_query, engine)

    # Lấy dữ liệu từ tbl_event_view
    view_query = """
    SELECT user_id, event_id, 1 AS interaction_score
    FROM tbl_event_view
    """
    view_df = pd.read_sql(view_query, engine)

    # Kết hợp dữ liệu
    interaction_df = pd.concat([booking_df, wishlist_df, view_df], ignore_index=True)
    
    # Xử lý trùng lặp (lấy max interaction_score)
    interaction_df = interaction_df.groupby(['user_id', 'event_id'])['interaction_score'].max().reset_index()
    
    # Lưu vào interaction_data.csv
    interaction_df.to_csv("interaction_data.csv", index=False)
    print("✅ Data saved to interaction_data.csv")

if __name__ == "__main__":
    load_data()