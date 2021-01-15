const axios = require("axios");

const API_ENDPOINT = process.env.REACT_APP_API_URL;

export const searchMovies = async (movieName) => {
	const endpoint = `${API_ENDPOINT}s=${movieName}`;

	try {
		const response = await axios({
			method: "get",
			url: endpoint,
		});
		return response;
	} catch (error) {
		return error;
	}
};
