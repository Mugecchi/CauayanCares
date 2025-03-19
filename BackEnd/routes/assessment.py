from flask import Blueprint, jsonify, request
from utils import login_required
from db import execute_query

assessment_bp = Blueprint("assessment", __name__)

# Add or Update Impact Assessment
@assessment_bp.route("/api/assessment", methods=["POST", "PUT"])
@login_required
def add_or_update_assessment():
    try:
        data = request.json
        if request.method == "POST":
            query = """
                INSERT INTO impact_assessment (ordinance_id, funding_source, outcomes_results, gender_responsiveness_impact, community_benefits, adjustments_needed)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                    funding_source = VALUES(funding_source),
                    outcomes_results = VALUES(outcomes_results),
                    gender_responsiveness_impact = VALUES(gender_responsiveness_impact),
                    community_benefits = VALUES(community_benefits),
                    adjustments_needed = VALUES(adjustments_needed)
            """
            execute_query(query, (
                data.get("ordinance_id"), data.get("funding_source"),
                data.get("outcomes_results"), data.get("gender_responsiveness_impact"),
                data.get("community_benefits"), data.get("adjustments_needed")
            ), commit=True)
            return jsonify({"message": "Impact Assessment added/updated successfully!"}), 201
        
        elif request.method == "PUT":
            query = """
                UPDATE impact_assessment 
                SET funding_source = %s, 
                    outcomes_results = %s, 
                    gender_responsiveness_impact = %s, 
                    community_benefits = %s, 
                    adjustments_needed = %s
                WHERE id = %s
            """
            execute_query(query, (
                data.get("funding_source"),
                data.get("outcomes_results"),
                data.get("gender_responsiveness_impact"),
                data.get("community_benefits"),
                data.get("adjustments_needed"),
                data.get("id")
            ), commit=True)
            return jsonify({"message": "Impact Assessment updated successfully!"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get All Impact Assessments
@assessment_bp.route("/api/assessment", methods=["GET"])
@login_required
def get_all_assessment():
    try:
        query = """
        SELECT o.id, o.title, o.number, o.status, o.document_type,
            ic.id, ic.ordinance_id, ic.funding_source, ic.outcomes_results, 
            ic.gender_responsiveness_impact, ic.community_benefits, ic.adjustments_needed
        FROM ordinances o
        LEFT JOIN impact_assessment ic ON o.id = ic.ordinance_id
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
                    "impact_assessment": []
                }
            if row[5] is not None:
                ordinances_dict[ordinance_id]["impact_assessment"].append({
                    "id": row[5],
                    "ordinance_id": row[6],
                    "funding_source": row[7],
                    "outcomes_results": row[8],
                    "gender_responsiveness_impact": row[9],
                    "community_benefits": row[10],
                    "adjustments_needed": row[11]
                })

        return jsonify(list(ordinances_dict.values()))

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete Impact Assessment Entry
@assessment_bp.route("/api/assessment/<int:id>", methods=["DELETE"])
@login_required
def delete_assessment(id):
    try:
        query = "DELETE FROM impact_assessment WHERE id = %s"
        execute_query(query, (id,), commit=True)
        return jsonify({"message": "Impact Assessment deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
