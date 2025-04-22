from flask import Blueprint, jsonify
from db import execute_query, exec_tuple
from utils import login_required
from datetime import datetime

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard", methods=["GET"])
@login_required
def get_dashboard_counts():
    # Predefine statuses and document types
    statuses = ["Pending", "Approved", "Amended", "Under Review", "Implemented"]
    document_types = ["Executive Order", "Ordinance", "Memo", "Resolution"]
    funding_sources = ["General Fund", "Special Fund", "Trust Fund"]

    # Initialize the counts dictionary
    counts = {
        "total_documents": execute_query("SELECT COUNT(*) FROM ordinances WHERE is_deleted = false", fetch_one=True)[0],
        "document_types": {doc.lower().replace(" ", "_"): 0 for doc in document_types},
        "funding_source": {source.lower().replace(" ", "_"): 0 for source in funding_sources},
        "date_issued": {}
    }

    # Combined query for document types and their respective statuses
    document_type_query = """
        SELECT document_type, status, COUNT(*) 
        FROM ordinances 
        WHERE document_type IN (%s) AND status IN (%s) AND is_deleted = false
        GROUP BY document_type, status
    """
    document_types_placeholders = ", ".join(["%s"] * len(document_types))
    statuses_placeholders = ", ".join(["%s"] * len(statuses))
    
    document_type_data = execute_query(
        document_type_query % (document_types_placeholders, statuses_placeholders),
        (*document_types, *statuses)
    )

    # Process grouped data into the desired structure
    for doc_type, status, count in document_type_data:
        doc_key = doc_type.lower().replace(" ", "_")
        status_key = status.lower().replace(" ", "_")

        # Count total documents per type
        counts["document_types"][doc_key] += count

        # Count the statuses for each document type
        if doc_key + "_statuses" not in counts["document_types"]:
            counts["document_types"][doc_key + "_statuses"] = {}

        counts["document_types"][doc_key + "_statuses"][status_key] = count

    # Optimized query for funding sources counts
    funding_source_query = """
        SELECT funding_source, COUNT(*) 
        FROM impact_assessment 
        WHERE funding_source IN (%s)
        GROUP BY funding_source
    """
    funding_source_placeholders = ", ".join(["%s"] * len(funding_sources))

    funding_source_data = execute_query(
        funding_source_query % funding_source_placeholders,
        tuple(funding_sources)
    )

    # Process funding source data
    for source, count in funding_source_data:
        source_key = source.lower().replace(" ", "_")
        counts["funding_source"][source_key] = count

    # Optimized query for counts of issued documents by year
    date_issued_query = """
        SELECT DATE_FORMAT(date_issued, '%Y') AS year, COUNT(*) 
        FROM ordinances 
        WHERE date_issued IS NOT NULL AND is_deleted = false
        GROUP BY year 
        ORDER BY year
    """
    date_issued_data = execute_query(date_issued_query)

    # Process the results into a dictionary for histogram
    for year, count in date_issued_data:
        if year is not None:
            counts["date_issued"][str(year)] = count

    return jsonify(counts)


