
import bcrypt
from functools import wraps
from flask import jsonify, session# Password Hashing

# Password Hashing
def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

# Password verification
def verify_password(entered_password, stored_hash):
    return bcrypt.checkpw(entered_password.encode("utf-8"), stored_hash.encode("utf-8"))

# Middleware for authentication
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized access"}), 401
        return f(*args, **kwargs)
    return decorated_function

# Middleware for role-based access control
def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if "role" not in session or session["role"] != required_role:
                return jsonify({"error": "Access denied. Insufficient permissions."}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

