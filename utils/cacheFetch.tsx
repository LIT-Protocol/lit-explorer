/**
 *
 * CacheFetch will keep your data in local storage for a minute and avoid user keep loading it.
 *
 * @param url
 * @param callback
 * @param useCache
 * @returns
 */
export const cacheFetch = async (
	url: string,
	callback: Function,
	useCache = true,
	{
		cacheExpire = 60 * 1000, // 1 minute
	}
) => {
	console.log(`
  // =================================
  //          FETCHING DATA                                    
  // =================================
`);
	let storageItem: any;

	try {
		storageItem = localStorage.getItem(url);
		storageItem = JSON.parse(storageItem);
	} catch (e) {
		console.log("ERROR:", e);
	}

	let expireDate = storageItem?.expire;
	// turn timestamp into readable date
	expireDate = new Date(expireDate);
	let isExpired = new Date().getTime() > expireDate;

	// create a console.log table for the data
	console.table({
		url,
		useCache,
		storageItem,
		expireDate,
		isExpired,
	});

	if (useCache) {
		console.log("USE CACHE:", url);
	}

	// =================================================
	//          FRESH FETCH - NOT USING CACHE
	// =================================================
	// -- (cache not used) ignore using cache, using it like a normal fetch()
	if (!useCache) {
		const res = await fetch(url).then((res) => res.json());
		callback(res);
		return;
	}

	// ===========================================
	//          USE CACHE & NOT EXPIRED
	// ===========================================
	// -- (cached and not expired) check if exists in the storage or if the cache expires
	if (storageItem && !isExpired) {
		console.warn(`[cacheFetch] using cache: ${url}`);
		callback(storageItem.data);

		// ==================================================
		//          CACHE EXPIRED - SO FETCH AGAIN
		// ==================================================
		// -- (not cached and not expired) if it's expired or not in the storage, then run fetch() normally
	} else {
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				console.log("fetchAndCache data:", data);
				var date = new Date();
				var expires = new Date();

				// expires in 1 minute
				expires.setTime(date.getTime() + cacheExpire);

				localStorage.setItem(
					url,
					JSON.stringify({
						data,
						expire: expires.getTime(),
					})
				);

				callback(data);
			});
	}
};
