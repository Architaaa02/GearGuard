const express = require('express');
const bodyParser = require('body-parser');

const equipmentRoutes = require('./routes/equipment');
const requestRoutes = require('./routes/request');

const app = express();

// Parse JSON body
app.use(bodyParser.json());

// ⭐ Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// API routes
app.use('/equipment', equipmentRoutes);
app.use('/requests', requestRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send('GearGuard Server Running');
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
