export const APP_CONFIG = {
    PKP_NFT_CONTRACT_ADDRESS: "0x0008a7b1ce657e78b4edc6fc40078ce8bf08329a", 
    RATE_LIMIT_CONTRACT_ADDRESS: "0x5f8c001Edb1Af78504E624BE3A0836C2659c02Dd",
}

export enum SupportedNetworks{
    CELO_MAINNET = 'CELO_MAINNET'
}

export const SUPPORTED_CHAINS = {
    [SupportedNetworks.CELO_MAINNET]: {
        RPC: 'https://forno.celo.org',
        ABI_API: "https://api.celoscan.io/api?module=contract&action=getabi&address=",
    }
}