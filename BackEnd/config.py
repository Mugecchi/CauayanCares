import os

class Config:
    SECRET_KEY = "supersecretkey"  # Change to a secure key
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "None"
    UPLOAD_FOLDER = "uploads"

    @staticmethod
    def init_app(app):
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        app.config.from_object(Config)
