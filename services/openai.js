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

export const getStats = (name, option) => fortniteInstance.get('', {params:{name}}).then((res) => {
  const {account, battlePass, stats:{ all: { overall, solo, duo, trio, squad }}} = res.data.data;
  let result = '';
  if (option === 'solo') {
    result = `"分數": ${solo.score}\n"平均分數(分)": ${solo.scorePerMin}\n"平均分數(場)": ${solo.scorePerMatch}\n"勝利": ${solo.wins}\n"前10名": ${solo.top10}\n"前25名": ${solo.top25}\n"殺敵數": ${solo.kills}\n"平均殺敵數(分)": ${solo.killsPerMin}\n"平均殺敵數(場)": ${solo.killsPerMatch}\n"死亡數": ${solo.deaths}\n"KD": ${solo.kd}\n"遊玩場數": ${solo.matches}\n"勝率": ${solo.winRate}\n"遊玩分鐘數": ${solo.minutesPlayed}\n"淘汰玩家數": ${solo.playersOutlived}\n"最後修改時間": ${solo.lastModified}`
  }
  else if (option === 'duo') {
    result = `"分數": ${duo.score}\n"平均分數(分)": ${duo.scorePerMin}\n"平均分數(場)": ${duo.scorePerMatch}\n"勝利": ${duo.wins}\n"前10名": ${duo.top10}\n"前25名": ${duo.top25}\n"殺敵數": ${duo.kills}\n"平均殺敵數(分)": ${duo.killsPerMin}\n"平均殺敵數(場)": ${duo.killsPerMatch}\n"死亡數": ${duo.deaths}\n"KD": ${duo.kd}\n"遊玩場數": ${duo.matches}\n"勝率": ${duo.winRate}\n"遊玩分鐘數": ${duo.minutesPlayed}\n"淘汰玩家數": ${duo.playersOutlived}\n"最後修改時間": ${duo.lastModified}`
  }
  else if (option === 'trio') {
    result = `"分數": ${trio.score}\n"平均分數(分)": ${trio.scorePerMin}\n"平均分數(場)": ${trio.scorePerMatch}\n"勝利": ${trio.wins}\n"前10名": ${trio.top10}\n"前25名": ${trio.top25}\n"殺敵數": ${trio.kills}\n"平均殺敵數(分)": ${trio.killsPerMin}\n"平均殺敵數(場)": ${trio.killsPerMatch}\n"死亡數": ${trio.deaths}\n"KD": ${trio.kd}\n"遊玩場數": ${trio.matches}\n"勝率": ${trio.winRate}\n"遊玩分鐘數": ${trio.minutesPlayed}\n"淘汰玩家數": ${trio.playersOutlived}\n"最後修改時間": ${trio.lastModified}`
  }
  else if (option === 'squad') {
    result = `"分數": ${squad.score}\n"平均分數(分)": ${squad.scorePerMin}\n"平均分數(場)": ${squad.scorePerMatch}\n"勝利": ${squad.wins}\n"前10名": ${squad.top10}\n"前25名": ${squad.top25}\n"殺敵數": ${squad.kills}\n"平均殺敵數(分)": ${squad.killsPerMin}\n"平均殺敵數(場)": ${squad.killsPerMatch}\n"死亡數": ${squad.deaths}\n"KD": ${squad.kd}\n"遊玩場數": ${squad.matches}\n"勝率": ${squad.winRate}\n"遊玩分鐘數": ${squad.minutesPlayed}\n"淘汰玩家數": ${squad.playersOutlived}\n"最後修改時間": ${squad.lastModified}`
  } else {
    result = `BattlePass: Lv${battlePass.level} ${battlePass.progress}%\n勝利: ${overall.wins}\n前3名: ${overall.top3}\n前5名: ${overall.top5}\n前6名: ${overall.top6}\n前10名: ${overall.top10}\n前12名: ${overall.top12}\n前25名: ${overall.top25}\n殺敵數: ${overall.kills}\n平均殺敵數(分): ${overall.killsPerMin}\n平均殺敵數(場): ${overall.killsPerMatch}\n死亡數: ${overall.deaths}`
  }
  return `[Fortnite] Stats\n帳號： ${account.name}\n`.concat(result);
})