# Dukaan

Dukaan is a full-stack e-commerce web application where users can browse products across multiple categories, add them to a cart, and pay using Razorpay. Admins can manage the product catalog through a dedicated dashboard.

---

## Features

**Shopper**
- Register and login securely
- Browse, search and filter products by category
- View product details with a multi-image gallery
- Add to cart, update quantities, remove items
- Place orders and pay via Razorpay
- View full order history

**Admin**
- Add, edit and delete products
- View all orders from all users

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React, Vite, Tailwind CSS           |
| Backend     | Node.js, Express                    |
| Database    | PostgreSQL on Supabase              |
| ORM         | Prisma                              |
| Auth        | JSON Web Tokens                     |
| Payments    | Razorpay                            |

---

## Project Structure

```
quickcart/
  backend/
    prisma/          Database schema
    src/
      config/        Prisma client and seed script
      controllers/   Handle HTTP requests
      services/      Business logic
      repositories/  Database queries
      routes/        API route definitions
      middlewares/   Auth and admin guards
      interfaces/    TypeScript type definitions
  frontend/
    src/
      api/           Axios setup
      context/       Auth state management
      components/    Navbar, ProductCard, ProtectedRoute
      pages/         Home, Login, Register, Cart, Orders, ProductDetails, AdminDashboard
```

---

## Getting Started

**Step 1 — Install all dependencies**

```
npm run install:all
```

**Step 2 — Set up environment variables**

Create a file called `.env` inside the `backend` folder and add these values:

```
PORT=5005
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NODE_ENV=development
```

**Step 3 — Set up the database**

```
cd backend
npx prisma migrate deploy
npx ts-node src/config/seed.ts
```

**Step 4 — Build and run the app**

```
npm run deploy
```

The app will be available at http://localhost:5005

---

## Test Accounts

| Role  | Email                   | Password  |
|-------|-------------------------|-----------|
| Admin | admin@quickcart.com     | admin123  |
| User  | user@quickcart.com      | user1234  |

---

## API Overview

| Method | Endpoint                    | Access  | Description                  |
|--------|-----------------------------|---------|------------------------------|
| POST   | /api/auth/register          | Public  | Create a new account         |
| POST   | /api/auth/login             | Public  | Login and get a token        |
| GET    | /api/products               | Public  | Get all products              |
| GET    | /api/products/:id           | Public  | Get one product by ID        |
| POST   | /api/products               | Admin   | Add a new product            |
| PUT    | /api/products/:id           | Admin   | Edit a product               |
| DELETE | /api/products/:id           | Admin   | Delete a product             |
| GET    | /api/cart                   | User    | Get the current cart         |
| POST   | /api/cart/add               | User    | Add item to cart             |
| DELETE | /api/cart/:productId        | User    | Remove item from cart        |
| PUT    | /api/cart/:productId        | User    | Update item quantity         |
| POST   | /api/orders/create          | User    | Create a Razorpay order      |
| POST   | /api/orders/confirm         | User    | Confirm payment after paying |
| GET    | /api/orders                 | User    | Get own order history        |
| GET    | /api/orders/all             | Admin   | Get all orders               |

---

## Database Tables

| Table      | Purpose                              |
|------------|--------------------------------------|
| User       | Stores all registered users          |
| Product    | Stores all available products        |
| Cart       | One cart per user                    |
| CartItem   | Individual items inside a cart       |
| Order      | A completed purchase record          |
| OrderItem  | Individual products inside an order  |

---

## Development Notes

- The product images are stored as a JSON array of URLs in the `image` field. The frontend parses this to show a gallery of real product photos.
- The cart is automatically created the first time a user tries to add a product.
- Payment verification is done using HMAC signature check with the Razorpay secret key.
- On successful payment, the user cart is cleared automatically.
