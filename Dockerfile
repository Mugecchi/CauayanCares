# Use official Python image
FROM python:3.12

# Set working directory
WORKDIR /app

# Copy the backend
COPY BackEnd /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (for local testing, not used by Railway)
EXPOSE 5000

# Run app with Gunicorn on Railway's provided PORT
CMD ["sh", "-c", "gunicorn -b 0.0.0.0:${PORT} app:app"]
