import mysql.connector
import bcrypt

# Database Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="migguiyers325467",
    database="ordinances"
)
cursor = db.cursor()

# Admin Credentials
admin_username = "admin1"
admin_password = "Admin@123"  # Change this to a secure password

# Hash the password
hashed_password = bcrypt.hashpw(admin_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

# Insert the Admin User
cursor.execute(
    "INSERT INTO users (username, password, role) VALUES (%s, %s, %s)",
    (admin_username, hashed_password, "admin")
)
db.commit()

print("✅ Admin user created successfully!")

cursor.close()
db.close()
