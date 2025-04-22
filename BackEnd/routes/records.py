from flask import Blueprint, request, jsonify, send_from_directory, current_app,session
from db import execute_query
from utils import login_required, role_required
import os
import time

ordinances_bp = Blueprint("ordinances", __name__)

# Helper function to validate file types
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'jpg', 'jpeg', 'png'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Upload Ordinance and related data to multiple tables
@ordinances_bp.route("/api/ordinances", methods=["POST"])
def add_ordinance():
    try:
        # Get form data
        data = request.form
        file = request.files.get("file")
        file_path = None

        # Validate file type if file is provided
        if file:
            if not allowed_file(file.filename):
                return jsonify({"error": "Invalid file type. Only PDF, DOCX, JPG, PNG files are allowed."}), 400
            file_path = file.filename
            file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], file.filename))

        # Check for duplicate ordinance number
        existing = execute_query("SELECT COUNT(*) FROM ordinances WHERE number = %s", (data.get("number"),), fetch_one=True)
        if existing[0] > 0:
            return jsonify({"error": "Record with this Number already exists!"}), 400

        # Insert Ordinance Data
        ordinance_query = """
            INSERT INTO ordinances (title, number, date_issued, details, document_type, date_effectivity, status, related_ordinances, file_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        execute_query(ordinance_query, (
            data.get("title"), data.get("number"), data.get("dateIssued"), data.get("details"),
            data.get("documentType"), data.get("dateEffectivity"), data.get("status"),
            data.get("relatedOrdinances"), file_path
        ), commit=True)

        # Proceed with the rest of the insert logic...
        # Fetch the inserted ordinance_id to use in other tables
        ordinance_id = execute_query("SELECT MAX(id) from ordinances", fetch_one=True)[0]

        # Check if ordinance_id is None or invalid
        if not ordinance_id:
            raise Exception("Failed to retrieve ordinance ID after insertion.")

        # Log the fetched ordinance_id
        current_app.logger.info(f"Retrieved ordinance_id: {ordinance_id}")

        # Insert Coverage Scope Data (assuming this info is part of the request)
        coverage_scope_query = """
            INSERT INTO coverage_scope (ordinance_id, inclusive_period, target_beneficiaries, geographical_coverage)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                inclusive_period = VALUES(inclusive_period),
                target_beneficiaries = VALUES(target_beneficiaries),
                geographical_coverage = VALUES(geographical_coverage)
        """
        execute_query(coverage_scope_query, (
            ordinance_id, 
            data.get("inclusive_period") or None,  # Allow null if missing
            data.get("target_beneficiaries") or None,  # Allow null if missing
            data.get("geographical_coverage") or None  # Allow null if missing
        ), commit=True)

        # Insert Financial Data
        financial_query = """
            INSERT INTO budget_allocation (ordinance_id, allocated_budget, utilized_budget, gad_budget, financial_transparency_measures)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                allocated_budget = VALUES(allocated_budget),
                utilized_budget = VALUES(utilized_budget),
                gad_budget = VALUES(gad_budget),
                financial_transparency_measures = VALUES(financial_transparency_measures)
        """
        execute_query(financial_query, (
            ordinance_id, 
            data.get("allocated_budget") or None,  # Allow null if missing
            data.get("utilized_budget") or None,  # Allow null if missing
            data.get("gad_budget") or None,  # Allow null if missing
            data.get("financial_transparency_measures") or None  # Allow null if missing
        ), commit=True)

        # Insert Objective Data
        objective_query = """
            INSERT INTO objectives_implementation (ordinance_id, policy_objectives, lead_agency, supporting_agencies, key_provisions, programs_activities)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                policy_objectives = VALUES(policy_objectives),
                lead_agency = VALUES(lead_agency),
                supporting_agencies = VALUES(supporting_agencies),
                key_provisions = VALUES(key_provisions),
                programs_activities = VALUES(programs_activities)
        """
        execute_query(objective_query, (
            ordinance_id, 
            data.get("policy_objectives") or None,  # Allow null if missing
            data.get("lead_agency") or None,  # Allow null if missing
            data.get("supporting_agencies") or None,  # Allow null if missing
            data.get("key_provisions") or None,  # Allow null if missing
            data.get("programs_activities") or None  # Allow null if missing
        ), commit=True)

        monitoring_query = """
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
        execute_query(monitoring_query, (
                data.get("ordinance_id"), data.get("indicators_of_success"),
                data.get("monitoring_frequency"), data.get("compliance_rate"),
                data.get("challenges"), data.get("violations_reports"),
                data.get("feedback_mechanisms")
            ), commit=True)
        assessment_query = """  INSERT INTO impact_assessment (ordinance_id, funding_source, outcomes_results, gender_responsiveness_impact, community_benefits, adjustments_needed)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE 
                    funding_source = VALUES(funding_source),
                    outcomes_results = VALUES(outcomes_results),
                    gender_responsiveness_impact = VALUES(gender_responsiveness_impact),
                    community_benefits = VALUES(community_benefits),
                    adjustments_needed = VALUES(adjustments_needed)
        """
        execute_query(assessment_query, (
            ordinance_id, 
            data.get("funding_source") or None,  # Allow null if missing
            data.get("outcomes_results") or None,  # Allow null if missing
            data.get("gender_responsiveness_impact") or None,  # Allow null if missing
            data.get("community_benefits") or None,  # Allow null if missing
            data.get("adjustments_needed") or None  # Allow null if missing
        ), commit=True)
        user_id = session.get("user_id")
        log_query = "INSERT INTO records_logs (user_id, ordinance_id, action) VALUES (%s, %s, 'added')"
        execute_query(log_query, (user_id, ordinance_id), commit=True)

        return jsonify({"message": "Record and related data added successfully!"}), 201
    


    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error in adding record: {str(e)}")
        return jsonify({"error": f"Failed to add record. {str(e)}"}), 500
    
