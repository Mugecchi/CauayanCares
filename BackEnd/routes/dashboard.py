from flask import Blueprint, jsonify
from db import execute_query, exec_tuple
from utils import login_required
from datetime import datetime

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard", methods=["GET"])
@login_required
def get_dashboard_counts():
    statuses = ["Pending", "Approved", "Amended", "Under Review", "Implemented"]
    document_types = ["Executive Order", "Ordinance", "Memo", "Resolution"]
    funding_sources = ["General Fund", "Special Fund", "Trust Fund"]

    counts = {
        "total_documents": execute_query("SELECT COUNT(*) FROM ordinances", fetch_one=True)[0],
        "document_types": {},
        "funding_source": {},
        "date_issued": {}
    }

    # Get total counts per document type
    for doc_type in document_types:
        doc_key = doc_type.lower().replace(" ", "_")
        counts["document_types"][doc_key] = execute_query(
            "SELECT COUNT(*) FROM ordinances WHERE document_type = %s",
            (doc_type,),
            fetch_one=True
        )[0]

        # Get count per status for each document type
        counts["document_types"][doc_key + "_statuses"] = {}
        for status in statuses:
            status_key = status.lower().replace(" ", "_")
            counts["document_types"][doc_key + "_statuses"][status_key] = execute_query(
                "SELECT COUNT(*) FROM ordinances WHERE document_type = %s AND status = %s",
                (doc_type, status),
                fetch_one=True
            )[0]

    # Get total count per funding source
    for source in funding_sources:
        source_key = source.lower().replace(" ", "_")
        counts["funding_source"][source_key] = execute_query(
            "SELECT COUNT(*) FROM impact_assessment WHERE funding_source = %s",
            (source,),
            fetch_one=True
        )[0]

    # Get counts by year for `date_issued` to generate histogram
    date_issued_query = """
        SELECT DATE_FORMAT(date_issued, '%Y') AS year, COUNT(*) 
        FROM ordinances 
        WHERE date_issued IS NOT NULL
        GROUP BY year 
        ORDER BY year
    """
    date_issued_data = execute_query(date_issued_query)

    # Process the results into a dictionary for histogram
    for year, count in date_issued_data:
        if year is not None:
            counts["date_issued"][str(year)] = count

    return jsonify(counts)


@dashboard_bp.route("/api/table", methods=["GET"])
@login_required
def get_merged_dashboard():
    try:
        # Fetch data from each table
        ordinances_data = exec_tuple("SELECT * FROM ordinances", fetch_one=False)
        objectives_data = exec_tuple("SELECT * FROM objectives_implementation", fetch_one=False)
        monitoring_data = exec_tuple("SELECT * FROM monitoring_compliance", fetch_one=False)
        assessment_data = exec_tuple("SELECT * FROM impact_assessment", fetch_one=False)
        coverage_data = exec_tuple("SELECT * FROM coverage_scope", fetch_one=False)
        budget_data = exec_tuple("SELECT * FROM budget_allocation", fetch_one=False)

        # Merge data based on `ordinance_id`
        merged_data = []

        for ordinance in ordinances_data:
            ordinance_id = ordinance['id']

            objectives = next((item for item in objectives_data if item['ordinance_id'] == ordinance_id), None)
            monitoring = next((item for item in monitoring_data if item['ordinance_id'] == ordinance_id), None)
            assessment = next((item for item in assessment_data if item['ordinance_id'] == ordinance_id), None)
            coverage = next((item for item in coverage_data if item['ordinance_id'] == ordinance_id), None)
            budget = next((item for item in budget_data if item['ordinance_id'] == ordinance_id), None)

       
            merged_record = {
                "ordinance": ordinance,
                "objectives": objectives,
                "monitoring": monitoring,
                "assessment": assessment,
                "coverage": coverage,
                "budget": budget,
            }

            merged_data.append(merged_record)

        return jsonify(merged_data)
    
    except Exception as e:
        return jsonify({"message": str(e)}), 500

