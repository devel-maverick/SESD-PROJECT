# Use Case Diagram — Dukaan

This diagram shows what each type of user can do in the application.

![Use Case Diagram](docs/use_case_diagram.png)

## Quick Summary

| Action | Guest | User | Admin |
|---|---|---|---|
| Browse and search products | Yes | Yes | Yes |
| View product details | Yes | Yes | Yes |
| Register and Login | Yes | Already done | Already done |
| Manage cart | No | Yes | No |
| Place an order | No | Yes | No |
| View own orders | No | Yes | Yes (all) |
| Add, edit, delete products | No | No | Yes |

## How Ordering Works

User clicks Place Order on the cart page. The backend creates the order as confirmed and clears the cart automatically. User is redirected to the Orders page to see the confirmation.
