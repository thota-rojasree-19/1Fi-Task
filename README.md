# 1Fi — Product & EMI Plans

A full-stack product browsing application built as part of the **1Fi SDE1 Full Stack Developer Internship Assignment**.

The application allows users to browse products, select storage and color variants, view pricing and EMI plans, select an EMI plan, and proceed with the selected plan.

All product, variant, pricing, image, and EMI information is served dynamically from **MongoDB through a Node.js/Express backend API**.

---

## Features

- Product listing page
- Dynamic product detail pages
- Unique product URLs using product slugs
- Product name and description
- Storage selection
- Color selection
- Variant availability handling
- Dynamic product images
- MRP and selling price
- Savings amount
- Multiple EMI plans
- Monthly EMI amount
- EMI tenure
- Interest rate
- Cashback information
- EMI plan selection
- Proceed with selected EMI plan
- Confirmation modal after proceeding
- EMI selection resets when the product variant changes
- Responsive user interface
- MongoDB-backed product data
- REST API-driven frontend
- No hardcoded product or EMI data in the React source

---

## Tech Stack

### Frontend

- React 19
- React Router v7
- Tailwind CSS v4
- Vite 8

### Backend

- Node.js
- Express 5
- Mongoose 9

### Database

- MongoDB Atlas

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Project Structure

```text
1Fi Task/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   └── productController.js
│       ├── models/
│       │   └── Product.js
│       ├── routes/
│       │   └── productRoutes.js
│       ├── scripts/
│       │   └── seed.js
│       └── services/
│           └── productService.js
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.js
│   ├── public/
│   │   └── images/
│   │       ├── iphone-17-pro-orange.jpg
│   │       ├── iphone-17-pro-silver.jpg
│   │       ├── pixel-10-pro-hazel.jpg
│   │       ├── pixel-10-pro-obsidian.jpg
│   │       ├── samsung-s25-ultra-black.jpg
│   │       └── samsung-s25-ultra-gray.jpg
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   └── ProductCard.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   └── ProductPage.jsx
│       └── services/
│           └── productService.js
│
├── .env.example
├── .gitignore
└── README.md
