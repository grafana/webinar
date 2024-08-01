FROM python:3

WORKDIR /app

COPY requirements.txt .

# How to get the requirements.txt file?
# 1. Follow https://opentelemetry.io/docs/languages/python/getting-started/
# 2. Run `pip freeze > requirements.txt` in the same directory as your app.py file
RUN pip install -r requirements.txt

RUN pip install 'opentelemetry-distro[otlp]==0.46b0'
RUN opentelemetry-bootstrap -a install

COPY app.py .

# Logging support is still in alpha, so we need to enable it explicitly
ENV OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED=true
ENV OTEL_LOGS_EXPORTER=otlp
ENV OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
ENV OTEL_EXPORTER_OTLP_ENDPOINT="https://otlp-gateway-prod-us-east-0.grafana.net/otlp"
ENV OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic%20..."
EXPOSE 8081

CMD [ "opentelemetry-instrument", "--service_name", "cart", "flask", "run", "-h", "0.0.0.0", "-p", "8081" ]
