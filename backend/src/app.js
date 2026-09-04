const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    success: true,
    message: "API is running",
    database: dbStatus
  });
});

app.use('/api/products', productRoutes);

module.exports = app;
