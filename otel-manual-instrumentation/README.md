# OpenTelemetry manual instrumentation and Grafana

This repository contains the sample application which is used in the Grafana
webinar [OpenTelemetry manual instrumentation and Grafana](https://grafana.com/go/webinar/how-to-instrument-apps-with-otel-and-grafana/?pg=videos&plcmt=upcoming-webinars).
It consists of a basic shopping cart Python Flask web application with a backend and a frontend.

## General

1. Setup a local project directory:

    ```sh
    mkdir otel-manual-instrumentation
    cd otel-manual-instrumentation
    ```

## Backend

### Requirements

* [Python 3.4+](https://www.python.org/downloads/)

### Instructions

1. Set up a local project directory:

   ```sh
   mkdir backend
   cd backend
   python3 -m venv venv
   source ./venv/bin/activate
   ```

   See [Creating Virtual Environments](https://packaging.python.org/en/latest/tutorials/installing-packages/#creating-virtual-environments) in the official Python documentation for more information.

2. Install Flask and Flask Cors:

   ```sh
   pip install flask flask-cors
   ```

3. Install Open Telemetry dependencies

    ```sh
    pip install opentelemetry-instrumentation opentelemetry-distro opentelemetry-exporter-otlp
    opentelemetry-bootstrap -a install
    ```

4. Copy the file [`backend/app.py`](./backend/app.py) from this repository into your project directory.

5. From your project directory, run the application:

   ```sh
   opentelemetry-instrument flask run -p 8081
   ```

   If you use a different port, you need to update the value of `serverPort` on line [10](./frontend/src/App.js#L10) of [App.js](./frontend/src/App.js).

## Frontend

### Requirements

* [`Node.js and npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Instructions

1. Set up a local project from root directory `otel-manual-instrumentation`:

    ```sh
    npx create-react-app shopping-cart-ui
    cd shopping-cart-ui
    ```

2. Install dependencies

    ```sh
    npm install typescript \
    ts-node \
    express \
    @types/express

    # Initialize typescript
    npx tsc --init

    npm install axios
    ```

3. Replace the files [`shopping-cart-ui/src/App.js`](./shopping-cart-ui/src/App.js) and [`shopping-cart-ui/src.App.css`](./shopping-cart-ui/src/App.css) in your project from the respective files from this repository.

4. From your project directory, run the application:

    ```sh
    npm start
    ```

    With the application running, you should be able to see shopping cart at [http://localhost:3001](http://localhost:3001).