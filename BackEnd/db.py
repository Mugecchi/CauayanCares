import os
import mysql.connector

def get_db_connection():
    try:
        return mysql.connector.connect(
            host=os.getenv("MYSQLHOST", "localhost"),
            user=os.getenv("MYSQLUSER", "root"),
            password=os.getenv("MYSQLPASSWORD", "1234"),
            database=os.getenv("MYSQLDATABASE", "ordinances"),
            port=int(os.getenv("MYSQLPORT", 3306)),
        )
    except mysql.connector.Error as err:
        print(f"⚠️ Database connection error: {err}")
        raise


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
