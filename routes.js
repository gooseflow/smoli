import express from 'express';
import { connectDB } from './db.js';
const router = express.Router();

router.get('/', (_, res) => {
    res.send('Hello world\n');
})

router.get('/dbtest', async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('documents');
        const data = await collection.find().toArray();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from the database');
    }
});

router.post('/dbtest', async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('documents');
        const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
        console.log('Inserted documents =>', insertResult);
        res.json(insertResult);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from the database');
    }
});

export default router;
