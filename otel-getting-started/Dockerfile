FROM python:3@sha256:8428c32065df71d5a7763099ccb8ee215314129b50d395f95ad589151887d52f

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