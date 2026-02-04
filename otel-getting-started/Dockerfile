FROM python:3@sha256:1c4c033d666001d84b5c4d85280af2c5a21a4ea1eb86c2fc06e3ef2f33fa6776

WORKDIR /src

COPY ./app.py ./

RUN pip install flask
RUN pip install opentelemetry-distro
RUN pip install opentelemetry-exporter-otlp-proto-http

RUN opentelemetry-bootstrap -a install

ENV OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED=true
ENV OTEL_LOGS_EXPORTER="otlp"
ENV OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"

EXPOSE 8080

CMD [ "opentelemetry-instrument", "--service_name", "dice-server", "flask", "run", "-h", "0.0.0.0", "-p", "8080" ]