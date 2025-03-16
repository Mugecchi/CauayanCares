# Use official Python image
FROM python:3.11

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Railway assigns
EXPOSE $PORT

# Run Flask with Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "app:app"]
