const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/submit-attendance', (req, res) => {
    const { status } = req.body;
    if (status === 'present' || status === 'absent') {
        console.log(`Attendance marked as: ${status}`);
        res.json({ message: `Attendance marked as ${status}` });
    } else {
        res.status(400).json({ message: 'Invalid attendance status' });
    }
});

app.listen(4000, () => {
    console.log('Attendance handler running on http://localhost:4000');
});
