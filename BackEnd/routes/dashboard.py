from flask import Blueprint, jsonify
from db import execute_query
from utils import login_required

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard", methods=["GET"])
@login_required
def get_dashboard_counts():
    statuses = ["Pending", "Approved", "Amended", "Under Review", "Implemented"]
    counts = {"ordinances_count": execute_query("SELECT COUNT(*) FROM ordinances", fetch_one=True)[0]}

    for status in statuses:
        key = f"{status.lower().replace(' ', '_')}_count"
        counts[key] = execute_query("SELECT COUNT(*) FROM ordinances WHERE status = %s", (status,), fetch_one=True)[0]

    return jsonify(counts)
