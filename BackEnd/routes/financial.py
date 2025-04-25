from flask import Blueprint, jsonify, request, session
from utils import login_required, log_action  # Assuming log_action is implemented in utils
from db import execute_query  # Ensure this is correctly imported

financial_bp = Blueprint("financial", __name__)

# Add or Update Budget Allocation
@financial_bp.route("/api/financial", methods=["POST"])
@login_required
def add_or_update_financial():
    try:
        data = request.json
        user_id = session.get("user_id")  # Assuming user_id is stored in session
        
        query = """
            INSERT INTO budget_allocation (ordinance_id, allocated_budget, utilized_budget, gad_budget, financial_transparency_measures)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                allocated_budget = VALUES(allocated_budget),
                utilized_budget = VALUES(utilized_budget),
                gad_budget = VALUES(gad_budget),
                financial_transparency_measures = VALUES(financial_transparency_measures)
        """
        execute_query(query, (
            data.get("ordinance_id"), 
            data.get("allocated_budget"), 
            data.get("utilized_budget"), 
            data.get("gad_budget"),
            data.get("financial_transparency_measures")
        ), commit=True)

        log_action(user_id, "Budget Allocation added successfully")
        return jsonify({"message": "Budget Allocation added!"})

    except Exception as e:
        log_action(user_id, f"Failed to add Budget Allocation: {str(e)}")
        return jsonify({"error": "Failed to add Budget Allocation", "details": str(e)}), 500


# Get All Budget Allocations
@financial_bp.route("/api/financial", methods=["GET"])
@login_required
def get_all_Budget():
    user_id = session.get("user_id")
    try:
        query = """
            SELECT o.id, o.title, o.number, o.status, o.document_type,
                   ba.id AS budget_id, ba.ordinance_id, ba.allocated_budget, ba.utilized_budget, 
                   ba.gad_budget, ba.financial_transparency_measures
            FROM ordinances o
            LEFT JOIN budget_allocation ba ON o.id = ba.ordinance_id
                WHERE o.is_deleted = 0;
        """
        rows = execute_query(query)

        if not rows:
            return jsonify({"error": "No ordinances found"}), 404

        ordinances_dict = {}

        for row in rows:
            ordinance_id = row[0]  # ID of the ordinance
            if ordinance_id not in ordinances_dict:
                ordinances_dict[ordinance_id] = {
                    "id": ordinance_id,  
                    "title": row[1],  
                    "number": row[2],  
                    "status": row[3],  
                    "document_type": row[4],  
                    "budget_allocation": []
                }
            if row[5] is not None:  # Ensure budget_allocation exists
                ordinances_dict[ordinance_id]["budget_allocation"].append({
                    "id": row[5],  
                    "ordinance_id": row[6],  
                    "allocated_budget": row[7],  
                    "utilized_budget": row[8],  
                    "gad_budget": row[9],  
                    "financial_transparency_measures": row[10]  
                })

        return jsonify(list(ordinances_dict.values()))
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✅ **Update Budget Allocation (PUT)**
@financial_bp.route("/api/financial/<int:id>", methods=["PUT"])
@login_required
def update_financial(id):
    user_id = session.get("user_id")
    try:
        data = request.json
        log_action(user_id, "Updating Budget Allocation")
        
        query = """
            UPDATE budget_allocation 
            SET allocated_budget = %s, 
                utilized_budget = %s, 
                gad_budget = %s, 
                financial_transparency_measures = %s
            WHERE id = %s
        """
        execute_query(query, (
            data.get("allocated_budget"),
            data.get("utilized_budget"),
            data.get("gad_budget"),
            data.get("financial_transparency_measures"),
            id
        ), commit=True)

        log_action(user_id, "Budget Allocation Edited successfully")
        return jsonify({"message": "Budget Allocation Edited successfully!"})

    except Exception as e:
        log_action(user_id, f"Failed to update Budget Allocation: {str(e)}")
        return jsonify({"error": "Failed to update Budget Allocation", "details": str(e)}), 500


# ✅ **Delete Budget Allocation (DELETE)**
@financial_bp.route("/api/financial/<int:id>", methods=["DELETE"])
@login_required
def delete_financial(id):
    user_id = session.get("user_id")
    try:
        log_action(user_id, "Deleting Budget Allocation")
        
        query = "DELETE FROM budget_allocation WHERE id = %s"
        execute_query(query, (id,), commit=True)

        log_action(user_id, "Budget Allocation deleted successfully")
        return jsonify({"message": "Budget Allocation deleted successfully!"})

    except Exception as e:
        log_action(user_id, f"Failed to delete Budget Allocation: {str(e)}")
        return jsonify({"error": "Failed to delete Budget Allocation", "details": str(e)}), 500
