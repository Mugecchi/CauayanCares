# Use official Python image
FROM python:3.12

# Set working directory inside the container
WORKDIR /app

# Copy the backend code
COPY BackEnd /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000 (or use an environment variable for flexibility)
EXPOSE 5000

# Set environment variable for the port (optional if you want flexibility)
ENV PORT 5000

# Run Flask with Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:$PORT", "app:app"]
