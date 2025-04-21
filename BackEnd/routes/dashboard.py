from flask import Blueprint, jsonify
from db import execute_query,exec_tuple
from utils import login_required
from datetime import datetime

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard", methods=["GET"])
@login_required
def get_dashboard_counts():
    statuses = ["Pending", "Approved", "Amended", "Under Review", "Implemented"]
    document_types = ["Executive Order", "Ordinance", "Memo", "Resolution"]
    funding_sources = ["General Fund", "Special Fund", "Trust Fund"]

    # Initialize the counts dictionary
    counts = {
        "total_documents": execute_query("SELECT COUNT(*) FROM ordinances", fetch_one=True)[0],
        "document_types": {},
        "funding_source": {},
        "date_issued": {}
    }

    # Grouped query for document types and their respective statuses
    document_type_query = """
        SELECT document_type, status, COUNT(*) 
        FROM ordinances 
        WHERE document_type IN (%s) AND status IN (%s)
        GROUP BY document_type, status
    """
    document_types_placeholders = ", ".join(["%s"] * len(document_types))
    statuses_placeholders = ", ".join(["%s"] * len(statuses))
    
    # Execute grouped query
    document_type_data = execute_query(
        document_type_query % (document_types_placeholders, statuses_placeholders),
        (*document_types, *statuses)
    )

    # Process grouped data into the desired structure
    for doc_type, status, count in document_type_data:
        doc_key = doc_type.lower().replace(" ", "_")
        status_key = status.lower().replace(" ", "_")

        # Initialize document type if not yet
        if doc_key not in counts["document_types"]:
            counts["document_types"][doc_key] = 0
        counts["document_types"][doc_key] += count

        # Initialize statuses for each document type
        if doc_key + "_statuses" not in counts["document_types"]:
            counts["document_types"][doc_key + "_statuses"] = {}

        counts["document_types"][doc_key + "_statuses"][status_key] = count

    # Get funding sources counts (grouped query)
    funding_source_query = """
        SELECT funding_source, COUNT(*) 
        FROM impact_assessment 
        WHERE funding_source IN (%s)
        GROUP BY funding_source
    """
    funding_source_placeholders = ", ".join(["%s"] * len(funding_sources))
    
    # Execute grouped funding source query
    funding_source_data = execute_query(
        funding_source_query % funding_source_placeholders,
        tuple(funding_sources)
    )

    # Process funding source data
    for source, count in funding_source_data:
        source_key = source.lower().replace(" ", "_")
        counts["funding_source"][source_key] = count

    # Get counts for each year of 'date_issued' (grouped query)
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
