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
            INSERT INTO documentation_reports (ordinance_id, related_documents)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE 
                related_documents = VALUES(related_documents)
        """
        execute_query(query, (
            data.get("ordinance_id"), data.get("related_documents")
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
        SELECT o.id AS ordinance_id, o.title, o.number, o.status, o.document_type,
               dr.id, dr.ordinance_id, dr.related_documents
        FROM ordinances o
        LEFT JOIN documentation_reports dr ON o.id = dr.ordinance_id
        """
        rows = execute_query(query)
        if not rows:
            return jsonify({"error": "No documentation records found"}), 404

        ordinances_dict = {}

        for row in rows:
            ordinance_id = row[0]
            if ordinance_id not in ordinances_dict:
                ordinances_dict[ordinance_id] = {
                    "ordinance_id": ordinance_id,
                    "title": row[1],
                    "number": row[2],
                    "status": row[3],
                    "document_type": row[4],
                    "documentation_reports": []  # Store related documents
                }
            if row[5] is not None:
                ordinances_dict[ordinance_id]["documentation_reports"].append({
                    "id": row[5],  # Documentation record ID
                    "ordinance_id": row[6],  # Ordinance ID reference
                    "related_documents": row[7]  # Actual related document data
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
            UPDATE documentation_reports
            SET related_documents = %s
            WHERE id = %s
        """
        execute_query(query, (
            data.get("related_documents"), doc_id
        ), commit=True)

        return jsonify({"message": "Documentation record updated successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to update documentation record", "details": str(e)}), 500


# ✅ Delete a Documentation Record
@documentation_bp.route("/api/documentation/<int:doc_id>", methods=["DELETE"])
@login_required
def delete_documentation(doc_id):
    try:
        query = "DELETE FROM documentation_reports WHERE id = %s"
        execute_query(query, (doc_id,), commit=True)
        return jsonify({"message": "Documentation record deleted successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to delete documentation record", "details": str(e)}), 500
