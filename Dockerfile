FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY requirements.txt .

RUN python -m pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

# La correction clé : on utilise la forme "shell" (sans crochets)
# pour que la variable d'environnement $PORT soit correctement interprétée.
CMD uvicorn app.server:app --host 0.0.0.0 --port ${PORT:-8080}
