// just a small backend using express for hosting the database and checking user data from the frontend
import fs from 'fs';
import express, { Request, Response } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from "path";

// Ensure the ./data directory exists (If I don't do this a minor mistake will crash the entire deployment)
const dataDir = path.resolve('./data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
const db = new Database('./data/database.db');
const insertData = (username: string, password: string) => {
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.prepare(query).run(username, password);
    console.log('Data inserted successfully');
};
// Create the users table once on startup
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`).run();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// POST endpoint for login/registration or auth check
app.post('/api/submit', async (req: Request, res: Response) => {
    console.log('Request body', req.body);

    const { username, password, type } = req.body as { username: string; password: string; type: string };
    // Honestly shocked that this database works (for now)
    // Check if user exists
    interface User {
        id: number;
        username: string;
        password: string;
        type: string;
    }

    if (type === 'login') {
        // check if user exists
        const User = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User;
        if (!User) {
            console.log('User does not exist');
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        if (password === User.password) {
            console.log('Login successful');
            res.status(200).json({ message: 'Login successful' });
        } else {
            console.log('Login failed. Wrong password.');
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    else if (type === 'register') {
        insertData(username, password);
    }
    else {
        res.status(400).json({ message: 'Invalid request' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

console.log("Serving static files from:", publicPath);
console.log("home.html exists:", fs.existsSync(path.join(publicPath, 'home.html')));
