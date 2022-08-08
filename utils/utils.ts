export const asyncForEach = async (array: Array<any> | any, callback: Function) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
    return array;
  }

  export const asyncForEachReturn = async (array: Array<any>, callback: Function) => {

    const list = [];

    for (let index = 0; index < array.length; index++) {
        const item = await callback(array[index], index, array)
        list.push(item);
    }
    return list;
  }

  export const wait = async (ms: number) => await new Promise(resolve => setTimeout(resolve, ms ?? 1000));