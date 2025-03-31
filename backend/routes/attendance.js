const express = require('express');
const router = express.Router();

// Mock database
let students = [
    { id: 1, name: 'John Doe', isPresent: true },
    { id: 2, name: 'Jane Smith', isPresent: false },
];

router.post('/', (req, res) => {
    const { studentId, isPresent } = req.body;

    // Update the student's attendance status
    const student = students.find(s => s.id === studentId);
    if (student) {
        student.isPresent = isPresent;
        res.json(students); // Return updated list
    } else {
        res.status(404).send('Student not found');
    }
});

module.exports = router;
