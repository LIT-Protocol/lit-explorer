import { createContext, useContext, useEffect, useState } from "react";

// @ts-ignore
import converter from 'hex2dec';
import { pub2Addr, wei2eth } from "../../utils/converter";
import { PKPContract } from "../../utils/blockchain/contracts/PKPContract";
import { RouterContract } from "../../utils/blockchain/contracts/RouterContract";
import { RLIContract } from "../../utils/blockchain/contracts/RLIContract";
import { APP_CONFIG, SupportedNetworks } from "../../app_config";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import SEOHeader from "./SEOHeader";
import { Typography } from "@mui/material";
import MyButton from "../UI/MyButton";

declare global {
    interface Window{
        dec2hex?(pkpId: string):void,
        hex2dec?(pkpId: string):void,
        wei2eth?(v:number):void,
        pub2addr?(v:any):void,
    }
}

interface SharedStates{
    pkpContract: PKPContract,
    routerContract: RouterContract,
    rliContract: RLIContract,
}

let defaultSharedStates : SharedStates = {
    pkpContract: ({} as PKPContract),
    routerContract: ({} as RouterContract),
    rliContract: ({} as RLIContract),
}

const AppContext = createContext(defaultSharedStates);

export const AppContextProvider = ({children}: {children: any}) => {
    
    // -- (shared states)
    const [pkpContract, setPkpContract] = useState<PKPContract>();
    const [routerContract, setRouterContract] = useState<RouterContract>();
    const [rliContract, setRliContract] = useState<RLIContract>();

    // -- (state)
    const [web3WalletConnected, setWeb3WalletConnected] = useState(false);
    const [loaded, setLoaded] = useState(false);
    

    const connectContracts = async () => {

        // -- validate
        if( pkpContract && routerContract && rliContract && loaded) return;
        
        console.log("[connectContracts]");

        const { signer } = await getWeb3Wallet();

        const _pkpContract = new PKPContract();
        const _routerContract = new RouterContract();
        const _rliContract = new RLIContract();

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
             * Check if web3 wallet is connected
             */
            const hasWeb3Wallet = typeof window?.ethereum !== 'undefined';
            const walletConnected = window?.ethereum?.selectedAddress !== undefined || localStorage.getItem('wallet-connected') == 'true';
            
            console.log("hasWeb3Wallet:", hasWeb3Wallet);
            console.log("walletConnected:", walletConnected);
            
            if ( hasWeb3Wallet ){

                window?.ethereum?.on("accountsChanged", (accounts: Array<string>) => {

                    /* do what you want here */
                    console.log("accounts:", accounts);

                    if( accounts.length > 0){
                        setWeb3WalletConnected(true);
                    }
                })
            }

            const connected = hasWeb3Wallet && walletConnected;

            console.log("connected:", connected)

            setWeb3WalletConnected(connected);

            if ( ! connected ) return;
            
            /**
             * Export bunch of functions so you can test on the browser
             */
            window.dec2hex = converter.decToHex;
            window.hex2dec = converter.hexToDec
            window.wei2eth = wei2eth;
            window.pub2addr = pub2Addr

            /**
             * Setup all contracts so that is available on all components
             */
            await connectContracts();


        })();

    }, [web3WalletConnected]);

    let sharedStates = {
        pkpContract: pkpContract as PKPContract,
        routerContract: routerContract as RouterContract,
        rliContract: rliContract as RLIContract,
    }

    // -- (event) handle login
    const handleLogin = async () => {
        await getWeb3Wallet();
        localStorage.setItem('wallet-connected', JSON.stringify(true));
        setWeb3WalletConnected(true);
    }

    // -- (render) web3 not logged
    const renderNotLogged = () => {
        
        return (
            <div className="mt-24 flex">
                <div className="text-center m-auto">
                    <Typography variant="h4">Welcome to Lit Explorer! 👋🏻</Typography>
                    <p className="paragraph">Please sign-in to your web3 account and start the adventure</p>
                    <MyButton className="mt-12" onClick={handleLogin}>Connect Wallet</MyButton>
                </div>

            </div>
        )

    }

    if ( ! web3WalletConnected ) return renderNotLogged();
    if ( ! loaded ) return <>Loading context...</>;
    if ( ! loaded ) return <></>;

    return (
        <AppContext.Provider value={sharedStates}>
            <SEOHeader/>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}