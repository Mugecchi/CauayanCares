from flask import Blueprint, request, jsonify, send_from_directory, session
from werkzeug.utils import secure_filename
import os
import uuid
from utils import login_required, log_action
from db import execute_query

documentation_bp = Blueprint("documentation", __name__)

UPLOAD_FOLDER = "uploads/documents"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf", "docx"}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ✅ Create Multiple Documentation Entries (1 row per file)
@documentation_bp.route("/api/documentation", methods=["POST"])
@login_required
def add_documentation():
    try:
        files = request.files.getlist("files")
        ordinance_id = request.form.get("ordinance_id")
        tags = request.form.getlist("file_tags")  # tags must align with files

        if not ordinance_id or not files or not tags:
            return jsonify({"error": "Ordinance ID, files, and tags are required"}), 400
        if len(files) != len(tags):
            return jsonify({"error": "Each file must have a corresponding tag"}), 400

        for i, file in enumerate(files):
            if file and allowed_file(file.filename):
                filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(file_path)

                tag = tags[i]

                query = """
                    INSERT INTO documentation_reports (ordinance_id, filepath, related_documents)
                    VALUES (%s, %s, %s)
                """
                execute_query(query, (ordinance_id, file_path, tag), commit=True)

                # Log the action as 'added' after the successful operation
                user_id = session.get("user_id")
                if user_id:
                    log_action(ordinance_id=ordinance_id, action="added documentation")
                else:
                    print("User not authenticated")

        return jsonify({"message": "Documentation files uploaded successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to upload documentation", "details": str(e)}), 500


# ✅ Retrieve Documentation Grouped by Ordinance
@documentation_bp.route("/api/documentation", methods=["GET"])
@login_required
def get_all_documentation():
    try:
        query = """
        SELECT o.id AS ordinance_id, o.title, o.number, o.status, o.document_type,
               dr.id, dr.related_documents, dr.filepath
        FROM ordinances o
        LEFT JOIN documentation_reports dr ON o.id = dr.ordinance_id
            WHERE o.is_deleted = 0;
        ORDER BY o.id DESC
        """
        rows = execute_query(query)

        ordinances = {}

        for row in rows:
            ord_id = row[0]
            if ord_id not in ordinances:
                ordinances[ord_id] = {
                    "ordinance_id": ord_id,
                    "title": row[1],
                    "number": row[2],
                    "status": row[3],
                    "document_type": row[4],
                    "documentation_reports": []
                }
            if row[5] is not None:
                ordinances[ord_id]["documentation_reports"].append({
                    "id": row[5],
                    "tag": row[6],
                    "filepath": row[7]
                })

        return jsonify(list(ordinances.values()))

    except Exception as e:
        return jsonify({"error": "Failed to retrieve documentation", "details": str(e)}), 500


# ✅ Update a Single Documentation Entry (replace file and/or tag)
@documentation_bp.route("/api/documentation/<int:doc_id>", methods=["PUT"])
@login_required
def update_documentation(doc_id):
    try:
        file = request.files.get("file")
        tag = request.form.get("tag")

        if not file or not allowed_file(file.filename):
            return jsonify({"error": "Valid file is required"}), 400

        filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        query = """
            UPDATE documentation_reports
            SET filepath = %s, related_documents = %s
            WHERE id = %s
        """
        execute_query(query, (file_path, tag, doc_id), commit=True)

        # Log the action as 'updated' after the successful operation
        user_id = session.get("user_id")
        if user_id:
            log_action(ordinance_id=doc_id, action="updated documentation")
        else:
            print("User not authenticated")

        return jsonify({"message": "Documentation updated successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to update documentation", "details": str(e)}), 500


# ✅ Delete a Single Documentation Entry
@documentation_bp.route("/api/documentation/<int:doc_id>", methods=["DELETE"])
@login_required
def delete_documentation(doc_id):
    try:
        # Optionally fetch and delete the file from disk
        fetch_query = "SELECT filepath FROM documentation_reports WHERE id = %s"
        result = execute_query(fetch_query, (doc_id,))
        if result and result[0][0]:
            file_path = result[0][0]
            if os.path.exists(file_path):
                os.remove(file_path)

        delete_query = "DELETE FROM documentation_reports WHERE id = %s"
        execute_query(delete_query, (doc_id,), commit=True)

        # Log the action as 'deleted' after the successful operation
        user_id = session.get("user_id")
        if user_id:
            log_action(ordinance_id=doc_id, action="deleted documentation")
        else:
            print("User not authenticated")

        return jsonify({"message": "Documentation entry deleted successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to delete documentation", "details": str(e)}), 500

@documentation_bp.route('/uploads/documents/<filename>')
def serve_document(filename):
    return send_from_directory('uploads/documents', filename)
