import fetch from 'dva/fetch';
import { RootBase } from '../services/api';
import { joinUrlEncoded } from '.';
import { Message } from 'antd';
Message.config({
	top: 100,
	duration: 2,
	maxCount: 3,
});
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
export default function request(url, options, showmsg) {
	return fetch(RootBase + url, options)
		.then(checkStatus)
		.then(parseJSON)
		.then((data) => {
			if (data.success === false && data.faildesc !== '' && showmsg)
				Message.warning(data.faildesc);
			// console.log((window.location.href = '/'));
			return data;
		})
		.catch((err) => ({ err }));
}

exports.get = (url, data, showmsg) => {
	url = joinUrlEncoded(url, data);
	return request(
		url,
		{
			method: 'GET',
			mode: 'cors',
		},
		showmsg,
	);
};
/**
 *
 * @param {String} url
 * @param {Object} data
 */
exports.post = (url, data, showmsg) => {
	return request(
		url,
		{
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(data),
		},
		showmsg,
	);
};

// const urlEncoded = (data) => {
// 	if (typeof data === 'string') return encodeURIComponent(data);
// 	let params = [];
// 	for (let k in data) {
// 		if (!data.hasOwnProperty(k)) return;
// 		let v = data[k];
// 		if (typeof v === 'string') v = encodeURIComponent(v);
// 		if (Array.isArray(v)) {
// 			params.push(`${encodeURIComponent(k)}[]=${v}`);
// 		} else {
// 			params.push(`${encodeURIComponent(k)}=${v}`);
// 		}
// 	}
// 	return params.join('&');
// };
