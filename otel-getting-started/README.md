# How to get started with OpenTelemetry and Grafana

This repository contains the sample application which is used in the Grafana
webinar [How to get started with OpenTelemetry and Grafana](https://grafana.com/go/webinar/how-to-instrument-apps-with-otel-and-grafana/?pg=videos&plcmt=upcoming-webinars).
It consists of a minimal Python Flask web application and is based on the [OpenTelemetry Getting Started guide for Python](https://opentelemetry.io/docs/languages/python/getting-started/).

You can find instructions of how to run the sample application application [locally](#run-the-sample-application-locally) or [via Docker](#run-the-sample-application-via-docker).

## Run the sample application locally

### Requirements

* [Python 3.4+](https://www.python.org/downloads/)

### Instructions

1. Set up a local project directory:

   ```sh
   mkdir otel-getting-started
   cd otel-getting-started
   python3 -m venv venv
   source ./venv/bin/activate
   ```

   See [Creating Virtual Environments](https://packaging.python.org/en/latest/tutorials/installing-packages/#creating-virtual-environments) in the official Python documentation for more information.

2. Install Flask:

   ```sh
   pip install flask
   ```

3. Copy the file [`app.py`](app.py) from this repository into your project directory.

4. From your project directory, run the application:

   ```sh
   flask run -p 8080
   ```

   With the application running, you should be able to see random dice rolls at [http://localhost:8080/rolldice](http://localhost:8080/rolldice).

5. Install the OpenTelemetry distro and instrumentation:

   ```sh
   pip install opentelemetry-distro
   opentelemetry-bootstrap -a install
   ```

6. Run the instrumented application with telemetry exported to the console:

   ```sh
   export OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED=true
   opentelemetry-instrument \
     --traces_exporter console \
     --metrics_exporter console \
     --logs_exporter console \
     --service_name dice-server \
     flask run -p 8080
   ```

   With the application running, you should be able to see random dice rolls at
   [http://localhost:8080/rolldice](http://localhost:8080/rolldice). On the
   console, you will see telemetry (metrics, logs, and traces) that is created by
   your application.

7. Install the OTLP exporter:

   ```sh
   pip install opentelemetry-exporter-otlp-proto-http
   ```

8. Obtain and set up environment variables to send telemetry data to Grafana Cloud via OTLP.

   Follow the steps below to obtain the environment variable values necessary
   to send data to your Grafana Cloud stack:

   * Navigate to the [Grafana Cloud Portal page](https://grafana.com/profile/org).
   * Click **Configure** in the OpenTelemetry section.
   * Click **Generate** to generate a new API token.
   * Copy the pre-set environment variables to the console:

     ```sh
     export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
     export OTEL_EXPORTER_OTLP_ENDPOINT="https://otlp-gateway-prod-us-east-0.grafana.net/otlp"
     export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic%20..." 
     ```

9. Run the instrumented application with telemetry exported to Grafana Cloud:

   ```sh
   export OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED=true
   export OTEL_LOGS_EXPORTER=otlp
   opentelemetry-instrument \
     --service_name dice-server \
     flask run -p 8080
   ```

After doing some dice rolls via
[http://localhost:8080/rolldice](http://localhost:8080/rolldice), metrics,
logs, and traces should be visible in Grafana Cloud.

## Run the sample application via Docker

### Requirements

* [Docker](https://docs.docker.com/engine/install/)

### Instructions

1. Clone this repository, and from its root directory build the included `Dockerfile`:

   ```sh
   docker build --tag grafana-otel-webinar .
   ```

2. Run the Docker image with OTLP environment variables set:

   ```sh
   docker run \
     -e OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf" \
     -e OTEL_EXPORTER_OTLP_ENDPOINT="https://otlp-gateway-prod-us-east-0.grafana.net/otlp" 
     -e OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic%20..." \
     -p 8080:8080 \
     grafana-otel-webinar
   ```

   Follow the steps below to obtain the environment variable values necessary
   to send data to your Grafana Cloud stack:

   * Navigate to the [Grafana Cloud Portal page](https://grafana.com/profile/org).
   * Click **Configure** in the OpenTelemetry section.
   * Click **Generate** to generate a new API token.
   * Use the pre-set environment variables in the command above.

   After doing some dice rolls via
   [http://localhost:8080/rolldice](http://localhost:8080/rolldice), metrics,
   logs, and traces should be visible in Grafana Cloud.