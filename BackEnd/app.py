from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import mysql.connector

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="ordinances"
)
cursor = db.cursor()

# Route to handle file uploads and ordinance data
@app.route("/api/ordinances", methods=["POST"])
def add_ordinance():
    try:
        title = request.form.get("title")
        number = request.form.get("number")
        date_issued = request.form.get("dateIssued")
        policies = request.form.get("policies")
        document_type = request.form.get("documentType")
        date_effectivity = request.form.get("dateEffectivity")
        status = request.form.get("status")
        related_ordinances = request.form.get("relatedOrdinances")

        file = request.files.get("file")
        file_path = None

        if file:
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
            file.save(file_path)

        # ✅ Check if title already exists
        cursor.execute("SELECT COUNT(*) FROM ordinances WHERE title = %s", (title,))
        result = cursor.fetchone()
        
        if result[0] > 0:
            return jsonify({"error": "Ordinance with this title already exists!"}), 400  # Reject request

        # ✅ Insert new ordinance if title does not exist
        query = """
            INSERT INTO ordinances (title, number, date_issued, policies, document_type, date_effectivity, status, related_ordinances, file_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            title, number, date_issued, policies, document_type, date_effectivity, status, related_ordinances, 
            file.filename if file else None
        ))
        db.commit()

        return jsonify({"message": "Ordinance added successfully!"}), 201  # ✅ Return success message

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500  # Return error message for debugging

# Route to fetch ordinances
@app.route("/api/ordinances", methods=["GET"])
def get_ordinances():
    cursor.execute("SELECT id, title, number, policies, document_type, status, file_path FROM ordinances")
    ordinances = [{"id": row[0], "title": row[1], "number": row[2], "policies": row[3], "document_type":row[4],"status": row[5], "file_path": row[6]} for row in cursor.fetchall()]
    return jsonify(ordinances)

# Route to serve uploaded files
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Route to delete an ordinance
@app.route("/api/ordinances/<int:id>", methods=["DELETE"])
def delete_ordinance(id):
    cursor.execute("SELECT file_path FROM ordinances WHERE id = %s", (id,))
    file_record = cursor.fetchone()

    if file_record and file_record[0]:
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file_record[0])
        if os.path.exists(file_path):
            os.remove(file_path)  # Delete file from storage

    cursor.execute("DELETE FROM ordinances WHERE id = %s", (id,))
    db.commit()

    return jsonify({"message": "Ordinance deleted successfully!"})

@app.route("/api/ordinances/<int:id>", methods=["PUT"])
def update_status(id):
    data = request.json
    new_status = data.get("status")

    if not new_status:
        return jsonify({"error": "Status is required"}), 400

    try:
        cursor.execute("UPDATE ordinances SET status = %s WHERE id = %s", (new_status, id))
        db.commit()
        return jsonify({"message": "Status updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/dashboard", methods=["GET"])
def get_dashboard_counts():
    cursor.execute("SELECT COUNT(*) FROM ordinances")
    ordinances_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM ordinances WHERE status = 'Pending'")
    pending_count = cursor.fetchone()[0]


    cursor.execute("SELECT COUNT(*) FROM ordinances WHERE status = 'Approved'")
    approved_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM ordinances WHERE status = 'Amended'")
    amended_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM ordinances WHERE status = 'Under Review'")
    under_review_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM ordinances WHERE status = 'Implemented'")
    implemented_count = cursor.fetchone()[0]

    return jsonify({
        "ordinances_count": ordinances_count,
        "pending_count": pending_count,
        "approved_count": approved_count,
        "amended_count": amended_count,
        "under_review_count": under_review_count,
        "implemented_count": implemented_count
    })

@app.route("/api/ordinances/id/<int:ordinance_id>", methods=["GET"])
def get_ordinance_with_scope_by_id(ordinance_id):
    cursor.execute("""
        SELECT o.id, o.title, o.number, o.status, o.document_type,
               cs.id AS coverage_id, cs.inclusive_period, cs.target_beneficiaries, cs.geographical_coverage
        FROM ordinances o
        LEFT JOIN coverage_scope cs ON o.id = cs.ordinance_id
        WHERE o.id = %s
    """, (ordinance_id,))
    
    rows = cursor.fetchall()
    
    if not rows:
        return jsonify({"error": "Ordinance not found"}), 404

    # Extract ordinance details from the first row
    ordinance = {
        "id": rows[0][0],
        "title": rows[0][1],
        "number": rows[0][2],
        "status": rows[0][3],
        "document_type": rows[0][4],
        "coverage_scopes": []
    }

    # Extract coverage scopes if available
    for row in rows:
        if row[5]:  # Check if coverage scope exists
            ordinance["coverage_scopes"].append({
                "id": row[5],
                "inclusive_period": row[6],
                "target_beneficiaries": row[7],
                "geographical_coverage": row[8],
            })

    return jsonify(ordinance)

@app.route("/api/ordinances/title/<string:title>", methods=["GET"])
def get_ordinance_with_scope_by_title(title):
    search_query = f"%{title}%"
    print("Searching for:", search_query)  # Debugging log

    cursor.execute("""
        SELECT o.id, o.title, o.number, o.status, o.document_type,
               cs.id AS coverage_id, cs.inclusive_period, cs.target_beneficiaries, cs.geographical_coverage
        FROM ordinances o
        LEFT JOIN coverage_scope cs ON o.id = cs.ordinance_id
        WHERE LOWER(o.title) LIKE LOWER(%s)  -- Case-insensitive search
    """, (search_query,))

    rows = cursor.fetchall()
    print("Query Result:", rows)  # Debugging log

    if not rows:
        return jsonify({"error": "Ordinance not found"}), 404

    # Process results (same as before)



@app.route("/api/coverage_scope", methods=["POST"])
def add_or_update_coverage_scope():
    try:
        data = request.json
        ordinance_title = data.get("ordinance_title")
        inclusive_period = data.get("inclusive_period")
        target_beneficiaries = data.get("target_beneficiaries")
        geographical_coverage = data.get("geographical_coverage")

        query = """
            INSERT INTO coverage_scope (ordinance_title, inclusive_period, target_beneficiaries, geographical_coverage)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                inclusive_period = VALUES(inclusive_period),
                target_beneficiaries = VALUES(target_beneficiaries),
                geographical_coverage = VALUES(geographical_coverage)
        """
        cursor.execute(query, (ordinance_title, inclusive_period, target_beneficiaries, geographical_coverage))
        db.commit()

        return jsonify({"message": "Coverage scope added/updated successfully!"})

    except Exception as e:
        print("Error adding/updating coverage scope:", str(e))  # Debugging logs
        return jsonify({"error": "Failed to add/update coverage scope"}), 500



if __name__ == "__main__":
    app.run(debug=True)


