import axios from 'axios';
import { OPENAI_API_KEY, FORTNITE_API_KEY, STEAM_API_KEY } from '../config/index.js';

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
	stop = [` ${PARTICIPANT_AI}:`, ` ${PARTICIPANT_HUMAN}:`],
}) =>
	chatGptInstance.post('/v1/completions', {
		model,
		prompt,
		temperature,
		max_tokens: maxTokens,
		frequency_penalty: frequencyPenalty,
		presence_penalty: presencePenalty,
		stop,
	});

/** Fortnite 端點 */
const fortniteInstance = axios.create({
	baseURL: 'https://fortnite-api.com/v2/stats/br/v2',
	headers: {
		Authorization: FORTNITE_API_KEY,
	},
});

/** Fortnite 取得狀態 */
export const getStats = (name, option) =>
	fortniteInstance.get('', { params: { name } }).then((res) => {
		const {
			account,
			battlePass,
			stats: {
				all: { overall, solo, duo, squad },
			},
		} = res.data.data;
		let result = '';
		if (option === 'solo') {
			result = `分數： ${solo.score}\n平均分數(分)： ${solo.scorePerMin}\n平均分數(場)： ${solo.scorePerMatch}\n勝利： ${solo.wins}\n前10名： ${solo.top10}\n前25名： ${solo.top25}\n殺敵數： ${solo.kills}\n平均殺敵數(分)： ${solo.killsPerMin}\n平均殺敵數(場)： ${solo.killsPerMatch}\n死亡數： ${solo.deaths}\nKD： ${solo.kd}\n遊玩場數： ${solo.matches}\n勝率： ${solo.winRate}\n遊玩分鐘數： ${solo.minutesPlayed}\n淘汰玩家數： ${solo.playersOutlived}\n最後修改時間： ${solo.lastModified}`;
		} else if (option === 'duo') {
			result = `分數： ${duo.score}\n平均分數(分)： ${duo.scorePerMin}\n平均分數(場)： ${duo.scorePerMatch}\n勝利： ${duo.wins}\n前5名： ${duo.top5}\n前12名： ${duo.top12}\n殺敵數： ${duo.kills}\n平均殺敵數(分)： ${duo.killsPerMin}\n平均殺敵數(場)： ${duo.killsPerMatch}\n死亡數： ${duo.deaths}\nKD： ${duo.kd}\n遊玩場數： ${duo.matches}\n勝率： ${duo.winRate}\n遊玩分鐘數： ${duo.minutesPlayed}\n淘汰玩家數： ${duo.playersOutlived}\n最後修改時間： ${duo.lastModified}`;
		} else if (option === 'squad') {
			result = `分數： ${squad.score}\n平均分數(分)： ${squad.scorePerMin}\n平均分數(場)： ${squad.scorePerMatch}\n勝利： ${squad.wins}\n前3名： ${squad.top3}\n前6名： ${squad.top6}\n殺敵數： ${squad.kills}\n平均殺敵數(分)： ${squad.killsPerMin}\n平均殺敵數(場)： ${squad.killsPerMatch}\n死亡數： ${squad.deaths}\nKD： ${squad.kd}\n遊玩場數： ${squad.matches}\n勝率： ${squad.winRate}\n遊玩分鐘數： ${squad.minutesPlayed}\n淘汰玩家數： ${squad.playersOutlived}\n最後修改時間： ${squad.lastModified}`;
		} else {
			result = `BattlePass： Lv${battlePass.level} ${battlePass.progress}%\n勝利： ${overall.wins}\n前3名： ${overall.top3}\n前5名： ${overall.top5}\n前6名： ${overall.top6}\n前10名： ${overall.top10}\n前12名： ${overall.top12}\n前25名： ${overall.top25}\n殺敵數： ${overall.kills}\n平均殺敵數(分)： ${overall.killsPerMin}\n平均殺敵數(場)： ${overall.killsPerMatch}\n死亡數： ${overall.deaths}`;
		}
		return `[Fortnite] Stats\n帳號： ${account.name}\n`.concat(result);
	});

/** Steam 端點 */
const steamInstance = axios.create({ baseURL: 'http://api.steampowered.com/ISteamUser' });

/** Steam 取得使用者摘要 */
export const getPlayerSummaries = (steamids) =>
	steamInstance.get(`/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamids}`).then((res) => {
		console.log('🚀 , file: openai.js:77 , getPlayerSummaries , res', res.data);
		return res.data.response.players[0].steamid;
	});
