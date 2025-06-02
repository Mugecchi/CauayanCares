from flask import Blueprint, jsonify, request, session
from utils import login_required, log_action
from db import execute_query  # Ensure this is correctly imported

coverage_bp = Blueprint("coverage", __name__)

@coverage_bp.route("/api/ordinancesCoverage", methods=["GET"])
@login_required
def get_all_ordinances_with_scope():
    query = """
        SELECT o.id, o.title, o.number, o.status, o.document_type,
            cs.id AS coverage_id, o.date_issued, cs.target_beneficiaries, cs.geographical_coverage
        FROM ordinances o
        LEFT JOIN coverage_scope cs ON o.id = cs.ordinance_id
        WHERE o.is_deleted = 0;
        order by o.id desc
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
                "coverage_scopes": []
            }
        if row[5]:  # If coverage exists
            ordinances_dict[ordinance_id]["coverage_scopes"].append({
                "id": row[5],
                "inclusive_period": row[6],
                "target_beneficiaries": row[7],
                "geographical_coverage": row[8]
            })

    return jsonify(list(ordinances_dict.values()))

@coverage_bp.route("/api/coverage_scope", methods=["POST"])
@login_required
def add_or_update_coverage_scope():
    try:
        data = request.json
        query = """
            INSERT INTO coverage_scope (ordinance_id, inclusive_period, target_beneficiaries, geographical_coverage)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                inclusive_period = VALUES(inclusive_period),
                target_beneficiaries = VALUES(target_beneficiaries),
                geographical_coverage = VALUES(geographical_coverage)
        """
        execute_query(query, (
            data.get("ordinance_id"), 
            data.get("inclusive_period"), 
            data.get("target_beneficiaries"), 
            data.get("geographical_coverage")
        ), commit=True)

        # Get user_id from session and log the action as 'edited'
        user_id = session.get("user_id")
        if user_id:
            log_action(ordinance_id=data.get("ordinance_id"), action="edited")
        else:
            print("User not authenticated")

        return jsonify({"message": "Coverage scope added/updated successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to add/update coverage scope", "details": str(e)}), 500


@coverage_bp.route("/api/coverage_scope/<int:id>", methods=["PUT"])
@login_required
def update_coverage_scope(id):
    try:
        data = request.json

        query = """
            UPDATE coverage_scope 
            SET inclusive_period = %s, 
                target_beneficiaries = %s, 
                geographical_coverage = %s
            WHERE id = %s
        """

        execute_query(query, (
            data.get("inclusive_period"),
            data.get("target_beneficiaries"),
            data.get("geographical_coverage"),
            id
        ), commit=True)

        # Get user_id from session and log the action as 'edited'
        user_id = session.get("user_id")
        if user_id:
            log_action(ordinance_id=id, action="edited")
        else:
            print("User not authenticated")

        return jsonify({"message": "Coverage scope updated successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to update coverage scope", "details": str(e)}), 500
