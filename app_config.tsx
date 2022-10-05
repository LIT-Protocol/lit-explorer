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
    CELO_MAINNET = 'CELO_MAINNET',
    MUMBAI_TESTNET = 'MUMBAI_TESTNET'
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
    },
    [SupportedNetworks.MUMBAI_TESTNET]: {
        ABI_API: "https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=",
        EXPLORER_API: "https://mumbai.polygonscan.com/api",
        params: {
            chainId: "0x13881",
            chainName: "Mumbai",
            nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
            rpcUrls: ["https://rpc-mumbai.maticvigil.com/v1/96bf5fa6e03d272fbd09de48d03927b95633726c"],
            blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
            iconUrls: ["future"],
        }
    }
}

/** ========== APP ROUTES ========== */
export enum SupportedSearchTypes{
    ETH_ADDRESS = "ETH_ADDRESS",
    IPFS_ID = "IPFS_ID",
    PKP_TOKEN_ID = "PKP_TOKEN_ID"
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
    }
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
    DOCUMENTATION: '/documentation',
}

// ========== Lit Action Code ==========
export const DEFAULT_LIT_ACTION = `const go = async () => {
    // this is the string "Hello World" for testing
    const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
    // this requests a signature share from the Lit Node
    // the signature share will be automatically returned in the HTTP response from the node
    const sigShare = await LitActions.signEcdsa({
      toSign,
      publicKey: "0x03...e127",
      sigName: "sig1",
    });
  };
  
  go();`;


  /** ========== CONTRACT ADDRESSES ========== */
export const APP_CONFIG = {
    ECDSA_KEY: 2,
    IPFS_PIN_NAME: 'Lit Explorer v0.0.2',
    IPFS_PATH: 'https://ipfs.litgateway.com/ipfs',

    // --- Main contracts used in this explorer
    PKP_NFT_CONTRACT_ADDRESS: "0x738f0bbCDB6F5103A994a65D33EeF6B96e6a280F", 
    RATE_LIMIT_CONTRACT_ADDRESS: "0x40E1C6a43d92639F8421C260D57Ff3d8b215A76D",
    ROUTER_CONTRACT_ADDRESS: "0xD90493B5022E8457fAA3867d16d70559ee600940",

    // -- only for display
    ACCS_CONTRACT_ADDRESS: "0x7E60EF0F35A0E270B27054D20A03dB9Cbdfb563e",
    LIT_TOKEN_CONTRACT: "0x1A4779619712070BD8Acbfdd5409D97C0A066131",
    MULTI_SENDER_CONTRACT: "0xB4720616eabd25d9d4C0F52d49FB04C38dfAf964",
    DEPLOYER_CONTRACT: "0x50e2dac5e78B5905CB09495547452cEE64426db2",
    STAKED_NODE_CONTRACT: "0x889Db76286718dfbF4b62B6c9465B3aa9C28b3E7",

    // -- explorer address
    EXPLORER: "https://polygonscan.com/address/",
    NETWORK_NAME: SupportedNetworks.MUMBAI_TESTNET,
    NETWORK: SUPPORTED_CHAINS[SupportedNetworks.MUMBAI_TESTNET],
}