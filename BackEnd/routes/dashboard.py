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

    # Get total counts per document type and their respective statuses
    query = """
        SELECT document_type, status, COUNT(*) 
        FROM ordinances 
        WHERE document_type IN (%s) 
        GROUP BY document_type, status
    """
    document_status_counts = execute_query(query, (tuple(document_types),))

    for doc_type in document_types:
        doc_key = doc_type.lower().replace(" ", "_")
        counts["document_types"][doc_key] = sum(
            1 for doc in document_status_counts if doc['document_type'] == doc_type
        )
        counts["document_types"][doc_key + "_statuses"] = {
            status.lower().replace(" ", "_"): sum(
                1 for doc in document_status_counts if doc['document_type'] == doc_type and doc['status'] == status
            ) for status in statuses
        }

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

    for year, count in date_issued_data:
        if year is not None:
            counts["date_issued"][str(year)] = count

    return jsonify(counts)
@dashboard_bp.route("/api/table", methods=["GET"])
@login_required
def get_merged_dashboard():
    try:
        # Using JOIN to fetch data from multiple tables in a single query
        merged_query = """
            SELECT o.*, o2.*, m.*, a.*, c.*, b.*
            FROM ordinances o
            LEFT JOIN objectives_implementation o2 ON o.id = o2.ordinance_id
            LEFT JOIN monitoring_compliance m ON o.id = m.ordinance_id
            LEFT JOIN impact_assessment a ON o.id = a.ordinance_id
            LEFT JOIN coverage_scope c ON o.id = c.ordinance_id
            LEFT JOIN budget_allocation b ON o.id = b.ordinance_id
        """
        
        # Execute the merged query
        merged_data = execute_query(merged_query, fetch_one=False)

        return jsonify(merged_data)

    except Exception as e:
        return jsonify({"message": str(e)}), 500
