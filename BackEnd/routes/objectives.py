from flask import Blueprint, jsonify, request
from utils import login_required
from db import execute_query  # Ensure this is correctly imported

objectives_bp = Blueprint("objectives", __name__)

# Add or Update Objective or Implementation
@objectives_bp.route("/api/objectives_implementation", methods=["POST"])
@login_required
def add_or_update_objective():
    try:
        data = request.json
        query = """
            INSERT INTO objectives_implementation (ordinance_id, policy_objectives, lead_agency, supporting_agencies, key_provisions, programs_activities)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                policy_objectives = VALUES(policy_objectives),
                lead_agency = VALUES(lead_agency),
                supporting_agencies = VALUES(supporting_agencies),
                key_provisions = VALUES(key_provisions),
                programs_activities = VALUES(programs_activities)
        """
        execute_query(query, (
            data.get("ordinance_id"), 
            data.get("policy_objectives"), 
            data.get("lead_agency"), 
            data.get("supporting_agencies"),
            data.get("key_provisions"),
            data.get("programs_activities")
        ), commit=True)

        return jsonify({"message": "Objective added/updated successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to add/update Objective", "details": str(e)}), 500


# Get All Objectives
@objectives_bp.route("/api/objectives_implementation", methods=["GET"])
@login_required
def get_all_Objective():
    query = """
        SELECT o.id, o.title, o.number, o.status, o.document_type,
               oi.id AS objective_id, oi.policy_objectives, oi.lead_agency, oi.supporting_agencies, oi.key_provisions, oi.programs_activities
        FROM ordinances o
        LEFT JOIN objectives_implementation oi ON o.id = oi.ordinance_id
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
                "objectives_implementation": []
            }
        if row[5]:  # If objective exists
            ordinances_dict[ordinance_id]["objectives_implementation"].append({
                "id": row[5],
                "policy_objectives": row[6],
                "lead_agency": row[7],
                "supporting_agencies": row[8],
                "key_provisions": row[9],
                "programs_activities": row[10]
            })

    return jsonify(list(ordinances_dict.values()))


# ✅ **Update Objective (PUT)**
@objectives_bp.route("/api/objectives_implementation/<int:id>", methods=["PUT"])
@login_required
def update_objective(id):
    try:
        data = request.json
        query = """
            UPDATE objectives_implementation 
            SET policy_objectives = %s, 
                lead_agency = %s, 
                supporting_agencies = %s, 
                key_provisions = %s, 
                programs_activities = %s
            WHERE id = %s
        """
        execute_query(query, (
            data.get("policy_objectives"),
            data.get("lead_agency"),
            data.get("supporting_agencies"),
            data.get("key_provisions"),
            data.get("programs_activities"),
            id
        ), commit=True)

        return jsonify({"message": "Objective updated successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to update Objective", "details": str(e)}), 500


# ✅ **Delete Objective (DELETE)**
@objectives_bp.route("/api/objectives_implementation/<int:id>", methods=["DELETE"])
@login_required
def delete_objective(id):
    try:
        query = "DELETE FROM objectives_implementation WHERE id = %s"
        execute_query(query, (id,), commit=True)

        return jsonify({"message": "Objective deleted successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to delete Objective", "details": str(e)}), 500
