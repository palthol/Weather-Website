import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Route to serve index.html
router.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../../../client/index.html'), (err) => {
        if (err) {
            console.error(`Error serving file at ${path.join(__dirname, '../../../client/index.html')}:`, err);
            res.status(500).send('Error serving the HTML file');
        }
    });
});

export default router;
