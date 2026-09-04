# 1Fi — Product & EMI Plans

A full-stack product browsing application built for the 1Fi SDE1 Full Stack Developer Internship Assignment.

---

## Project Overview

This application allows users to:

- Browse a catalog of products
- View dynamic product detail pages
- Independently select **storage** and **color** variants (Flipkart-style selectors)
- View the **MRP** and **selling price** for the selected combination
- View available **EMI plans** for the selected variant
- Select an EMI plan and **proceed** with a plan confirmation

All product data, variant information, pricing, and EMI plans are served dynamically from **MongoDB** through a **Node.js / Express** backend API. No product or EMI data is hardcoded in the React frontend.

---

## Features

- **Product listing** — home page displaying all products from the database
- **Dynamic product detail pages** — unique URLs per product using slugs
- **Independent storage and color selectors** — e.g. `[256GB] [512GB]` and `[Silver] [Orange]`
- **Variant availability handling** — unavailable storage/color combinations are visually disabled
- **Dynamic product images** — image updates when the selected color changes
- **MRP and selling price** — updates instantly on variant change
- **EMI plans** — 3 plans per variant, loaded from MongoDB
- **EMI selection** — selectable plan cards with visual selected state
- **EMI reset** — switching storage or color clears the previously selected EMI plan
- **Proceed confirmation** — modal showing selected product, variant, and EMI details
- **Loading, error, and 404 states** on all pages
- **Responsive UI** — works on desktop, tablet, and mobile
- **MongoDB-backed data** — single source of truth
- **API-driven frontend** — React fetches all data from Express APIs

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, React Router v7, Tailwind CSS v4, Vite 8 |
| Backend    | Node.js, Express 5                  |
| ODM        | Mongoose 9                          |
| Database   | MongoDB Atlas                       |

---

## Project Structure

```
1Fi Task/
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.js              # MongoDB connection
│       ├── controllers/
│       │   └── productController.js
│       ├── middleware/
│       ├── models/
│       │   └── Product.js         # Mongoose schema
│       ├── routes/
│       │   └── productRoutes.js
│       ├── scripts/
│       │   └── seed.js            # Database seed script
│       ├── services/
│       │   └── productService.js
│       ├── utils/
│       ├── app.js                 # Express application setup
│       └── server.js             # Server entry point
├── frontend/
│   ├── public/
│   │   └── images/               # Local product images
│   └── src/
│       ├── components/
│       │   └── ProductCard.jsx
│       ├── hooks/
│       ├── pages/
│       │   ├── Home.jsx
│       │   └── ProductPage.jsx
│       ├── services/
│       │   └── productService.js  # API fetch functions
│       ├── utils/
│       ├── App.jsx                # Routes and layout
│       ├── index.css
│       └── main.jsx
├── .env.example
├── .gitignore
└── README.md
```

---

## Database Schema

Variants and EMI plans are **embedded** inside the Product document (no separate collections).

### Product

| Field         | Type     | Required | Notes                            |
|---------------|----------|----------|----------------------------------|
| `name`        | String   | Yes      |                                  |
| `slug`        | String   | Yes      | Unique, lowercase                |
| `description` | String   | Yes      |                                  |
| `variants`    | Array    | Yes      | Min 2 variants required          |
| `createdAt`   | Date     | Auto     | Mongoose timestamps              |
| `updatedAt`   | Date     | Auto     | Mongoose timestamps              |

### Variant (embedded in Product)

| Field       | Type   | Required | Notes                     |
|-------------|--------|----------|---------------------------|
| `storage`   | String | Yes      | e.g. `256GB`, `512GB`     |
| `color`     | String | Yes      | e.g. `Silver`, `Orange`   |
| `finish`    | String | Yes      | e.g. `Titanium`, `Matte`  |
| `mrp`       | Number | Yes      | INR, plain number         |
| `price`     | Number | Yes      | INR, plain number         |
| `imageUrl`  | String | Yes      | Local path, e.g. `/images/iphone-17-pro-silver.jpg` |
| `emiPlans`  | Array  | Yes      | Min 1 EMI plan required   |

### EMI Plan (embedded in Variant)

| Field            | Type   | Required | Notes                       |
|------------------|--------|----------|-----------------------------|
| `monthlyPayment` | Number | Yes      | INR, rounded to nearest ₹1  |
| `tenureMonths`   | Number | Yes      | e.g. `3`, `6`, `12`         |
| `interestRate`   | Number | Yes      | Annual %, e.g. `0`, `10.5`  |
| `cashback`       | Number | No       | Default `0`                  |

