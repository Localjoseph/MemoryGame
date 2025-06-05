const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());


const db = new sqlite3.Database('scores.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the scores database.');
});


db.run(`CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    difficulty TEXT,
    time INTEGER
)`);


app.post('/submit-score', (req, res) => {
    const { name, difficulty, time } = req.body;

    const query = `INSERT INTO scores (name, difficulty, time) VALUES (?, ?, ?)`;
    db.run(query, [name, difficulty, time], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error saving score");
        } else {
            res.status(200).send("Score saved successfully");
        }
    });
});


app.get('/scores', (req, res) => {
    db.all(`SELECT * FROM scores`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error retrieving scores");
        } else {
            res.status(200).json(rows);
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});