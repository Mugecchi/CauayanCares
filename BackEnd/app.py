from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import mysql.connector

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Database Connection Function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",
        database="ordinances"
    )

# Utility function to execute queries
def execute_query(query, params=(), fetch_one=False, commit=False):
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute(query, params)
    result = cursor.fetchone() if fetch_one else cursor.fetchall()
    if commit:
        db.commit()
    cursor.close()
    db.close()
    return result

# Upload Ordinance
@app.route("/api/ordinances", methods=["POST"])
def add_ordinance():
    try:
        data = request.form
        file = request.files.get("file")
        file_path = file.filename if file else None

        # Check for duplicate title
        existing = execute_query("SELECT COUNT(*) FROM ordinances WHERE title = %s", (data.get("title"),), fetch_one=True)
        if existing[0] > 0:
            return jsonify({"error": "Ordinance with this title already exists!"}), 400

        if file:
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], file.filename))

        query = """
            INSERT INTO ordinances (title, number, date_issued, policies, document_type, date_effectivity, status, related_ordinances, file_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        execute_query(query, (
            data.get("title"), data.get("number"), data.get("dateIssued"), data.get("policies"),
            data.get("documentType"), data.get("dateEffectivity"), data.get("status"),
            data.get("relatedOrdinances"), file_path
        ), commit=True)

        return jsonify({"message": "Ordinance added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch Ordinances
@app.route("/api/ordinances", methods=["GET"])
def get_ordinances():
    query = "SELECT id, title, number, policies, document_type, status, file_path FROM ordinances"
    ordinances = execute_query(query)
    return jsonify([dict(zip(["id", "title", "number", "policies", "document_type", "status", "file_path"], row)) for row in ordinances])

# Serve Uploaded Files
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Delete Ordinance
@app.route("/api/ordinances/<int:id>", methods=["DELETE"])
def delete_ordinance(id):
    file_record = execute_query("SELECT file_path FROM ordinances WHERE id = %s", (id,), fetch_one=True)
    if file_record and file_record[0]:
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file_record[0])
        if os.path.exists(file_path):
            os.remove(file_path)

    execute_query("DELETE FROM ordinances WHERE id = %s", (id,), commit=True)
    return jsonify({"message": "Ordinance deleted successfully!"})

# Update Ordinance Status
@app.route("/api/ordinances/<int:id>", methods=["PUT"])
def update_status(id):
    data = request.json
    if not data.get("status"):
        return jsonify({"error": "Status is required"}), 400
    execute_query("UPDATE ordinances SET status = %s WHERE id = %s", (data["status"], id), commit=True)
    return jsonify({"message": "Status updated successfully!"})

# Dashboard Counts
@app.route("/api/dashboard", methods=["GET"])
def get_dashboard_counts():
    statuses = ["Pending", "Approved", "Amended", "Under Review", "Implemented"]
    counts = {
        "ordinances_count": execute_query("SELECT COUNT(*) FROM ordinances", fetch_one=True)[0]
    }

    for status in statuses:
        key = f"{status.lower().replace(' ', '_')}_count"  # Fix key formatting
        counts[key] = execute_query(
            "SELECT COUNT(*) FROM ordinances WHERE status = %s", (status,), fetch_one=True
        )[0]

    return jsonify(counts)


# Fetch Ordinance with Coverage Scope

@app.route("/api/ordinancesCoverage", methods=["GET"])
def get_all_ordinances_with_scope():
    query = """
        SELECT o.id, o.title, o.number, o.status, o.document_type,
               cs.id AS coverage_id, cs.inclusive_period, cs.target_beneficiaries, cs.geographical_coverage
        FROM ordinances o
        LEFT JOIN coverage_scope cs ON o.id = cs.ordinance_id
    """
    rows = execute_query(query)

    if not rows:
        return jsonify({"error": "No ordinances found"}), 404

    ordinances_dict = {}

    for row in rows:
        ordinance_id = row[0]
        if ordinance_id not in ordinances_dict:
            ordinances_dict[ordinance_id] = {
                "id": row[0],
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


# Add or Update Coverage Scope
@app.route("/api/coverage_scope", methods=["POST"])
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
        execute_query(query, (data.get("ordinance_id"), data.get("inclusive_period"), data.get("target_beneficiaries"), data.get("geographical_coverage")), commit=True)
        return jsonify({"message": "Coverage scope added/updated successfully!"})
    except Exception as e:
        return jsonify({"error": "Failed to add/update coverage scope", "details": str(e)}), 500


# Add or Update Objective or Implementation
@app.route("/api/objectives_implementation", methods=["POST"])
def add_or_update_objective():
    try:
        data = request.json
        query = """
            INSERT INTO objectives_implementation (ordinance_id,policy_objectives,lead_agency,supporting_agencies,key_provisions,programs_activities)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                policy_objectives = VALUES(policy_objectives),
                lead_agency = VALUES(lead_agency),
                supporting_agencies = VALUES(supporting_agencies),
                key_provisions = VALUES(key_provisions),
                programs_activities = VALUES(programs_activities)
        """
        execute_query(query, (data.get("ordinance_id"), data.get("policy_objectives"), data.get("lead_agency"), data.get("supporting_agencies"),data.get("key_provisions"),data.get("programs_activities")), commit=True)
        return jsonify({"message": "Objective added/updated successfully!"})
    except Exception as e:
        return jsonify({"error": "Failed to add/update Objective", "details": str(e)}), 500

@app.route("/api/objectives_implementation", methods=["GET"])
def get_all_Objective():
    query = """
        SELECT o.id, o.title, o.number, o.status, o.document_type,
               oi.ordinance_id,oi.policy_objectives,oi.lead_agency,oi.supporting_agencies,oi.key_provisions, oi.programs_activities
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
                "id": row[0],
                "title": row[1],
                "number": row[2],
                "status": row[3],
                "document_type": row[4],
                "objectives_implementation": []
            }
        if row[5]:  # If coverage exists
            ordinances_dict[ordinance_id]["objectives_implementation"].append({
                "id": row[5],
                "policy_objectives": row[6],
                "lead_agency": row[7],
                "supporting_agencies": row[8],
                "key_provisions": row[9],
                "programs_activities": row[10]
            })

    return jsonify(list(ordinances_dict.values()))


if __name__ == "__main__":
    app.run(debug=True)
