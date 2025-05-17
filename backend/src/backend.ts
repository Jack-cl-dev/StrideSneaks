// just a small backend using express for hosting the database and checking user data from the frontend
//this is being odd with the github push
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express(); // this creates an instance of express by calling it with an empty arg list (I think?)
app.use(express.json()); //tells express to parse JSON data from the request body
app.use(cors()); //allows cross-origin requests

// create a POST route to receive data from the frontend
app.post('/api/submit', (req: Request, res: Response) => {
    console.log('Request body', req.body);
    const body = req.body as unknown as { username: string; password: string };

    const { username, password } = body;

    //some temp login code to replace a database for a while
    if (username === 'admin' && password === '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918') {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});


// opens the server on port 3000
app.listen(3000, () => {
    console.log('listening on port 3000');
});