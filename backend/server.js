const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://main--resilient-kangaroo-52fcb1.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('api_health_dashboard'); // Replace with your actual database name
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToDatabase();

const axios = require('axios');

// Add this near the top of the file
// Check health of all endpoints
app.get('/api/check-health', async (req, res) => {
  try {
    const endpoints = await db.collection('endpoints').find().toArray();
    const healthResults = await Promise.all(endpoints.map(async (endpoint) => {
      try {
        await axios.get(endpoint.url, { timeout: 5000 });
        return { _id: endpoint._id, status: 'healthy' };
      } catch (error) {
        return { _id: endpoint._id, status: 'unhealthy' };
      }
    }));
    res.json(healthResults);
  } catch (error) {
    console.error('Error checking health:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all endpoints
app.get('/api/endpoints', async (req, res) => {
  try {
    const collection = db.collection('endpoints');
    const endpoints = await collection.find({}).toArray();
    res.json(endpoints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching endpoints', error: error.message });
  }
});

// Add a new endpoint
app.post('/api/endpoints', async (req, res) => {
  try {
    const collection = db.collection('endpoints');
    const result = await collection.insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error adding endpoint', error: error.message });
  }
});

// Update an endpoint
app.put('/api/endpoints/:id', async (req, res) => {
  try {
    const collection = db.collection('endpoints');
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating endpoint', error: error.message });
  }
});

// Delete an endpoint
app.delete('/api/endpoints/:id', async (req, res) => {
  try {
    const collection = db.collection('endpoints');
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting endpoint', error: error.message });
  }
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});