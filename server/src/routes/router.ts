import express from 'express';
import weatherRoutes from './api/weatherRoutes.js'; // Weather-specific routes
import path from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();


// Route to serve index.html
router.get('/', (req, res) => {
    const filePath = path.resolve(__dirname, '../../../client/index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(`Error serving file`, err);


            const statusCode = (err as any).status || 500;
            res.status(statusCode).send('Error serving the HTML file');
        }
    });
});

// Mount API routes
router.use('/api/weather', weatherRoutes);



export default router;
