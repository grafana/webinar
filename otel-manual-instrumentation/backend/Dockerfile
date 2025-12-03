FROM python:3@sha256:595140b768992c05b096570e5ae487a02a2c6b3ae23ba33ce0fc34b99579c98e

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
ENV OTEL_SERVICE_NAME=cart
ENV OTEL_RESOURCE_ATTRIBUTES=deployment.environment=prod,service.namespace=shop,service.version=1.2,service.instance.id=cart1
EXPOSE 8081

CMD [ "opentelemetry-instrument", "flask", "run", "-h", "0.0.0.0", "-p", "8081" ]
