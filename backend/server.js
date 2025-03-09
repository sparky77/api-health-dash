const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Sample in-memory data store (we'll replace this with MongoDB later)
let apiEndpoints = [];

// Routes
app.get('/api/endpoints', (req, res) => {
  res.json(apiEndpoints);
});

app.post('/api/endpoints', (req, res) => {
  const newEndpoint = req.body;
  apiEndpoints.push(newEndpoint);
  res.status(201).json(newEndpoint);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is healthy' });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});