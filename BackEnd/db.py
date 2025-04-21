import os
import mysql.connector

def get_db_connection():
    if os.getenv("RAILWAY_ENVIRONMENT"):
        return mysql.connector.connect(
            host=os.getenv("MYSQLHOST"),
            user=os.getenv("MYSQLUSER"),
            password=os.getenv("MYSQLPASSWORD"),
            database=os.getenv("MYSQLDATABASE"),
            port=int(os.getenv("MYSQLPORT"))
        )
    else:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="1234",
            database="ordinances",
            port=3306
        )

def execute_query(query, params=(), fetch_one=False, commit=False):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute(query, params)
    result = cursor.fetchone() if fetch_one else cursor.fetchall()
    if commit:
        db.commit()
    cursor.close()
    db.close()
    return result
def exec_tuple(query, params=(), fetch_one=False, commit=False):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)  # <-- This line fixes the tuple vs dict issue
    cursor.execute(query, params)
    result = cursor.fetchone() if fetch_one else cursor.fetchall()
    if commit:
        db.commit()
    cursor.close()
    db.close()
    return result
