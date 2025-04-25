
import bcrypt
from functools import wraps
from flask import jsonify, session# Password Hashing
import smtplib
from email.message import EmailMessage
from db import execute_query

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SMTP_EMAIL = "senderemail378@gmail.com"
SMTP_PASSWORD = "illnooxudvsiazax"  # Use App Password if using Gmail with 2FA
SMTP_Secure = "ssl"


# Password Hashing
def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

# Password verification
def verify_password(entered_password, stored_hash):
    return bcrypt.checkpw(entered_password.encode("utf-8"), stored_hash.encode("utf-8"))

# Middleware for authentication
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized access"}), 401
        return f(*args, **kwargs)
    return decorated_function

# Middleware for role-based access control
def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if "role" not in session or session["role"] != required_role:
                return jsonify({"error": "Access denied. Insufficient permissions."}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

import smtplib
from email.message import EmailMessage

# SMTP Configuration (make sure to set these values securely)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SMTP_EMAIL = "senderemail378@gmail.com"
SMTP_PASSWORD = "illnooxudvsiazax"

def send_email(subject, body, to_email, code=None):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email

    # HTML email content
    if code:
        html_content = f"""
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <style>
                * {{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: Arial, Helvetica, sans-serif;
                }}
                body {{
                    background-color: #f4f4f4;
                    padding: 20px;
                }}
                .email-container {{
                    max-width: 500px;
                    margin: 0 auto;
                    background: #fff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }}
                .company-name {{
                    font-size: 35px;
                    font-weight: bold;
                    color: #FF8836;
                    margin-bottom: 10px;
                }}
                .email-title {{
                    font-size: 20px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 15px;
                }}
                .email-message {{
                    font-size: 16px;
                    color: #555;
                    margin-bottom: 20px;
                }}
                .email-code {{
                    font-size: 32px;
                    font-weight: bold;
                    color: #FF8836;
                    background: rgba(211, 84, 0, 0.2);
                    padding: 15px;
                    border-radius: 8px;
                    display: inline-block;
                    margin-bottom: 22px;
                }}
                .footer {{
                    font-size: 14px;
                    color: #777;
                }}
            </style>
        </head>
        <body>
            <div class='email-container'>
                <p class='company-name'>iCares</p>
                <p class='email-title'>{subject}</p>
                <p class='email-message'>{body}</p>
                <p class='email-code'>{code}</p>
                <p class='footer'>If you didn't request a password reset, please ignore this email.</p>
            </div>
        </body>
        </html>
        """
        # Add HTML alternative part to email
        msg.add_alternative(html_content, subtype='html')
    else:
        # Fallback to plain text
        msg.set_content(body)

    # Sending the email via SMTP
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
        print("Email sent successfully.")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def log_action(ordinance_id, action):
    user_id = session.get("user_id")
    
    # If no user is authenticated, handle it gracefully
    if not user_id:
        print("Error: User is not authenticated.")
        return  # Optionally raise an exception or return an error message
    
    log_query = """
        INSERT INTO records_logs (user_id, ordinance_id, action)
        VALUES (%s, %s, %s)
    """
    try:
        # Attempt to execute the query
        execute_query(log_query, (user_id, ordinance_id, action), commit=True)
    except Exception as e:
        # Handle failure in logging, could print or log the error for debugging
        print(f"Error logging action for ordinance {ordinance_id}: {e}")
        # Optionally, you can store this in a separate logging table or handle it differently
