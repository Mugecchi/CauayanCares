from flask import Blueprint, jsonify, request
from utils import login_required
from db import execute_query

monitoring_bp = Blueprint("monitoring", __name__)

# Add or Update Monitoring Compliance
@monitoring_bp.route("/api/monitoring", methods=["POST", "PUT"])
@login_required
def add_or_update_monitoring():
    try:
        data = request.json
        if request.method == "POST":
            query = """
                INSERT INTO monitoring_compliance (ordinance_id, indicators_of_success, monitoring_frequency, compliance_rate, challenges, violations_reports, feedback_mechanisms)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                    indicators_of_success = VALUES(indicators_of_success),
                    monitoring_frequency = VALUES(monitoring_frequency),
                    compliance_rate = VALUES(compliance_rate),
                    challenges = VALUES(challenges),
                    violations_reports = VALUES(violations_reports),
                    feedback_mechanisms = VALUES(feedback_mechanisms)
            """
            execute_query(query, (
                data.get("ordinance_id"), data.get("indicators_of_success"),
                data.get("monitoring_frequency"), data.get("compliance_rate"),
                data.get("challenges"), data.get("violations_reports"),
                data.get("feedback_mechanisms")
            ), commit=True)
            return jsonify({"message": "Monitoring compliance added/updated successfully!"}), 201
        
        elif request.method == "PUT":
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
                data.get("id")
            ), commit=True)
            return jsonify({"message": "Monitoring compliance updated successfully!"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get All Monitoring Compliance Data
@monitoring_bp.route("/api/monitoring", methods=["GET"])
@login_required
def get_all_monitoring():
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
    try:
        query = "DELETE FROM monitoring_compliance WHERE id = %s"
        execute_query(query, (id,), commit=True)
        return jsonify({"message": "Monitoring compliance deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
