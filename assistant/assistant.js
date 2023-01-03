import {
  APP_ENV,
  APP_DEBUG,
} from '../config/index.js';
import {
  PARTICIPANT_AI,
  PARTICIPANT_HUMAN,
  FINISH_REASON_STOP,
  complete,
  getStats,
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
      const game = new RegExp('^\\[FN\\]');
      if (!game.test(message.text)) return null
      const params = message.text.split(',')
      let responseString = '';
      if (params[1].includes('stats')) {
        /** 只看哪個模式 */
        const mode = ['solo', 'duo', 'trio', 'squad'];
        let selectMode = '';
        if (mode.includes(params[1].split('-')[1])) selectMode = params[1].split('-')[1];
        responseString = await getStats(params[2], selectMode)
      }
      const res = { replyToken, messages: [{ type: message.type, text: responseString}]};
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
