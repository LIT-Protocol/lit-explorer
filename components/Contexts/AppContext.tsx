import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

// @ts-ignore
import converter from 'hex2dec';
import { pub2Addr, wei2eth } from "../../utils/converter";
import { PKPContract } from "../../utils/blockchain/contracts/PKPContract";
import { RouterContract } from "../../utils/blockchain/contracts/RouterContract";
import { RLIContract } from "../../utils/blockchain/contracts/RLIContract";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import { CircularProgress, Typography } from "@mui/material";
import MyButton from "../UI/MyButton";
import { APP_CONFIG, APP_LINKS, DEFAULT_LIT_ACTION, ROUTES, SEARCH_ROUTES, STORAGE_KEYS, SupportedNetworks, SupportedSearchTypes, SUPPORTED_CHAINS } from "../../app_config";
import throwError from "../../utils/throwError";
import NavPath from "../UI/NavPath";
import SearchBar from "../Forms/SearchBar";
import router from "next/router";
import { AppRouter } from "../../utils/AppRouter";
import { ABIS } from "../../ABIsFallback";
import { PKPPermissionsContract } from "../../utils/blockchain/contracts/PKPPermissionsContract";
import { PKPHelperContract } from "../../utils/blockchain/contracts/PKPHelperContract";

declare global {
    interface Window{
        dec2hex?(pkpId: string):void,
        hex2dec?(pkpId: string):void,
        wei2eth?(v:number):void,
        pub2addr?(v:any):void,
        config: any,
        login: any,
        logout: any,
        listCommands: any,
    }
}

interface MyWeb3{
    get: boolean,
    login(): Promise<void>,
    logout(): Promise<void>,
    ownerAddress: any,
}

interface SharedStates{
    pkpContract: PKPContract,
    pkpPermissionsContract: PKPPermissionsContract,
    pkpHelperContract: PKPHelperContract,
    routerContract: RouterContract,
    rliContract: RLIContract,
    web3: MyWeb3
}

let defaultSharedStates : SharedStates = {
    pkpContract: ({} as PKPContract),
    pkpPermissionsContract: ({} as PKPPermissionsContract),
    pkpHelperContract: ({} as PKPHelperContract),
    routerContract: ({} as RouterContract),
    rliContract: ({} as RLIContract),
    web3: ({} as MyWeb3)
}

const AppContext = createContext(defaultSharedStates);

