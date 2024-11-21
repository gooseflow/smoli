import express from 'express';
import { connectDB } from '../persistence/db.js';
import { requestInfo } from '../middleware/logging.js';
import { indexPageDetails } from '../handlers/views.js';
import { getShortUrl } from '../persistence/urls.js';

const router = express.Router();

router.use(requestInfo);

router.get('/', (req, res) => {
    res.render('index', indexPageDetails());
});

router.get('/shortUrl', async (req, res) => {
    try {
        console.log('query', req.query)
        const r = await getShortUrl(req.query.url);
        res.json(r);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from the database');
    }
});

router.post('/dbtest', async (_, res) => {
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
