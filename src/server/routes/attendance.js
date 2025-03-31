const express = require('express');
const router = express.Router();

// Mock attendance data
const attendanceData = [
    { name: 'Student A', attendance: 95 },
    { name: 'Student B', attendance: 88 },
    { name: 'Student C', attendance: 76 },
    { name: 'Student D', attendance: 89 },
];

router.get('/api/attendance', (req, res) => {
    res.json(attendanceData);
});

module.exports = router;
