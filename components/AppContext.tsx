import { useEffect } from "react";

// @ts-ignore
import converter from 'hex2dec';
import { wei2eth } from "../utils/converter";

declare global {
    interface Window{
        decTohex?(pkpId: string):void,
        wei2eth?(v:number):void
    }
}

const AppContext = ({children}: {children: any}) => {

    useEffect(() => {

        (async () => {
            
            /**
             * Export bunch of functions so you can test on the browser
             */
            window.decTohex = converter.decToHex;
            window.wei2eth = wei2eth;

        })();

    });
    return (
        <>
            { children }
        </>
    )
}
export default AppContext;