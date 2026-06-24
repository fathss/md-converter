# Stage 1: install Python deps
FROM python:3.12-slim AS builder
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Lean runtime
FROM python:3.12-slim
WORKDIR /app

# Copy only installed Python packages (includes pandoc via pypandoc_binary)
COPY --from=builder /install /usr/local

COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]