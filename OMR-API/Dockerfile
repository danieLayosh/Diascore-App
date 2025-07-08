# Use a base image with Python
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Set PYTHONPATH so imports resolve correctly
ENV PYTHONPATH=/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libglib2.0-0 \
    libgl1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose the port your app runs on
EXPOSE 2291

# Set environment variable to use dotenv at runtime
ENV PYTHONUNBUFFERED=1

# Run FastAPI with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "2291"]
