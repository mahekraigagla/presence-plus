const express = require('express');
const attendanceRoutes = require('./routes/attendance');
// ...existing code...

const app = express();

// ...existing code...
app.use(attendanceRoutes);

// ...existing code...
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
