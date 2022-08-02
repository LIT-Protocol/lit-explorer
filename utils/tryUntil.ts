import throwError from "./throwError";

interface TryUntilProp{
    onlyIf: Function
    thenRun: Function
}

const tryUntil = async (prop: TryUntilProp) : Promise<any> => {

    return new Promise((resolve, reject) => {

        let counter = 0;
        let max = 10;
        let milliseconds = 2000;

        const intervalId = setInterval(async () => {

            const isReady = await prop?.onlyIf();

            if( isReady ){
                clearInterval(intervalId);
                let result = await prop?.thenRun();
                resolve(result);
            }

            counter = counter + 1;

            console.log(`${counter} trying...`);

            if( counter >= max ){
                throwError(`Failed to execute: ${prop}`);
                reject(counter);
                return;
            }
        }, milliseconds);

    })
}

export default tryUntil;