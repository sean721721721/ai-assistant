import {
  APP_ENV,
  APP_DEBUG,
} from '../config/index.js';
import {
  FORTNITE_API_KEY,
} from '../config/index.js';
import axios from 'axios';
import {
  PARTICIPANT_AI,
  PARTICIPANT_HUMAN,
  FINISH_REASON_STOP,
  complete,
  getData,
} from '../services/openai.js';
import {
  EVENT_TYPE_MESSAGE,
  MESSAGE_TYPE_TEXT,
  reply,
} from '../services/line.js';
import Storage from './storage.js';

class Assistant {
  storage = new Storage();

  handleEvents(events = []) {
    return Promise.all(events.map((event) => this.handleEvent(event)));
  }

  async handleEvent({
    replyToken,
    type,
    source,
    message,
  }) {
    if (type !== EVENT_TYPE_MESSAGE) return null;
    if (message.type !== MESSAGE_TYPE_TEXT) return null;
    const regex = new RegExp('^小白');
    if (!regex.test(message.text)) {
      const game = new RegExp('^fn');
      if (!game.test(message.text)) return null
      const response = await axios({
        method: 'get',
        url: 'https://fortnite-api.com/v2/stats/br/v2?name=sean721721721',
        headers: {
          Authorization: FORTNITE_API_KEY,
        }
      })
      const {account, battlePass} = response.data.data;
      console.log(JSON.stringify({name: account.name, battlePass}))
      const res = { replyToken, messages: [{ type: message.type, text: JSON.stringify({name: account.name, battlePass}) }] };
      return APP_ENV === 'local' ? res : reply(res);
    }
    const prompt = this.storage.getPrompt(source.userId);
    prompt.write(`${PARTICIPANT_HUMAN}: ${message.text.replace('小白', '')}？`);
    const { text } = await this.chat({ prompt: prompt.toString() });
    prompt.write(`${PARTICIPANT_AI}: ${text}`);
    this.storage.setPrompt(source.userId, prompt);
    const res = { replyToken, messages: [{ type: message.type, text }] };
    return APP_ENV === 'local' ? res : reply(res);
  }

  async chat({
    prompt,
    text = '',
  }) {
    const { data } = await complete({ prompt });
    const [choice] = data.choices;
    prompt += choice.text.trim();
    text += choice.text.replace(PARTICIPANT_AI, '').replace(':', '').replace('：', '').trim();
    const res = { prompt, text };
    return choice.finish_reason === FINISH_REASON_STOP ? res : this.chat(res);
  }

  debug() {
    if (APP_DEBUG) console.info(this.storage.toString());
  }
}

export default Assistant;
