import { NextRouter } from "next/dist/client/router";

export class RouterPush {

    static registerAction = (router: NextRouter, ipfsId: string) => {
        router.push(`/actions/${ipfsId}/update`);
    }

}