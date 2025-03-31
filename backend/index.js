const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Assuming this is the correct path

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://khushichandak2005:khushiii123@biometric-presence.gx0nhh1.mongodb.net/?retryWrites=true&w=majority&appName=Biometric-Presence';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
