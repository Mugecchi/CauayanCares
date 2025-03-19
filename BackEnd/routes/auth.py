from flask import Blueprint, request, jsonify, session
from db import execute_query
from utils import verify_password, login_required,role_required, hash_password

auth_bp = Blueprint("auth", __name__)


# User login
@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = execute_query(
        "SELECT id, username, password, role FROM users WHERE username = %s",
        (username,), fetch_one=True
    )

    print("User found in DB:", user)  # Debugging step

    if not user:
        return jsonify({"error": "User not found"}), 401

    if verify_password(password, user[2]):
        session['user_id'] = user[0]
        session['username'] = user[1]
        session['role'] = user[3]
        print("Session Data:", session)  # Debugging step
        return jsonify({"message": "Login successful", "user": {"id": user[0], "username": user[1], "role": user[3]}}), 200

    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/api/logout', methods=['POST'])
@login_required
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully!"}), 200

# Get current user
@auth_bp.route('/api/user', methods=['GET'])
@login_required
def get_current_user():
    return jsonify({
        "id": session.get("user_id"),
        "username": session.get("username"),
        "role": session.get("role"),
    }), 200

# Create new user (Admin only)
@auth_bp.route('/api/users', methods=['POST'])
@login_required
@role_required('admin')
def create_user():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    role = data.get("role", "user")  # Default role is 'user'

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    existing_user = execute_query("SELECT id FROM users WHERE username = %s", (username,), fetch_one=True)
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = hash_password(password)  # Ensure password is hashed before storing
    execute_query(
        "INSERT INTO users (username, password, role) VALUES (%s, %s, %s)",
        (username, hashed_password, role),
        commit=True
    )

    return jsonify({"message": "User created successfully"}), 201

# Fetch all users (Admin only)
@auth_bp.route('/api/users', methods=['GET'])
@login_required
@role_required('admin')
def get_users():
    users = execute_query("SELECT id, username, role FROM users")
    return jsonify([{"id": u[0], "username": u[1], "role": u[2]} for u in users])

# Update user role or password (Admin only)
@auth_bp.route('/api/users/<int:user_id>', methods=['PUT'])
@login_required
@role_required('admin')
def update_user(user_id):
    data = request.json
    new_role = data.get("role")
    new_password = data.get("password")

    if not new_role and not new_password:
        return jsonify({"error": "Provide role or password to update"}), 400

    if new_role:
        execute_query("UPDATE users SET role = %s WHERE id = %s", (new_role, user_id), commit=True)

    if new_password:
        hashed_password = hash_password(new_password)  # Ensure new password is hashed
        execute_query("UPDATE users SET password = %s WHERE id = %s", (hashed_password, user_id), commit=True)

    return jsonify({"message": "User updated successfully"}), 200

# Delete user (Admin only)
@auth_bp.route('/api/users/<int:user_id>', methods=['DELETE'])
@login_required
@role_required('admin')
def delete_user(user_id):
    execute_query("DELETE FROM users WHERE id = %s", (user_id,), commit=True)
    return jsonify({"message": "User deleted successfully"}), 200

