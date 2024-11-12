import express from 'express';
import { connectDB } from './db.js';
const router = express.Router();

router.get('/', (_, res) => {
    res.send('Hello world\n');
})

router.get('/dbtest', async (_, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('some-collection');
        const data = await collection.find().toArray();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from the database');
    }
});

export default router;
