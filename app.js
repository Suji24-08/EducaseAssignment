require('dotenv').config();
const express = require('express');
const { body, query, validationResult } = require('express-validator');
const pool = require('./db'); // MySQL connection pool
const app = express();

app.use(express.json());

// Helper: Calculate Haversine distance (in km)
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (v) => v * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Add School API
app.post(
    '/addSchool',
    [
        body('name').isString().notEmpty(),
        body('address').isString().notEmpty(),
        body('latitude').isFloat({ min: -90, max: 90 }),
        body('longitude').isFloat({ min: -180, max: 180 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { name, address, latitude, longitude } = req.body;
        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        try {
            // Prevent duplicate school by name + address
            const [existing] = await pool.query(
                'SELECT id FROM schools WHERE name = ? AND address = ?',
                [name, address]
            );
            if (existing.length > 0) {
                return res.status(400).json({ error: 'School already exists' });
            }

            const [result] = await pool.query(
                'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
                [name, address, latitude, longitude]
            );
            res.status(201).json({ message: 'School added successfully', id: result.insertId });
        } catch (error) {
            console.error('MySQL Error:', error);
            res.status(500).json({ error: error.sqlMessage || error.message });
        }
    }
);

// List Schools API
app.get(
    '/listSchools',
    [
        query('latitude').isFloat({ min: -90, max: 90 }),
        query('longitude').isFloat({ min: -180, max: 180 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userLat = parseFloat(req.query.latitude);
        const userLon = parseFloat(req.query.longitude);

        try {
            const [rows] = await pool.query('SELECT * FROM schools');
            const withDistance = rows.map(school => ({
                ...school,
                distance_km: Number(
                    haversineDistance(
                        userLat,
                        userLon,
                        parseFloat(school.latitude),
                        parseFloat(school.longitude)
                    ).toFixed(4)
                )
            }));
            withDistance.sort((a, b) => a.distance_km - b.distance_km);
            res.json(withDistance);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

const PORT = process.env.PORT ;
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);

});

