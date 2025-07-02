// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db') // Import DB connection

dotenv.config();

const app = express()
connectDB(); // Connect to DB here

// Middleware
app.use(cors())
app.use(express.json())

// Mount auth routes
app.use('/api/auth', require('./routes/authRoutes'))

// Default Route
app.get('/', (req, res) => {
  res.send('API is running...')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

