const QRCode = require('qrcode');
const express = require('express');
const app = express();

app.get('/generate-qr', async (req, res) => {
    const attendanceUrl = 'http://localhost:4000/attendance'; // Updated to match backend URL
    try {
        const qrCode = await QRCode.toDataURL(attendanceUrl);
        res.send(`<img src="${qrCode}" alt="QR Code" />`);
    } catch (err) {
        res.status(500).send('Error generating QR code');
    }
});

app.listen(4000, () => {
    console.log('QR Code generator running on http://localhost:4000');
});