---

## Seed Data

The database is seeded with **3 products**, each having **4 variants** (all combinations of 2 storage tiers × 2 colors).

### iPhone 17 Pro — slug: `iphone-17-pro`

| Variant          | Finish   | Price      |
|------------------|----------|------------|
| 256GB · Silver   | Titanium | ₹1,27,400  |
| 256GB · Orange   | Titanium | ₹1,27,400  |
| 512GB · Silver   | Titanium | ₹1,47,400  |
| 512GB · Orange   | Titanium | ₹1,47,400  |

### Samsung Galaxy S25 Ultra — slug: `samsung-galaxy-s25-ultra`

| Variant                  | Finish | Price      |
|--------------------------|--------|------------|
| 256GB · Titanium Black   | Matte  | ₹1,32,900  |
| 256GB · Titanium Gray    | Matte  | ₹1,32,900  |
| 512GB · Titanium Black   | Matte  | ₹1,52,900  |
| 512GB · Titanium Gray    | Matte  | ₹1,52,900  |

### Google Pixel 10 Pro — slug: `google-pixel-10-pro`

| Variant           | Finish | Price    |
|-------------------|--------|----------|
| 256GB · Obsidian  | Glossy | ₹94,999  |
| 256GB · Hazel     | Glossy | ₹94,999  |
| 512GB · Obsidian  | Glossy | ₹1,07,999 |
| 512GB · Hazel     | Glossy | ₹1,07,999 |

> Prices are determined by storage tier. Color does not affect pricing. EMI values are calculated mathematically in the seed script using the standard reducing-balance formula.

---

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- A MongoDB Atlas account with an active cluster

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` based on `.env.example`:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

> **Never commit `.env` files. Use `.env.example` for reference only.**

Seed the database:

```bash
npm run seed
```

Start the backend server:

```bash
npm start
```

The server starts on `http://localhost:5000` by default.

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` based on `.env.example`:

```
VITE_API_URL=http://localhost:5000
```

> For a deployed frontend, set `VITE_API_URL` to the deployed backend URL. `http://localhost:5000` is the local development fallback only.

Start the development server:

```bash
npm run dev
```

The app runs on `http://localhost:5173` by default.

---

## API Endpoints

### GET /api/health

Returns the API and database status.

**Example:** `GET http://localhost:5000/api/health`

```json
{
  "success": true,
  "message": "API is running",
  "database": "connected"
}
```

---

### GET /api/products

Returns all products with their full variant and EMI plan data.

**Example:** `GET http://localhost:5000/api/products`

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "iPhone 17 Pro",
      "slug": "iphone-17-pro",
      "description": "...",
      "variants": [
        {
          "storage": "256GB",
          "color": "Silver",
          "finish": "Titanium",
          "mrp": 134900,
          "price": 127400,
          "imageUrl": "/images/iphone-17-pro-silver.jpg",
          "emiPlans": [
            { "tenureMonths": 3,  "interestRate": 0,    "monthlyPayment": 42467, "cashback": 0 },
            { "tenureMonths": 6,  "interestRate": 0,    "monthlyPayment": 21233, "cashback": 0 },
            { "tenureMonths": 12, "interestRate": 10.5, "monthlyPayment": 11230, "cashback": 0 }
          ]
        }
      ]
    }
  ]
}
```

---

### GET /api/products/:slug

Returns a single product by its URL slug.

**Example:** `GET http://localhost:5000/api/products/iphone-17-pro`

```json
{
  "success": true,
  "data": { ... }
}
```

**404 — product not found:**

```json
{
  "success": false,
  "message": "Product not found"
}
```

**Unexpected server error:**

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Frontend Routes

| Route                | Component     | Description                                              |
|----------------------|---------------|----------------------------------------------------------|
| `/`                  | `Home.jsx`    | Product listing page — shows all products from the API  |
| `/products/:slug`    | `ProductPage.jsx` | Dynamic product detail page — loaded using the slug from the URL |

Each product has a unique URL. Examples:

- `/products/iphone-17-pro`
- `/products/samsung-galaxy-s25-ultra`
- `/products/google-pixel-10-pro`

---

## EMI Plans

EMI plans are stored in MongoDB and returned by the API. Each variant has 3 plans:

