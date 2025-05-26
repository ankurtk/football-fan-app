# Use multi-stage builds for smaller final image

# Frontend build stage
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Copy frontend files
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Backend stage
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ .

# Copy built frontend from previous stage
COPY --from=frontend-build /app/dist /app/static

EXPOSE 5000

ENV FLASK_APP=app.py
ENV FLASK_ENV=development

CMD ["flask", "run", "--host=0.0.0.0"]