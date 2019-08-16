/**
 * 缓存一次回话数据
 */

export default new (class {
	cache = {};

	constructor() {
		try {
			sessionStorage.setItem('check', '1');
			this.cache = sessionStorage;
		} catch (error) {
			this._init();
		}
	}
	_init() {
		this.cache = {};
		this.cache.setItem = this._setItem.bind(this);
		this.cache.getItem = this._getItem.bind(this);
		this.cache.removeItem = this._removeItem.bind(this);
		this.cache.clear = this._init.bind(this);
	}
	_setItem(key, value) {
		this.cache[key] = value;
	}
	_getItem(key) {
		return this.cache[key];
	}
	_removeItem(key) {
		delete this.cache[key];
	}

	/**
	 *
	 * @param {*} key
	 * @param {*} value
	 */
	set(key, value, expire = 0) {
		try {
			this.cache.setItem(
				key,
				JSON.stringify({
					value,
					time: Date.now(),
					expire,
				}),
			);
		} catch (e) {
			if (console) console.warn('数据库满了。');
		}
	}
	/**
	 *
	 * @param {*} key
	 * @param {*} missing
	 */
	get(key, missing) {
		let data;
		try {
			data = JSON.parse(this.cache.getItem(key));
			if (data.expire !== 0 && Date.now() - data.time > data.expire) {
				data = null;
			}
		} catch (error) {
			//
		}
		if (data === null || data === undefined) {
			return missing;
		} else if (typeof data.value !== 'undefined') {
			return data.value;
		} else {
			return missing;
		}
	}
	/**
	 *
	 * @param {*} key
	 */
	remove(key) {
		this.cache.removeItem(key);
	}
	/**
	 *
	 */
	clear() {
		this.cache.clear();
	}
})();
