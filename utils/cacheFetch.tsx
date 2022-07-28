export const cacheFetch = (url: string, callback: Function) => {

    let data;
    let storage : any = localStorage.getItem(url);
    let isExpired = JSON.parse(storage)?.expire;
  
    if ( storage && new Date().getTime() < isExpired){
      console.warn(`Using cache: ${url}`);
      data = JSON.parse(storage);
      callback(data);
    }else{
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
      });
    }
  }