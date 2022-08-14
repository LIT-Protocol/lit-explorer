/** ========== CONTRACT ADDRESSES ========== */
export const APP_CONFIG = {
    PKP_NFT_CONTRACT_ADDRESS: "0x594E1dA675e2a17866B7E3D80c96Cb396f2A4ccD", 
    RATE_LIMIT_CONTRACT_ADDRESS: "0x7FdcF78D2961186a2015Da41104F241531be299f",
    ROUTER_CONTRACT_ADDRESS: "0xbd757dD9Bfba4Ac6df1E7e66B9C40486f4681f9B",
    ECDSA_KEY: 2,
    IPFS_PIN_NAME: 'Lit Explorer v0.1.0',
    IPFS_PATH: 'https://ipfs.litgateway.com/ipfs',
}

/** ========== Storage Keys ========== */
export const STORAGE_KEYS = {
    WALLET_CONNECTED : 'lit-explorer-wallet-connected',
    LANG: 'lit-explorer-i18n-lang',
    WALLET_EVENTS: 'lit-explorer-wallet-events',
}   

/** ========== LINKS ========== */
export const APP_LINKS = {
    WHAT_IS_PKP: 'https://developer.litprotocol.com/LitActionsAndPKPs/whatAreLitActionsAndPKPs',
    WORKING_WITH_LIT_ACTIONS: 'https://developer.litprotocol.com/LitActionsAndPKPs/workingWithLitActions',
    // LIT_DISCORD: 'https://discord.com/channels/896185694857343026/1002588409153458228',
    LIT_DISCORD: 'https://litgateway.com/discord',
    DOC: 'https://developer.litprotocol.com/',
}

/** ========== SUPPORTED NETWORKS ========== */
export enum SupportedNetworks{
    CELO_MAINNET = 'CELO_MAINNET'
}

export const SUPPORTED_CHAINS = {
    [SupportedNetworks.CELO_MAINNET]: {
        ABI_API: "https://api.celoscan.io/api?module=contract&action=getabi&address=",
        EXPLORER_API: "https://explorer.celo.org/api",
        params: {
            chainId: "0xa4ec",
            chainName: "Celo",
            nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
            rpcUrls: ["https://forno.celo.org"],
            blockExplorerUrls: ["https://explorer.celo.org/"],
            iconUrls: ["future"],
        }
    }
}

/** ========== APP ROUTES ========== */
export enum SupportedSearchTypes{
    ETH_ADDRESS = "ETH_ADDRESS",
    IPFS_ID = "IPFS_ID",
    PKP_TOKEN_ID = "PKP_TOKEN_ID",
    // RLI_TOKEN_ID = "RLI_TOKEN_ID",
}

export const SEARCH_ROUTES = {
    [SupportedSearchTypes.ETH_ADDRESS]:{
        getRoute: (id : string) => `/owners/${id}`
    },
    [SupportedSearchTypes.PKP_TOKEN_ID]:{
        getRoute: (id : string) => `/pkps/${id}`
    },
    [SupportedSearchTypes.IPFS_ID]:{
        getRoute: (id : string) => `/actions/${id}`
    },
    // [SupportedSearchTypes.RLI_TOKEN_ID]:{
    //     getRoute: (id : string) => `/rlis/${id}`
    // },
}

export const ROUTES = {
    HOME: '/',
    MINT_PKP: '/mint-pkp',
    CREATE_ACTION: '/create-action',
    OWNERS: '/owners',
    PKPS: '/pkps',
    ACTIONS: '/actions',
    RLIS: '/rlis',
    CONTRACTS: '/contracts',
}

// ========== Lit Action Code ==========
export const DEFAULT_LIT_ACTION = `const go = async () => {
    // this is the string "Hello World" for testing
    const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
    // this requests a signature share from the Lit Node
    // the signature share will be automatically returned in the HTTP response from the node
    const sigShare = await LitActions.signEcdsa({
      toSign,
      keyId: "1",
      sigName: "sig1",
    });
  };
  
  go();`;