// session-generator.js
const express = require('express');
const fs = require('fs');
const { makeid } = require('./gen-id');
const router = express.Router();

// Helper to remove temp files
function removeFile(filePath) {
    if (fs.existsSync(filePath)) fs.rmSync(filePath, { recursive: true, force: true });
}

// Endpoint to create a new session
router.get('/', async (req, res) => {
    try {
        // Generate a random session ID (you can set length with query ?length=6)
        const length = parseInt(req.query.length) || 6;
        const sessionId = makeid(length);

        // Optional: link to WhatsApp number (if provided)
        const number = req.query.number ? req.query.number.replace(/[^0-9]/g, '') : null;

        // Save session to temp folder
        const tempDir = './temp';
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const filePath = `${tempDir}/${sessionId}.json`;
        fs.writeFileSync(filePath, JSON.stringify({ sessionId, number, created: Date.now() }));

        // Return session info
        res.json({
            status: 'success',
            sessionId,
            filePath,
            number: number || 'N/A'
        });

        // Automatically clean up the session file after 10 minutes
        setTimeout(() => removeFile(filePath), 10 * 60 * 1000);

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to generate session' });
    }
});

module.exports = router;
