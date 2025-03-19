from flask import Blueprint, send_from_directory
import os

frontend_bp = Blueprint("frontend", __name__, static_folder="../dist")

@frontend_bp.route("/")
@frontend_bp.route("/<path:path>")
def serve_react(path="index.html"):
    file_path = os.path.join(frontend_bp.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(frontend_bp.static_folder, path)
    return send_from_directory(frontend_bp.static_folder, "index.html")  # SPA fallback

# Handle 404s and serve React for unknown routes
@frontend_bp.app_errorhandler(404)
def catch_all(error):
    return send_from_directory(frontend_bp.static_folder, "index.html")  # Ensure React handles routing