| Tenure    | Interest Rate | Calculation Method                             |
|-----------|---------------|------------------------------------------------|
| 3 months  | 0%            | `price ÷ 3`                                   |
| 6 months  | 0%            | `price ÷ 6`                                   |
| 12 months | 10.5%         | Standard reducing-balance EMI formula          |

**Reducing-balance formula:**

```
r = annualRate / 100 / 12
EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
```

EMI values are pre-calculated in the seed script and stored in MongoDB. The frontend displays them as-is — no EMI recalculation happens in React.

---

## Local Product Images

Product images are stored under `frontend/public/images/`. The six currently used images are:

| Filename                        | Product                   | Color          |
|---------------------------------|---------------------------|----------------|
| `iphone-17-pro-silver.jpg`      | iPhone 17 Pro             | Silver         |
| `iphone-17-pro-orange.jpg`      | iPhone 17 Pro             | Orange         |
| `samsung-s25-ultra-black.jpg`   | Samsung Galaxy S25 Ultra  | Titanium Black |
| `samsung-s25-ultra-gray.jpg`    | Samsung Galaxy S25 Ultra  | Titanium Gray  |
| `pixel-10-pro-obsidian.jpg`     | Google Pixel 10 Pro       | Obsidian       |
| `pixel-10-pro-hazel.jpg`        | Google Pixel 10 Pro       | Hazel          |

Image filenames are stored in MongoDB via the `imageUrl` field. The same color image is shared between the 256GB and 512GB storage tiers of that color.

---

## Responsive Design

The UI is built with Tailwind CSS and is responsive across:

- **Desktop** — two-column layout (image left, details right)
- **Tablet** — stacked layout with adjusted spacing
- **Mobile** — fully vertical, single-column layout

---

## Environment Variables

| Variable       | Location   | Purpose                                             |
|----------------|------------|-----------------------------------------------------|
| `MONGODB_URI`  | `backend/` | MongoDB Atlas connection string                     |
| `PORT`         | `backend/` | Express server port (default: `5000`)               |
| `VITE_API_URL` | `frontend/`| Backend API base URL for all frontend fetch calls   |

- Never commit `.env` files or real credentials.
- `.env.example` in both `backend/` and the project root contain **placeholders only**.
- Set `VITE_API_URL` to your deployed backend URL when deploying the frontend.

---

## Build and Run Commands

### Backend

```bash
npm install       # Install dependencies
npm run seed      # Seed the MongoDB database
npm start         # Start the production server (node src/server.js)
npm run dev       # Start with nodemon for development
```

### Frontend

```bash
npm install       # Install dependencies
npm run dev       # Start Vite development server
npm run build     # Build for production (outputs to dist/)
npm run preview   # Preview the production build locally
```

---

## Deployment

### Frontend

Deploy URL: `[Add after deployment]`

### Backend API

Deploy URL: `[Add after deployment]`

> After deployment, set the `VITE_API_URL` environment variable in your frontend hosting platform to point to the deployed backend URL.

---

## Demo Video

`[Add Google Drive or YouTube link after recording]`

The demo should cover (2–5 minutes):
- Product listing page
- Product detail page — variant selection (storage + color)
- EMI plan selection and Proceed confirmation
- API responses from the backend
- MongoDB data in Atlas

---

## Assignment Requirements Checklist

| Requirement                                  | Status     |
|----------------------------------------------|------------|
| At least 3 products                          | ✅ Done    |
| At least 2 variants per product              | ✅ Done (4 per product) |
| Product detail page                          | ✅ Done    |
| Multiple EMI plans per variant               | ✅ Done (3 per variant) |
| EMI plan selection                           | ✅ Done    |
| Proceed with selected plan                   | ✅ Done    |
| Unique product URLs (slugs)                  | ✅ Done    |
| Backend REST API                             | ✅ Done    |
| MongoDB database                             | ✅ Done    |
| Responsive React UI                          | ✅ Done    |
| No hardcoded product/EMI data in frontend    | ✅ Done    |
| Deployment                                   | ⬜ Pending |
| Demo video                                   | ⬜ Pending |

---

## Security Notes

- All secrets (MongoDB URI, etc.) must be stored in environment variables.
- `.env` files must never be committed to the repository.
- `.env.example` contains placeholder values only — safe to commit.
- Never expose MongoDB credentials, API keys, or passwords in source code.

---

## Author

Developed as part of the 1Fi SDE1 Full Stack Developer Internship Assignment.
