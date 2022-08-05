const fetchAndCache = async (url: string, callback: Function) => {

  console.warn(`Fetching new: ${url}`);

  fetch(url).then((res) => res.json()).then((data) => {
    var date = new Date();
    var expires = new Date();
    expires.setTime(date.getTime() + (60 * 1000));

    localStorage.setItem(url, JSON.stringify({
      data,
      expire: expires.getTime()
    }));

    callback(data);
  })
}

/**
 * 
 * cacheFetch is like fetch but caching the first fetched data
 * into user's local storage for a minute to avoid user keep loading
 * the same data in a smart period of time
 * 
 * @param url 
 * @param callback 
 * @param useCache 
 * @returns 
 */
export const cacheFetch = (url: string, callback: Function, useCache = true) => {

  let data;
  let storage : any = localStorage.getItem(url);
  let isExpired = JSON.parse(storage)?.expire;

  // -- (cache not used) ignore using cache, using it like a normal fetch()
  if( ! useCache ){
    fetchAndCache(url, callback);
    return;
  }

  // -- (cached and not expired) check if exists in the storage or if the cache expires
  if (storage && new Date().getTime() < isExpired){
    console.warn(`Using cache: ${url}`);
    data = JSON.parse(storage);
    callback(data.data);

  // -- (not cached and not expired) if it's expired or not in the storage, then run fetch() normally
  }else{
    fetchAndCache(url, callback)
  }

}