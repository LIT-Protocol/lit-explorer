import throwError from "./throwError";

interface TryUntilProp{
    onlyIf: Function
    thenRun: Function
    onTrying?(counter: number): Function | void
    max?: number
    interval?: number
}

const tryUntil = async (props: TryUntilProp) : Promise<any> => {

    return new Promise((resolve, reject) => {

        let counter = 0;
        let max = props?.max ?? 10;
        let milliseconds = props?.interval ?? 2000;

        const intervalId = setInterval(async () => {

            const isReady = await props?.onlyIf();

            if( isReady ){
                clearInterval(intervalId);
                let result = await props?.thenRun();
                resolve(result);
            }

            counter = counter + 1;

            // -- (callback) when trying again
            if(props?.onTrying){
                props.onTrying(counter);
            }else{
                console.log(`${counter} trying...`);
            }

            // -- (reject) When tried more than x times
            if( counter >= max ){
                throwError(`Failed to execute: ${props}`);
                reject(counter);
                return;
            }
        }, milliseconds);

    })
}

export default tryUntil;