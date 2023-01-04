import express from 'express';
import Assistant from '../assistant/index.js';
import { APP_ENV, APP_PORT } from '../config/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assistant = new Assistant();

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
	// res.sendStatus(200);
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.post('/webhook', async (req, res) => {
	await assistant.handleEvents(req.body.events);
	assistant.debug();
	res.sendStatus(200);
});

if (APP_ENV === 'local') {
	app.listen(APP_PORT);
}
console.log(APP_ENV);
export default app;
