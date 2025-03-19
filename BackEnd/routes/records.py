from flask import Blueprint, request, jsonify, send_from_directory, current_app
from db import execute_query
from utils import login_required, role_required
import os


ordinances_bp = Blueprint("ordinances", __name__)

# Upload Ordinance
@ordinances_bp.route("/api/ordinances", methods=["POST"])
def add_ordinance():
    try:
        data = request.form
        file = request.files.get("file")
        file_path = file.filename if file else None

        # Check for duplicate title
        existing = execute_query("SELECT COUNT(*) FROM ordinances WHERE number = %s", (data.get("number"),), fetch_one=True)
        if existing[0] > 0:
            return jsonify({"error": "Record with this Number already exists!"}), 400

        if file:
            file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], file.filename))

        query = """
            INSERT INTO ordinances (title, number, date_issued, details, document_type, date_effectivity, status, related_ordinances, file_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        execute_query(query, (
            data.get("title"), data.get("number"), data.get("dateIssued"), data.get("details"),
            data.get("documentType"), data.get("dateEffectivity"), data.get("status"),
            data.get("relatedOrdinances"), file_path
        ), commit=True)

        return jsonify({"message": "Ordinance added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch Ordinances
@ordinances_bp.route("/api/ordinances", methods=["GET"])
@login_required

def get_ordinances():
    query = "SELECT id, title, number, details, document_type, status, file_path FROM ordinances"
    ordinances = execute_query(query)
    return jsonify([dict(zip(["id", "title", "number", "details", "document_type", "status", "file_path"], row)) for row in ordinances])

# Serve Uploaded Files
@ordinances_bp.route('/uploads/<filename>')
def serve_file(filename):
    uploads_dir = os.path.join(current_app.root_path, 'uploads')
    return send_from_directory(uploads_dir, filename)


def uploaded_file(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)

# Delete Ordinance
@ordinances_bp.route("/api/ordinances/<int:id>", methods=["DELETE"])
@login_required
@role_required('admin')
def delete_ordinance(id):
    file_record = execute_query("SELECT file_path FROM ordinances WHERE id = %s", (id,), fetch_one=True)
    if file_record and file_record[0]:
        file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], file_record[0])
        if os.path.exists(file_path):
            os.remove(file_path)

    execute_query("DELETE FROM ordinances WHERE id = %s", (id,), commit=True)
    return jsonify({"message": "Ordinance deleted successfully!"})

# Update Ordinance Status
@ordinances_bp.route("/api/ordinances/<int:id>", methods=["PUT"])
@login_required

def update_status(id):
    data = request.json
    if not data.get("status"):
        return jsonify({"error": "Status is required"}), 400
    execute_query("UPDATE ordinances SET status = %s WHERE id = %s", (data["status"], id), commit=True)
    return jsonify({"message": "Status updated successfully!"})
