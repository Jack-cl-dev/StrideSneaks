// just a small backend using express for hosting the database and checking user data from the frontend
//this is being odd with the github push
import express, { Request, Response } from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const db = new Database('./database.db');

// Create the users table once on startup
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`).run();

const app = express();
app.use(express.json());
app.use(cors());

// POST endpoint for login/registration or auth check
app.post('/api/submit', async (req: Request, res: Response) => {
    console.log('Request body', req.body);

    const { username, password } = req.body as { username: string; password: string };
    // Honestly shocked that this database works (for now)
    // Check if user exists
    interface User {
        id: number;
        username: string;
        password: string;
    }

    const User = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User;
    if (!User) {
        console.log('User does not exist');
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    // User exists
    if (password === User.password) {
        console.log('Login successful');
        res.status(200).json({ message: 'Login successful' });
    } else {
        console.log('Login failed. Wrong password.');
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('listening on port 3000');
});
