# OpenTelemetry manual instrumentation and Grafana

This repository contains the sample application used in the Grafana webinar
[OpenTelemetry manual instrumentation and Grafana](https://grafana.com/go/webinar/how-to-instrument-apps-with-otel-and-grafana/?pg=videos&plcmt=upcoming-webinars).
It consists of a basic shopping cart application with a Python Flask backend and a React frontend.

## Requirements

* [Docker](https://docs.docker.com/engine/install/)

## Instructions

1. Clone this repository:

   ```sh
   git clone https://github.com/grafana/webinar.git grafana-webinar
   cd grafana-webinar/otel-manual-instrumentation
   ```

2. Obtain OTLP environment variables from Grafana Cloud:

   * Navigate to the [Grafana Cloud Portal page](https://grafana.com/profile/org).
   * Click **Configure** in the OpenTelemetry section.
   * Click **Generate** to generate a new API token.
   * Copy the pre-set environment variables into your `.env` file or shell.

3. Set your host ID and OTLP credentials, then start the application.

   Application Observability uses `grafana.host.id` to count
   [host-hours](https://grafana.com/docs/grafana-cloud/monitor-applications/application-observability/pricing/).
   Each unique, stable value is billed as one host. The value below defaults
   to your machine's hostname, which is stable across reboots and unique per
   machine. Override it with `GRAFANA_HOST_ID` if needed.

   **Linux / macOS:**
   ```sh
   export GRAFANA_HOST_ID=hostname
   export OTEL_EXPORTER_OTLP_ENDPOINT="https://otlp-gateway-prod-us-east-0.grafana.net/otlp"
   export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic%20..."
   docker compose up --build
   ```

   **Windows (PowerShell):**
   ```powershell
   $env:GRAFANA_HOST_ID = hostname
   $env:OTEL_EXPORTER_OTLP_ENDPOINT = "https://otlp-gateway-prod-us-east-0.grafana.net/otlp"
   $env:OTEL_EXPORTER_OTLP_HEADERS = "Authorization=Basic%20..."
   docker compose up --build
   ```

   The shopping cart is available at [http://localhost:3001](http://localhost:3001).

## URL parameters

For testing purposes, two query parameters are supported:

- `fail_stock_api` — simulates a failure retrieving item prices, using fallback values (affects the `price_accuracy` metric):
  `http://localhost:3001/?fail_stock_api=true`
- `customer.country` — sets the country on the request instead of deriving it from IP:
  `http://localhost:3001/?customer.country=CA`

- `fail_stock_api`: when adding to your URL such as `http://localhost:3001/?fail_stock_api=true`, this will simulate a failure on retrieving 
items prices, using fallback values. This is used for the metric `price_accuracy`.
- `customer.country`: when adding to your URL such as `http://localhost:3001/?customer.country=CA`, it will use your custom value for the country
on this request. If no values are passed, it uses your location based on IP address.

Those 2 params can be combined such as `http://localhost:3001/?fail_stock_api=true&customer.country=CA`

## Generate load

For testing purposes, you can generate load by letting this script run for a few hours:

```sh
while true; do
    curl 'http://localhost:8081/get_items?customer.country=BR'
    curl 'http://localhost:8081/get_items?customer.country=CA'
    curl 'http://localhost:8081/get_items?customer.country=CA'
    curl 'http://localhost:8081/get_items?customer.country=CA'
    curl 'http://localhost:8081/get_items?customer.country=DE'
    curl 'http://localhost:8081/get_items?fail_stock_api=true&customer.country=DE'
    curl 'http://localhost:8081/get_items?fail_stock_api=true&customer.country=DE'
    curl 'http://localhost:8081/get_items?fail_stock_api=true&customer.country=DE'
    curl 'http://localhost:8081/get_items?fail_stock_api=true&customer.country=DE'
    curl 'http://localhost:8081/get_items?fail_stock_api=true&customer.country=CA'
    sleep 300
done
```
