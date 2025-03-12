from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
import os
import mysql.connector
from functools import wraps

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Ensure CORS allows cookies for sessions
app.secret_key = "supersecretkey"  # Change this to a secure key

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


# Middleware for protecting routes
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized access"}), 401
        return f(*args, **kwargs)
    return decorated_function


def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if "role" not in session or session["role"] != required_role:
                return jsonify({"error": "Access denied. Insufficient permissions."}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator



# Login Route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = execute_query(
        "SELECT id, username, role FROM users WHERE username = %s AND password = %s",
        (username, password), fetch_one=True
    )

    if user:
        session['user_id'] = user[0]
        session['username'] = user[1]
        session['role'] = user[2]  # Store user role in session

        return jsonify({"message": "Login successful", "user": {"id": user[0], "username": user[1], "role": user[2]}}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/protected', methods=['GET'])
@login_required
def protected():
    # Access user details from session
    user_id = session['user_id']
    username = session['username']

    return jsonify({
        "message": "This is a protected route!",
        "user": {"id": user_id, "username": username}
    }), 200


# Logout Route
@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully!"}), 200
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
@login_required

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
@login_required
@role_required('admin')
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
@login_required
def update_status(id):
    data = request.json
    if not data.get("status"):
        return jsonify({"error": "Status is required"}), 400
    execute_query("UPDATE ordinances SET status = %s WHERE id = %s", (data["status"], id), commit=True)
    return jsonify({"message": "Status updated successfully!"})

# Dashboard Counts
@app.route("/api/dashboard", methods=["GET"])
@login_required
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
@login_required
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
        execute_query(query, (data.get("ordinance_id"), data.get("inclusive_period"), data.get("target_beneficiaries"), data.get("geographical_coverage")), commit=True)
        return jsonify({"message": "Coverage scope added/updated successfully!"})
    except Exception as e:
        return jsonify({"error": "Failed to add/update coverage scope", "details": str(e)}), 500


# Add or Update Objective or Implementation
@app.route("/api/objectives_implementation", methods=["POST"])
@login_required
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
@login_required
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

@app.route("/api/financial", methods=["POST"])
@login_required
def add_or_update_financial():
    try:
        data = request.json
        query = """
            INSERT INTO budget_allocation (ordinance_id, allocated_budget, utilized_budget, gad_budget,financial_transparency_measures)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                allocated_budget = VALUES(allocated_budget),
                utilized_budget = VALUES(utilized_budget),
                gad_budget = VALUES(gad_budget)
                financial_transparency_measures = VALUES(financial_transparency_measures)
        """
        execute_query(query, (data.get("ordinance_id"), data.get("allocated_budget"), data.get("utilized_budget"), data.get("gad_budget"),data.get("financial_transparency_measures")), commit=True)
        return jsonify({"message": "Budget Allocation added/updated successfully!"})
    except Exception as e:
        return jsonify({"error": "Failed to add/update Budget Allocation", "details": str(e)}), 500

@app.route("/api/financial", methods=["GET"])
@login_required
def get_all_Budget():
    query = """
    SELECT o.id, o.title, o.number, o.status, o.document_type,
           ba.id, ba.ordinance_id, ba.allocated_budget, ba.utilized_budget, 
           ba.gad_budget, ba.financial_transparency_measures
    FROM ordinances o
    LEFT JOIN budget_allocation ba ON o.id = ba.ordinance_id
"""
    rows = execute_query(query)

    if not rows:
        return jsonify({"error": "No ordinances found"}), 404

    ordinances_dict = {}

    for row in rows:
        ordinance_id = row[0]  # ID of the ordinance
        if ordinance_id not in ordinances_dict:
            ordinances_dict[ordinance_id] = {
                "id": row[0],  # Ordinance ID
                "title": row[1],  # Title
                "number": row[2],  # Number
                "status": row[3],  # Status
                "document_type": row[4],  # Document type
                "budget_allocation": []
            }
        if row[5] is not None:  # Ensure budget_allocation exists
            ordinances_dict[ordinance_id]["budget_allocation"].append({
                "id": row[5],  # Budget allocation ID
                "ordinance_id": row[6],  # Foreign key to ordinances
                "allocated_budget": row[7],  # Allocated budget
                "utilized_budget": row[8],  # Utilized budget
                "gad_budget": row[9],  # GAD budget
                "financial_transparency_measures": row[10]  # Transparency measures
            })


    return jsonify(list(ordinances_dict.values()))

if __name__ == "__main__":
    app.run(debug=True)