export const AppContextProvider = ({children}: {children: any}) => {
    
    // -- (shared states)
    const [pkpContract, setPkpContract] = useState<PKPContract>();
    const [pkpPermissionsContract, setPkpPermissionsContract] = useState<PKPPermissionsContract>();
    const [pkpHelperContract, setPkpHelperContract] = useState<PKPHelperContract>();
    const [routerContract, setRouterContract] = useState<RouterContract>();
    const [rliContract, setRliContract] = useState<RLIContract>();
    const [ownerAddress, setOwnerAddress] = useState<string>();

    // -- (state)
    const [web3Connected, setWeb3Connected] = useState(false);
    const [contractsLoaded, setContractsLoaded] = useState(false);
    const [clickedConnectWallet, setClickedConnectWallet] = useState(false);

    const injectGlobalFunctions = () => {

        // console.warn("...injectGlobalFunctions");
        
        window.dec2hex = converter.decToHex;
        window.hex2dec = converter.hexToDec
        window.wei2eth = wei2eth;
        window.pub2addr = pub2Addr;
        window.login = onLogin
        window.logout = onLogout
        window.config = {
            APP_CONFIG,
            STORAGE_KEYS,
            APP_LINKS,
            SupportedNetworks,
            SUPPORTED_CHAINS,
            SupportedSearchTypes,
            SEARCH_ROUTES,
            ROUTES,
            DEFAULT_LIT_ACTION,
            ABIS,
        }
    }
    
    const connectContracts = async () => {

        // console.warn("...connectContracts");

        // -- validate
        if( pkpContract && routerContract && rliContract && contractsLoaded) return;
        
        console.log("[connectContracts]");

        const { signer } = await getWeb3Wallet();

        const _pkpContract = new PKPContract();
        const _pkpPermissionsContract = new PKPPermissionsContract();
        const _pkpHelperContract = new PKPHelperContract();
        const _routerContract = new RouterContract();
        const _rliContract = new RLIContract();
        
        // (new)
        await _pkpPermissionsContract.connect({ signer });

        await _pkpHelperContract.connect({ signer });

        await _pkpContract.connect({ signer })
        
        await _routerContract.connect({ signer })

        await _rliContract.connect({ signer })

        // const PKP_TOKEN_ID = '97194107225080213901219764844025856477702741025523632755533808599240578068193';
        // const TARGET_ADDRESS = '0x75EdCdfb5A678290A8654979703bdb75C683B3dD';
    
        // const tx = await _pkpPermissionsContract.write.addPermittedAddress(PKP_TOKEN_ID, TARGET_ADDRESS, _routerContract);
 
        setPkpContract(_pkpContract);
        setRouterContract(_routerContract);
        setRliContract(_rliContract);

        setPkpPermissionsContract(_pkpPermissionsContract);
        setPkpHelperContract(_pkpHelperContract);

        setContractsLoaded(true);

    }

    // -- (event listeners) listen to all given events,
    // and ignore if the given events are already being listened
    const listenToWalletEvents = () : void => {

        console.warn("...listenToWalletEvents");

        // -- setup events you want to listen
        const walletEvents = {
            'accountsChanged': (accounts: Array<string>) => {
                const newOwner = accounts[0];
                console.warn('[walletEvent:accountsChanged] output<newOwner>:', newOwner);
                setOwnerAddress(newOwner)
            },
            'connect': (e: any) => console.warn("connect:", e),
            'disconnect': (e: any) => console.warn("disconnect:", e),
            'chainChanged': (e: any) => console.warn("chainChanged:", e),
        }

        const keys = Object.keys(walletEvents);

        localStorage.setItem(STORAGE_KEYS.WALLET_EVENTS, keys.toString());

        // check if listener already exists
        let attachedWalletEvents : Array<string>;
        
        try{
            attachedWalletEvents = window?.ethereum?.eventNames();
        }catch(e: any){
            console.warn("Provider Error:", e.message);
            console.warn("Using localStorage as a fallback method instead");
            attachedWalletEvents = (localStorage.getItem(STORAGE_KEYS.WALLET_EVENTS)?.split(',') as Array<string>);
        }

        keys.forEach((eventName: string, i:number) => {

            // -- ignore if event already attached
            if(attachedWalletEvents.includes(eventName)) return;

            // -- finally
            const callback = Object.values(walletEvents)[i];
            window.ethereum.on(eventName, callback);
        })

        console.warn("✅ Web3 Provider Found! Listening to events:", Object.keys(walletEvents), '...');
    }

    /**
     * An object to check if a web3 provider && wallet is connected
     * @returns 
     */
    const MyWeb3 = () : {
        installed: boolean, 
        walletConnected: boolean, 
        eventsListened: boolean, 
        connected: boolean,
        logged: boolean,
    } => {
        
        let installed = false;
        let walletConnected = false;
        let eventsListened = false;
        let logged = false;
        let connected = false;

        try{
            installed = typeof window?.ethereum !== 'undefined';
            walletConnected = localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED) == 'true';
            eventsListened = localStorage.getItem(STORAGE_KEYS.WALLET_EVENTS) == 'true';
            logged = localStorage.getItem(STORAGE_KEYS.LOGGED) == 'true';
            connected = installed && walletConnected;  
        }catch(e){
            console.warn("Failed to run MyWeb3():", e);
        }

        return { installed, walletConnected, eventsListened, connected, logged }
    }

    useEffect(() => {

        // console.warn("...running useEffect");

        /**
         * Export bunch of functions so you can test on the browser
         */
        injectGlobalFunctions();

        (async () => {

            // -- If a web3 provider is installed && cache key is found in the local storage
            console.warn(`${MyWeb3().installed ? '✅ ' : '❌ '}MyWeb3().installed`)
            console.warn(`${MyWeb3().walletConnected ? '✅ ' : '❌ '}MyWeb3().walletConnected`)

            // -- If both web provider is installed and wallet is connected
            if ( MyWeb3().connected && !contractsLoaded ){

                // console.warn("...inside connected but contracts NOT loaded");
                
                /**
                 * Setup all contracts so that is available on all components
                 * ** DON'T Connect until user clicks "CONNECT WALLET" **
                 * This will stop the popup
                 */
                if( clickedConnectWallet || MyWeb3().logged){
                    connectContracts();
    
                    const { ownerAddress } = await getWeb3Wallet();
                    setOwnerAddress(ownerAddress);
                }

                return;
            }

            // -- If a web3 provider is installed
            if ( MyWeb3().installed && !MyWeb3().eventsListened){

                // console.warn("...inside installed but events NOT listened");

                listenToWalletEvents()
            }

            // -- trigger state change
            setWeb3Connected(MyWeb3().connected);

        })();

    }, [web3Connected, clickedConnectWallet]);

    /**
     * 
     * Event: when user is typing on the search bar
     * 
     * @param { any } e event
     * @returns { void } 
     */
     const onSearch = (e: any): void => {
  
        // -- config
        const MIN_LENGTH = 20;
        
        // -- prepare
        const keyboardKey = e.key;
        const text = (document.getElementById('search-bar') as HTMLInputElement).value;

        // -- validate
        if( keyboardKey && keyboardKey !== 'Enter') return;
        if( text.length <= MIN_LENGTH){
            throwError(`Search length cannot be less than ${MIN_LENGTH} characters`)
        };

        // -- prepare
        const id = text;

        router.push(AppRouter.getPage(id))
    }

    // -- (event) handle login
    const onLogin = async () => {

        setClickedConnectWallet(true);

        console.warn('[onLogin]')

        let _ownerAddress;

        try{
            const { ownerAddress } = await getWeb3Wallet();
            
            console.warn('[onLogin]: output<ownerAddress>:', ownerAddress)

            _ownerAddress = ownerAddress;

            localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');
            
            console.log("MyWeb3().connected:", MyWeb3().connected);

            setWeb3Connected(MyWeb3().connected);

            localStorage.setItem(STORAGE_KEYS.LOGGED, "true");

        }catch(e:any){

            if( e === '8546: Not implemented'){
                alert(`[${e}] Found conflicts between Metamask and Coinbase or Enkrypt Google Chrome Extensions. We are investigating a solution. Meanwhile, please remove the extensions so that Metamask could proceed. Thanks!`);
                throwError(e);
                return;
            }

            console.error("[onLogin] error<e.message>:", e.message ?? e);
            throwError(e.message);

            return;
        }

        console.log("_ownerAddress:", _ownerAddress)
    }

    // -- (event) logout of web 3
    const onLogout = async () => {
        console.log("onLogout:", onLogout);
        setClickedConnectWallet(false);
        setWeb3Connected(false);
        setContractsLoaded(false);
        localStorage.removeItem(STORAGE_KEYS.LOGGED)
        localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED)
        localStorage.removeItem(STORAGE_KEYS.WALLET_EVENTS)
    }

    // -- (render) web3 not logged
    const renderNotLogged = () => {
        
        return (
            <div className="flex login">
                <div className="text-center m-auto">
                    <Typography variant="h4">Welcome to Lit Explorer! 👋🏻</Typography>
                    <p className="paragraph">Please sign-in to your web3 account and start the adventure.</p>
                    <p className="paragraph">To learn more about Programmable Key Pairs (PKPs) and Lit Actions, read our <a href="https://developer.litprotocol.com/LitActionsAndPKPs/whatAreLitActionsAndPKPs">documentation</a>.</p>
                    <MyButton className="mt-12" onClick={onLogin}>Connect Wallet</MyButton>
                </div>
            </div>
        )
    }

    if ( ! web3Connected && ! contractsLoaded && ! clickedConnectWallet ) return renderNotLogged();

    // -- share states for children components
    let sharedStates = {
        pkpContract: pkpContract as PKPContract,
        pkpPermissionsContract: pkpPermissionsContract as PKPPermissionsContract,
        pkpHelperContract: pkpHelperContract as PKPHelperContract,
        routerContract: routerContract as RouterContract,
        rliContract: rliContract as RLIContract,
        web3: {
            get: web3Connected,
            login: onLogin,
            logout: onLogout,
            ownerAddress: ownerAddress,
        }
    }

    return (
        <AppContext.Provider value={sharedStates}>
            <SearchBar onSearch={onSearch} />
            <div id="main-dynamic-content">
                <NavPath/>
                { children }
            </div>
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}