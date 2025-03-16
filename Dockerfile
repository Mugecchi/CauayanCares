# Use official Python image
FROM python:3.12

# Set working directory
WORKDIR /app/BackEnd

# Copy only requirements.txt first to leverage Docker cache
COPY app/requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of the backend code
COPY app /app

# Expose the port Railway assigns
EXPOSE $PORT

# Run Flask with Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "main:app"]
