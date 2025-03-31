const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Routes
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendance');
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api', authRoutes);

// Catch-all handler for undefined routes (serve React app for non-API routes)
app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    } else {
        res.status(404).json({ error: 'API route not found' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
