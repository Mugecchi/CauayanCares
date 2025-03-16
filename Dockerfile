# Use official Python image
FROM python:3.12

# Set working directory inside the container
WORKDIR /app

# Copy the backend code
COPY BackEnd /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Railway assigns
EXPOSE $PORT

# Run Flask with Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]