@ordinances_bp.route("/api/ordinances", methods=["GET"])
@login_required
def get_ordinances():
    # Pagination parameters (default values: page 1, per_page 10)
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))

    # Calculate the OFFSET for pagination
    offset = (page - 1) * per_page

    # Query to fetch ordinances with pagination
    query = """
        SELECT id, title, number, date_issued, date_effectivity, details, document_type, status, file_path
        FROM ordinances
        WHERE is_deleted = FALSE
        LIMIT %s OFFSET %s

    """
    ordinances = execute_query(query, (per_page, offset))

    # Query to get the total number of ordinances
    count_query = "SELECT COUNT(*) FROM ordinances"
    total_count = execute_query(count_query)[0][0]  # Fetch the count value from the result

    # Calculate the total number of pages
    total_pages = (total_count + per_page - 1) // per_page  # Ceiling division

    # Return the ordinances and pagination information as a JSON response
    return jsonify({
        "ordinances": [dict(zip(["id", "title", "number", "date_issued", "date_effectivity", "details", "document_type", "status", "file_path"], row)) for row in ordinances],
        "total_pages": total_pages,
        "total_count": total_count,
        "current_page": page
    })

# Serve Uploaded Files (Proper File Serving)
@ordinances_bp.route("/uploads/<path:filename>")
def serve_file(filename):
    try:
        upload_folder = current_app.config["UPLOAD_FOLDER"]  # Access inside function
        return send_from_directory(upload_folder, filename, as_attachment=False)
    except Exception:
        return jsonify({"error": "File not found"}), 404

# Delete Ordinance and Related Data
@ordinances_bp.route("/api/ordinances/<int:id>", methods=["DELETE"])
@login_required
@role_required('admin')
def delete_ordinance(id):
    try:
        # Optional: Get file_path for possible file deletion
        file_record = execute_query("SELECT file_path FROM ordinances WHERE id = %s AND is_deleted = FALSE", (id,), fetch_one=True)
        if not file_record:
            return jsonify({"error": "Ordinance not found or already deleted."}), 404

        # Delete related records (if not using ON DELETE CASCADE)
        related_tables = [
            "budget_allocation",
            "coverage_scope",
            "documentation_reports",
            "impact_assessment",
            "objectives_implementation",
            "monitoring_compliance"
        ]
        for table in related_tables:
            execute_query(f"DELETE FROM {table} WHERE ordinance_id = %s", (id,), commit=True)

        # Log the deletion
        user_id = session.get("user_id")
        log_query = """
            INSERT INTO records_logs (user_id, ordinance_id, action, deleted_at)
            VALUES (%s, %s, 'deleted', NOW())
            ON DUPLICATE KEY UPDATE action = 'deleted', deleted_at = NOW()
        """
        execute_query(log_query, (user_id, id), commit=True)

        # Soft-delete the ordinance
        soft_delete_query = "UPDATE ordinances SET is_deleted = TRUE WHERE id = %s"
        execute_query(soft_delete_query, (id,), commit=True)

        return jsonify({"message": "Ordinance deleted successfully."}), 200

    except Exception as e:
        current_app.logger.error(f"Error deleting ordinance ID {id}: {str(e)}")
        return jsonify({"error": f"Failed to delete ordinance. {str(e)}"}), 500

# Update Ordinance Status
@ordinances_bp.route("/api/ordinances/<int:id>", methods=["PUT"])
@login_required
def update_status(id):
    data = request.json
    if not data.get("status"):
        return jsonify({"error": "Status is required"}), 400
    execute_query("UPDATE ordinances SET status = %s WHERE id = %s", (data["status"], id), commit=True)
    # After updating the ordinance status
    user_id = session.get("user_id")
    log_query = "INSERT INTO records_logs (user_id, ordinance_id, action) VALUES (%s, %s, 'edited')"
    execute_query(log_query, (user_id, id), commit=True)

    return jsonify({"message": "Status updated successfully!"})
