from flask import Blueprint, jsonify, request, session
from utils import login_required, role_required
from db import execute_query  # Make sure this works with your DB setup

logs_bp = Blueprint("logs", __name__)

@logs_bp.route("/api/records/logs", methods=["GET"])
@login_required
@role_required('admin')  # Only admins can view logs
def view_ordinance_logs():
    try:
        query = """
            SELECT l.ordinance_id, l.action, l.timestamp, u.user_lastname, r.title, r.number
            FROM records_logs l
            JOIN users u ON l.user_id = u.id
            JOIN ordinances r ON l.ordinance_id = r.id
            ORDER BY l.timestamp DESC
        """
        logs = execute_query(query)

        if not logs:
            return jsonify({"error": "No logs found"}), 404

        return jsonify([
            {
                "ordinance_id": row[0],
                "action": row[1],
                "timestamp": row[2],
                "last_name": row[3],
                "title": row[4],
                "number": row[5]
            } for row in logs
        ])
    except Exception as e:
        print("🔥 LOG ERROR:", e)  # This will print in the console
        return jsonify({"error": "Internal server error"}), 500
