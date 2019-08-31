import fetch from 'dva/fetch';

function parseJSON(response) {
	return response.json();
}

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}

	const error = new Error(response.statusText);
	error.response = response;
	throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
	return fetch('http://47.104.79.113' + url, options)
		.then(checkStatus)
		.then(parseJSON)
		.then((data) => data)
		.catch((err) => ({ err }));
}

exports.get = (url, data) => {
	const params = urlEncoded(data);
	if (url.indexOf('?') < 0 && params) {
		url += '?' + params;
	} else {
		url += '&' + params;
	}
	return request(url, {
		method: 'GET',
		mode: 'cors',
	});
};
/**
 *
 * @param {String} url
 * @param {Object} data
 */
exports.post = (url, data) => {
	return request(url, {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify(data),
	});
};

const urlEncoded = (data) => {
	if (typeof data === 'string') return encodeURIComponent(data);
	let params = [];
	for (let k in data) {
		if (!data.hasOwnProperty(k)) return;
		let v = data[k];
		if (typeof v === 'string') v = encodeURIComponent(v);
		if (Array.isArray(v)) {
			params.push(`${encodeURIComponent(k)}[]=${v}`);
		} else {
			params.push(`${encodeURIComponent(k)}=${v}`);
		}
	}
	return params.join('&');
};
