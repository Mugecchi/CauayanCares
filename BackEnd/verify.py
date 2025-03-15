import bcrypt

def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(entered_password, stored_hash):
    return bcrypt.checkpw(entered_password.encode("utf-8"), stored_hash.encode("utf-8"))

# Create a hashed password
password = "admin123"
hashed_pw = hash_password(password)
print("Stored Hash:", hashed_pw)

# Verify
is_valid = verify_password(password, hashed_pw)
print("Password Valid:", is_valid)
