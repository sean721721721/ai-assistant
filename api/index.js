import express from 'express';
import Assistant from '../assistant/index.js';
import {
  APP_ENV,
  APP_PORT,
} from '../config/index.js';

const assistant = new Assistant();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.post('/webhook', async (req, res) => {
  console.log(req.body.events)
  console.log(!res.body.events || !res.body.events.some(({message}) => message.text && message.text.includes('小白')))
//  if (!res.body.events || !res.body.events.some(({message}) => message.text && message.text.includes('小白'))) {
//    res.sendStatus(200);
// } else {
  await assistant.handleEvents(req.body.events);
  assistant.debug();
  res.sendStatus(200);
// }
});

if (APP_ENV === 'local') {
  app.listen(APP_PORT);
}

export default app;
