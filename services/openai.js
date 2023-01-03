import axios from 'axios';
import {
  OPENAI_API_KEY,
  FORTNITE_API_KEY,
} from '../config/index.js';

export const PARTICIPANT_AI = 'AI';
export const PARTICIPANT_HUMAN = 'Human';
export const FINISH_REASON_STOP = 'stop';
export const FINISH_REASON_LENGTH = 'length';

const chatGptInstance = axios.create({
  baseURL: 'https://api.openai.com',
  timeout: 60 * 1000,
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

export const complete = ({
  model = 'text-davinci-003',
  prompt,
  temperature = 0.9,
  maxTokens = 240,
  frequencyPenalty = 0,
  presencePenalty = 0.6,
  stop = [
    ` ${PARTICIPANT_AI}:`,
    ` ${PARTICIPANT_HUMAN}:`,
  ],
}) => chatGptInstance.post('/v1/completions', {
  model,
  prompt,
  temperature,
  max_tokens: maxTokens,
  frequency_penalty: frequencyPenalty,
  presence_penalty: presencePenalty,
  stop,
});

const fortniteInstance = axios.create({
  baseURL: 'https://fortnite-api.com/v2/stats/br/v2?name=sean721721721',
  headers: {
    Authorization: FORTNITE_API_KEY,
  }
})

export const getStats = (name) => fortniteInstance.get('', {params:{name}}).then((res) => {
  const {account, battlePass, stats:{ all: { overall }}} = res.data.data;
  return `[Fortnite] Stats\n帳號： ${account.name}\nBattlePass: Lv${battlePass.level} ${battlePass.progress}%\n勝利: ${overall.wins}\n前3名: ${overall.top3}\n前5名: ${overall.top5}\n前6名: ${overall.top6}\n前10名: ${overall.top10}\n前12名: ${overall.top12}\n前25名: ${overall.top25}\n殺敵數: ${overall.kills}\n平均殺敵數(分): ${overall.killsPerMin}\n平均殺敵數(場): ${overall.killsPerMatch}\n死亡數: ${overall.deaths}`;
})