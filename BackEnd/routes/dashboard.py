from flask import Blueprint, jsonify
from db import execute_query
from utils import login_required
from datetime import datetime

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard/bar", methods=["GET"])
@login_required
def get_dashboard_counts():
    statuses = ["Pending", "Approved", "Amended", "Under Review", "Implemented"]
    document_types = ["Executive Order", "Ordinance", "Memo", "Resolution"]

    # Initialize result dictionary
    counts = {
        "total_documents": 0,
        "document_types": {}
    }

    # Execute all queries in one go (total, and grouped counts)
    total_query = "SELECT COUNT(*) FROM ordinances WHERE is_deleted = false"
    grouped_query = """
        SELECT document_type, status, COUNT(*) as count
        FROM ordinances
        WHERE document_type IN (%s, %s, %s, %s)
        AND status IN (%s, %s, %s, %s, %s)
        AND is_deleted = false
        GROUP BY document_type, status
    """

    # Run queries
    total_documents = execute_query(total_query, fetch_one=True)[0]
    rows = execute_query(grouped_query, (*document_types, *statuses))

    counts["total_documents"] = total_documents

    # Populate document types and their statuses
    for doc_type in document_types:
        doc_key = doc_type.lower().replace(" ", "_")
        counts["document_types"][doc_key] = 0
        counts["document_types"][f"{doc_key}_statuses"] = {status.lower().replace(" ", "_"): 0 for status in statuses}

    for doc_type, status, count in rows:
        doc_key = doc_type.lower().replace(" ", "_")
        status_key = status.lower().replace(" ", "_")
        counts["document_types"][doc_key] += count
        counts["document_types"][f"{doc_key}_statuses"][status_key] = count

    return jsonify(counts)

@dashboard_bp.route("/api/dashboard/line", methods=["GET"])
@login_required
def get_historical_data():
    # Query to group ordinances by month/year of date_issued and document type
    query = """
SELECT 
  DATE_FORMAT(
    CASE 
      WHEN date_issued LIKE '%/%' AND LENGTH(date_issued) = 10 AND SUBSTRING_INDEX(date_issued, '/', 1) > 12 THEN STR_TO_DATE(date_issued, '%Y/%m/%d')
      WHEN date_issued LIKE '%-%' AND LENGTH(date_issued) = 10 AND SUBSTRING_INDEX(date_issued, '-', 1) > 12 THEN STR_TO_DATE(date_issued, '%Y-%m-%d')
      WHEN date_issued LIKE '%/%' AND LENGTH(date_issued) = 10 THEN STR_TO_DATE(date_issued, '%m/%d/%Y')
      WHEN date_issued LIKE '%-%' AND LENGTH(date_issued) = 10 THEN STR_TO_DATE(date_issued, '%m-%d-%Y')
      ELSE NULL
    END, 
    '%Y - %m'
  ) AS formatted_date,
  document_type,
  COUNT(*) 
FROM ordinances 
WHERE date_issued IS NOT NULL 
  AND is_deleted = false
GROUP BY formatted_date, document_type;

    """
    data = execute_query(query)

    # Initialize dictionary to store the data
    counts = {}

    # Process the results
    for month_year, doc_type, count in data:
        if not month_year or not doc_type:
            continue  # Skip if either is None or empty string

        if month_year not in counts:
            counts[month_year] = {}

        counts[month_year][doc_type] = count

    return jsonify(counts), 200


@dashboard_bp.route("/api/dashboard/source", methods=["GET"])
@login_required
def get_funding_source():
    # Define the list of expected funding sources
    funding_sources = ['General Fund','Grants','Others']

    # Dynamically create placeholders for the IN clause
    placeholders = ", ".join(["%s"] * len(funding_sources))

    # Construct and run the query
    funding_source_query = f"""
        SELECT funding_source, COUNT(*) 
        FROM impact_assessment 
        WHERE funding_source IN ({placeholders})
        GROUP BY funding_source
    """

    rows = execute_query(funding_source_query, tuple(funding_sources))

    # Format the results into a dictionary
    counts = {source: 0 for source in funding_sources}
    for source, count in rows:
        counts[source] = count

    return jsonify(counts), 200

@dashboard_bp.route("/api/dashboard/target", methods=["GET"])
@login_required
def get_target_beneficiaries():
    # List of target beneficiaries to track
    target_beneficiaries = [
        'General Public', 'Women', 'Children', 'Solo Parents', 'PWDs', 'MSMEs',
        'Others', 'Labor Trade', 'Industry', 'Economic Enterprises',
        'Environmental Protection & Ecology', 'Family',
        'Human Resource Management & Development', 'Finance',
        'Infrastructure & General Services'
    ]

    # Query all target_beneficiaries entries
    query = "SELECT target_beneficiaries FROM coverage_scope WHERE target_beneficiaries IS NOT NULL"
    rows = execute_query(query)

    # Initialize counts
    counts = {target: 0 for target in target_beneficiaries}

    # Count occurrences by splitting comma-separated values
    for (beneficiary_str,) in rows:
        beneficiaries = [b.strip() for b in beneficiary_str.split(',')]
        for b in beneficiaries:
            if b in counts:
                counts[b] += 1

    return jsonify(counts), 200
