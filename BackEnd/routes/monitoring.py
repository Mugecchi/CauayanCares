from flask import Blueprint, jsonify, request, session
from utils import login_required, log_action  # Assuming log_action is implemented in utils
from db import execute_query

monitoring_bp = Blueprint("monitoring", __name__)

@monitoring_bp.route("/api/monitoring", methods=["POST"])
@login_required
def add_monitoring():
    try:
        data = request.json
        user_id = session.get("user_id")  # Assuming user_id is stored in session
        ordinance_id = data.get("ordinance_id")
        if not ordinance_id:
            return jsonify({"error": "ordinance_id is required"}), 400

        query = """
            INSERT INTO monitoring_compliance (
                ordinance_id, indicators_of_success, monitoring_frequency,
                compliance_rate, challenges, violations_reports, feedback_mechanisms
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                indicators_of_success = VALUES(indicators_of_success),
                monitoring_frequency = VALUES(monitoring_frequency),
                compliance_rate = VALUES(compliance_rate),
                challenges = VALUES(challenges),
                violations_reports = VALUES(violations_reports),
                feedback_mechanisms = VALUES(feedback_mechanisms)
        """
        execute_query(query, (
            ordinance_id,
            data.get("indicators_of_success"),
            data.get("monitoring_frequency"),
            data.get("compliance_rate"),
            data.get("challenges"),
            data.get("violations_reports"),
            data.get("feedback_mechanisms")
        ), commit=True)

        log_action(user_id, "Monitoring compliance added successfully")
        return jsonify(message="Monitoring compliance added successfully!"), 201

    except Exception as e:
        return jsonify(error=str(e)), 500
    
@monitoring_bp.route("/api/monitoring/<int:id>", methods=["PUT"])
@login_required
def update_monitoring(id):
    user_id = session.get("user_id")
    try:
        data = request.json
        log_action(user_id, "Updating monitoring compliance")

        query = """
            UPDATE monitoring_compliance 
            SET indicators_of_success = %s, 
                monitoring_frequency = %s, 
                compliance_rate = %s, 
                challenges = %s, 
                violations_reports = %s, 
                feedback_mechanisms = %s
            WHERE id = %s
        """
        execute_query(query, (
            data.get("indicators_of_success"),
            data.get("monitoring_frequency"),
            data.get("compliance_rate"),
            data.get("challenges"),
            data.get("violations_reports"),
            data.get("feedback_mechanisms"),
            id
        ), commit=True)

        log_action(user_id, "Monitoring compliance edited successfully")
        return jsonify(message="Monitoring compliance edited successfully!")

    except Exception as e:
        log_action(user_id, f"Failed to update monitoring compliance: {str(e)}")
        return jsonify(error=str(e)), 500

# Get All Monitoring Compliance Data
@monitoring_bp.route("/api/monitoring", methods=["GET"])
@login_required
def get_all_monitoring():
    user_id = session.get("user_id")
    try:
        query = """
        SELECT o.id, o.title, o.number, o.status, o.document_type,
            mc.id, mc.ordinance_id, mc.indicators_of_success, mc.monitoring_frequency, 
            mc.compliance_rate, mc.challenges, mc.violations_reports, mc.feedback_mechanisms
        FROM ordinances o
        LEFT JOIN monitoring_compliance mc ON o.id = mc.ordinance_id
            WHERE o.is_deleted = 0;
        """
        rows = execute_query(query)
        if not rows:
            return jsonify({"error": "No ordinances found"}), 404

        ordinances_dict = {}

        for row in rows:
            ordinance_id = row[0]
            if ordinance_id not in ordinances_dict:
                ordinances_dict[ordinance_id] = {
                    "id": ordinance_id,
                    "title": row[1],
                    "number": row[2],
                    "status": row[3],
                    "document_type": row[4],
                    "monitoring_compliance": []
                }
            if row[5] is not None:
                ordinances_dict[ordinance_id]["monitoring_compliance"].append({
                    "id": row[5],
                    "ordinance_id": row[6],
                    "indicators_of_success": row[7],
                    "monitoring_frequency": row[8],
                    "compliance_rate": row[9],
                    "challenges": row[10],
                    "violations_reports": row[11],
                    "feedback_mechanisms": row[12]
                })

        return jsonify(list(ordinances_dict.values()))

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete Monitoring Compliance Entry
@monitoring_bp.route("/api/monitoring/<int:id>", methods=["DELETE"])
@login_required
def delete_monitoring(id):
    user_id = session.get("user_id")
    try:

        query = "DELETE FROM monitoring_compliance WHERE id = %s"
        execute_query(query, (id,), commit=True)

        log_action(user_id, "Monitoring compliance entry deleted successfully")
        return jsonify({"message": "Monitoring compliance deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
