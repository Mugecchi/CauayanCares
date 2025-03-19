from flask import Blueprint, request, jsonify
from utils import login_required
from db import execute_query

documentation_bp = Blueprint("documentation", __name__)

# ✅ Create or Update a Documentation Record
@documentation_bp.route("/api/documentation", methods=["POST"])
@login_required
def add_or_update_documentation():
    try:
        data = request.json
        query = """
            INSERT INTO documentation_records (ordinance_id, funding_source, outcomes_results, 
                gender_responsiveness_impact, community_benefits, adjustments_needed)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                funding_source = VALUES(funding_source),
                outcomes_results = VALUES(outcomes_results),
                gender_responsiveness_impact = VALUES(gender_responsiveness_impact),
                community_benefits = VALUES(community_benefits),
                adjustments_needed = VALUES(adjustments_needed)
        """
        execute_query(query, (
            data.get("ordinance_id"), data.get("funding_source"), data.get("outcomes_results"),
            data.get("gender_responsiveness_impact"), data.get("community_benefits"), data.get("adjustments_needed")
        ), commit=True)

        return jsonify({"message": "Documentation record added/updated successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to add/update documentation record", "details": str(e)}), 500


# ✅ Retrieve All Documentation Records (With Ordinances)
@documentation_bp.route("/api/documentation", methods=["GET"])
@login_required
def get_all_documentation():
    try:
        query = """
        SELECT o.id, o.title, o.number, o.status, o.document_type,
               dr.id, dr.ordinance_id, dr.funding_source, dr.outcomes_results, 
               dr.gender_responsiveness_impact, dr.community_benefits, dr.adjustments_needed
        FROM ordinances o
        LEFT JOIN documentation_records dr ON o.id = dr.ordinance_id
        """
        rows = execute_query(query)
        if not rows:
            return jsonify({"error": "No documentation records found"}), 404

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
                    "documentation_records": []
                }
            if row[5] is not None:
                ordinances_dict[ordinance_id]["documentation_records"].append({
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


# ✅ Update an Existing Documentation Record
@documentation_bp.route("/api/documentation/<int:doc_id>", methods=["PUT"])
@login_required
def update_documentation(doc_id):
    try:
        data = request.json
        query = """
            UPDATE documentation_records
            SET funding_source = %s, outcomes_results = %s, gender_responsiveness_impact = %s,
                community_benefits = %s, adjustments_needed = %s
            WHERE id = %s
        """
        execute_query(query, (
            data.get("funding_source"), data.get("outcomes_results"),
            data.get("gender_responsiveness_impact"), data.get("community_benefits"),
            data.get("adjustments_needed"), doc_id
        ), commit=True)

        return jsonify({"message": "Documentation record updated successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to update documentation record", "details": str(e)}), 500


# ✅ Delete a Documentation Record
@documentation_bp.route("/api/documentation/<int:doc_id>", methods=["DELETE"])
@login_required
def delete_documentation(doc_id):
    try:
        query = "DELETE FROM documentation_records WHERE id = %s"
        execute_query(query, (doc_id,), commit=True)
        return jsonify({"message": "Documentation record deleted successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to delete documentation record", "details": str(e)}), 500
