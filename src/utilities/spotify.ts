import axios from 'axios';

const {
	SPOTIFY_CLIENT_ID: client_id,
	SPOTIFY_CLIENT_SECRET_TOKEN: client_secret,
	SPOTIFY_REFRESH_TOKEN: refresh_token
} = process.env;

const token = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const getAccessToken = async () => {
	const res = await axios.post<{ access_token: string }>(
		process.env.TOKEN_ENDPOINT,
		new URLSearchParams([
			['grant_type', 'refresh_token'],
			['refresh_token', refresh_token]
		]).toString(),
		{
			headers: {
				Authorization: `Basic ${token}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	);

	return res.data.access_token;
};

export const getNowPlaying = async () => {
	const access_token = await getAccessToken();

	return axios.get<SpotifyData>(process.env.NOW_PLAYING_ENDPOINT as string, {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});
};
