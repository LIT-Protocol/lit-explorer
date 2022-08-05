export class CeloExplorer{

    static txLink = (hash: string) : string => {
        return `https://celoscan.io/tx/${hash}`;
    }

}