FROM python:3.9-alpine
RUN apk update && apk upgrade
RUN apk add --no-cache pkgconfig \
                       gcc \
                       openldap \
                       libcurl \
                       gpgme-dev \
                       libc-dev \
                       && rm -rf /var/cache/apk/*

WORKDIR /app
COPY ./ /app
ENTRYPOINT if [ ! -d ./venv/ ]; then \
echo "[INFO] >> Installing dependencies, please wait..." && \
python -m venv ./venv && \
source ./venv/bin/activate && \
pip install -r requirements.txt && \
pip freeze > requirements.txt && \
uvicorn main:app --host 0.0.0.0 --port 3001 --reload \
;else \
echo "[INFO] >> Ready to luanch server, checking new dependencies, please wait..." && \
source ./venv/bin/activate && \
pip install -r requirements.txt && \
pip freeze > requirements.txt && \
uvicorn main:app --host 0.0.0.0 --port 3001 --reload \
;fi
