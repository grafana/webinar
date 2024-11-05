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

If you use a different port, you need to update:

- the value of `serverPort` on line [10](./shopping-cart-ui/src/App.js#L10) of [App.js](./shopping-cart-ui/src/App.js).
- the port number in the [run.sh](./backend/run.sh) script (or in the Dockerfile).

## Frontend

### Requirements

* [`Node.js and npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Instructions

Use Docker:

```sh
cd shopping-cart-ui
docker build -t shopping-cart-frontend .
docker run -p 3001:3001 shopping-cart-frontend
```

With the application running, you should be able to see shopping cart at [http://localhost:3001](http://localhost:3001).

## URL Params

For testing purposes, you can add 2 different params to the URL:

- `fail_stock_api`: when adding to your URL such as `http://localhost:3001/?fail_stock_api=true`, this will simulate a failure on retrieving 
items prices, using fallback values. This is used for the metric `price_accuracy`.
- `customer.country`: when adding to your URL such as `http://localhost:3001/?customer.country=CA`, it will use your custom value for the country
on this request. If no values are passed, it uses your location based on IP address.

Those 2 params can be combined such as `http://localhost:3001/?fail_stock_api=true&customer.country=CA`

## Generate load

For testing purposes, you can generate load by letting this script run for a few hours:

```
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

