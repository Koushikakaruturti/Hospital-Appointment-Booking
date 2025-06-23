// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
// Serve static HTML
app.use(express.static('public'));


// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'koushi2834', // <<< Add your MySQL password here
  database: 'healthcare',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit();
  }
  console.log('✅ Connected to MySQL database');
});

// POST route to save appointments
app.post('/api/appointments', (req, res) => {
  const { patientName, disease, appointmentTime } = req.body;

  if (!patientName || !disease || !appointmentTime) {
    return res.status(400).send('Missing fields');
  }

  const sql = `INSERT INTO appointments (patient_name, disease, appointment_time) VALUES (?, ?, ?)`;
  db.query(sql, [patientName, disease, appointmentTime], (err, result) => {
    if (err) {
      console.error('❌ Error saving to database:', err);
      return res.status(500).send('Failed to book appointment');
    }
    res.status(200).send('Appointment saved');
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
