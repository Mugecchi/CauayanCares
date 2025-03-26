import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "fallback-secret-key")  # Use env variable for security
    SESSION_COOKIE_SECURE = True  # Requires HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "None"  # Needed for cross-origin session sharing
    UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")  # Absolute path for reliability

    @staticmethod
    def init_app(app):
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)  # Ensure upload folder exists
        app.config.from_object(Config)
