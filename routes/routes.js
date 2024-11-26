import express from 'express';
import { requestInfo } from '../middleware/logging.js';
import { indexPageDetails } from '../handlers/views.js';
import { urlsHandler } from '../handlers/urls.js';

const router = express.Router();

router.use(requestInfo);

router.get('/', (req, res) => {
    res.render('index', indexPageDetails());
});

router.get('/shortUrl', async (req, res) => {
    try {
        const r = await getShortUrl(req.query.url);
        res.json(r);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from the database');
    }
});

router.get('/test', async (_, res) => {
    try {
        await urlsHandler.getShortUrl("someLongUrl");

        res.json({});
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data from the database');
    }
});

export default router;
