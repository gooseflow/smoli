import express from 'express';
import { requestInfo } from '../middleware/logging.js';
import { indexPageDetails } from '../handlers/views.js';
import { urlsHandler } from '../handlers/urls.js';

const router = express.Router();

router.use(requestInfo);

router.get('/', (req, res) => {
    res.render('index', indexPageDetails());
});

router.post('/', async (req, res) => {
    const { url } = req.body;

    // TODO: move this logic to a middleware error handler
    try {
        const shortUrl = await urlsHandler.createShortUrl(url);
        res.json("created shortUrl");
    } catch (error) { }
});

router.get('/:url', async (req, res) => {
    try {
        const { url } = req.params;
        const longUrl = await urlsHandler.getLongUrl(url);
        res.redirect(301, longUrl);
    } catch (error) {
        console.error('longUrl pair not found for shortUrl provided', error);
        res.status(404).send('longUrl pair not found for shortUrl provided');
    }
});

export default router;

