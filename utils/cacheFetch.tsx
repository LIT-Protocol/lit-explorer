const fetchAndCache = async (url: string, callback: Function) => {

  console.warn(`[fetchAndCache] fetching new: ${url}`);

  fetch(url).then((res) => res.json()).then((data) => {

    console.log("fetchAndCache data:", data);
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
 * the same data in a small period of time
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

  if( useCache){
    console.log("USE CACHE:", url);
  }

  // -- (cache not used) ignore using cache, using it like a normal fetch()
  if( ! useCache ){
    fetchAndCache(url, callback);
    return;
  }

  // -- (cached and not expired) check if exists in the storage or if the cache expires
  if (storage && new Date().getTime() < isExpired){
    console.warn(`[cacheFetch] using cache: ${url}`);
    data = JSON.parse(storage);
    callback(data.data);

  // -- (not cached and not expired) if it's expired or not in the storage, then run fetch() normally
  }else{
    fetchAndCache(url, callback)
  }

}