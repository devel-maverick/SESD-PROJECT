# Class Diagram — Dukaan

This diagram shows how the backend is organized into three layers: Repositories, Services, and Controllers.

![Class Diagram](docs/class_diagram.png)

## Layer Summary

| Layer | What it does |
|---|---|
| Repository | Directly talks to the database via Prisma |
| Service | Contains business logic and rules |
| Controller | Handles incoming HTTP requests and sends responses |

## Order Service

Order Service has three methods: placeOrder, getUserOrders, getAllOrders. When placeOrder is called it fetches the cart, creates an order with status confirmed, clears the cart, and returns the order. No external payment service is involved.
