/** ========== CONTRACT ADDRESSES ========== */
export const APP_CONFIG = {
    PKP_NFT_CONTRACT_ADDRESS: "0xA05374858Af30dbD7edc5a1239cCC79DF95834ad", 
    RATE_LIMIT_CONTRACT_ADDRESS: "0x7FdcF78D2961186a2015Da41104F241531be299f",
    ROUTER_CONTRACT_ADDRESS: "0x9a640Cae460A869b964ecAe7417cc30377E80968",
    ECDSA_KEY: 2,
    IPFS_PIN_NAME: 'Lit Explorer v0.0.1',
    IPFS_PATH: 'https://ipfs.litgateway.com/ipfs',
    LIT_DISCORD: 'https://discord.com/channels/896185694857343026/1002588409153458228'
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
// TODO: Refactor Routes

export enum SupportedSearchTypes{
    ETH_ADDRESS = "ETH_ADDRESS",
    IPFS_ID = "IPFS_ID",
    PKP_TOKEN_ID = "PKP_TOKEN_ID"
}

export const ROUTES = {
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