import express from 'express';
const router = express.Router();

router.get('/', (_, res) => {
    res.send('Hello world\n');
})

router.get('/fmm', (_, res) => {
    res.send('Fmm world\n');
})

export default router;
