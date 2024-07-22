# OpenTelemetry manual instrumentation and Grafana

This repository contains the sample application which is used in the Grafana
webinar [OpenTelemetry manual instrumentation and Grafana](https://grafana.com/go/webinar/how-to-instrument-apps-with-otel-and-grafana/?pg=videos&plcmt=upcoming-webinars).
It consists of a basic shopping cart Python Flask web application with a backend and a frontend.

## General

1. Setup a local project directory:

    ```sh
    git clone https://github.com/grafana/webinar.git grafana-webinar
    cd grafana-webinar/otel-manual-instrumentation
    ```

## Backend

### Requirements

* [Python 3.4+](https://www.python.org/downloads/)

### Instructions

```sh
cd backend
./run.sh
```

or use Docker:

```sh
docker build -t shopping-cart-backend .
docker run -p 8081:8081 shopping-cart-backend
```

If you use a different port, you need to update 

- the value of `serverPort` on line [10](./shopping-cart-ui/src/App.js#L10) of [App.js](./shopping-cart-ui/src/App.js).
- the port number in the [run.sh](./backend/run.sh) script (or in the Dockerfile).

## Frontend

### Requirements

* [`Node.js and npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Instructions

1. Install dependencies

    ```sh
    cd shopping-cart-ui
    npm install
    ```

4. Run the application:

    ```sh
    npm start
    ```

    With the application running, you should be able to see shopping cart at [http://localhost:3001](http://localhost:3001).
