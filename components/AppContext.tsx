import { createContext, useContext, useEffect, useState } from "react";

// @ts-ignore
import converter from 'hex2dec';
import { wei2eth } from "../utils/converter";
import { PKPContract } from "../utils/blockchain/contracts/PKPContract";
import { RouterContract } from "../utils/blockchain/contracts/RouterContract";
import { RateLimitContract } from "../utils/blockchain/contracts/RateLimitContract";
import { APP_CONFIG, SupportedNetworks } from "../app_config";
import getWeb3Wallet from "../utils/blockchain/getWeb3Wallet";

declare global {
    interface Window{
        dec2hex?(pkpId: string):void,
        hex2dec?(pkpId: string):void,
        wei2eth?(v:number):void
    }
}

interface SharedStates{
    pkpContract: PKPContract,
    routerContract: RouterContract,
    rliContract: RateLimitContract,
}

let defaultSharedStates : SharedStates = {
    pkpContract: ({} as PKPContract),
    routerContract: ({} as RouterContract),
    rliContract: ({} as RateLimitContract),
}

const AppContext = createContext(defaultSharedStates);

export const AppContextProvider = ({children}: {children: any}) => {
    
    const [pkpContract, setPkpContract] = useState<PKPContract>();
    const [routerContract, setRouterContract] = useState<RouterContract>();
    const [rliContract, setRliContract] = useState<RateLimitContract>();

    const [loaded, setLoaded] = useState(false);

    const connectContracts = async () => {

        if( pkpContract && routerContract && rliContract && loaded) return;

        console.log("[connectContracts]");

        const { signer } = await getWeb3Wallet();

        const _pkpContract = new PKPContract();
        const _routerContract = new RouterContract();
        const _rliContract = new RateLimitContract();

        await _pkpContract.connect({
            network: SupportedNetworks.CELO_MAINNET,
            contractAddress: APP_CONFIG.PKP_NFT_CONTRACT_ADDRESS,
            signer,
        })
        
        await _routerContract.connect({
            network: SupportedNetworks.CELO_MAINNET,
            contractAddress: APP_CONFIG.ROUTER_CONTRACT_ADDRESS,
            signer,
        })

        await _rliContract.connect({
            network: SupportedNetworks.CELO_MAINNET,
            contractAddress: APP_CONFIG.RATE_LIMIT_CONTRACT_ADDRESS,
            signer,
        })

        setPkpContract(_pkpContract);
        setRouterContract(_routerContract);
        setRliContract(_rliContract);

        setLoaded(true);

    }

    useEffect(() => {

        (async () => {
            
            /**
             * Export bunch of functions so you can test on the browser
             */
            window.dec2hex = converter.decToHex;
            window.hex2dec = converter.hexToDec
            window.wei2eth = wei2eth;

            /**
             * Setup all contracts so that is available on all components
             */
            await connectContracts();

        })();

    });

    let sharedStates = {
        pkpContract: pkpContract as PKPContract,
        routerContract: routerContract as RouterContract,
        rliContract: rliContract as RateLimitContract
    }

    if ( ! loaded ) return <>Loading context...</>;

    return (
        <AppContext.Provider value={sharedStates}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}