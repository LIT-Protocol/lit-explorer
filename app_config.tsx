// import json
import * as deployedContracts from './ABIs/deployed-contracts.json';

export const DEPLOYED_CONTRACTS = deployedContracts;

/** ========== Storage Keys ========== */
export const STORAGE_KEYS = {
    WALLET_CONNECTED : 'lit-explorer-wallet-connected',
    LANG: 'lit-explorer-i18n-lang',
    WALLET_EVENTS: 'lit-explorer-wallet-events',
    LOGGED: 'lit-logged',
}   

/** ========== LINKS ========== */
export const APP_LINKS = {
    WHAT_IS_PKP: 'https://developer.litprotocol.com/LitActionsAndPKPs/whatAreLitActionsAndPKPs',
    WORKING_WITH_LIT_ACTIONS: 'https://developer.litprotocol.com/LitActionsAndPKPs/workingWithLitActions',
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
    PROFILE: '/profile',
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
const APP_CONFIGS = {
    CELO: {
        SITE: 'CELO',
        ECDSA_KEY: 2,
        IPFS_PIN_NAME: 'Lit Explorer v0.0.2',
        IPFS_PATH: 'https://ipfs.litgateway.com/ipfs',
    
        // --- Main contracts used in this explorer
        PKP_NFT_CONTRACT_ADDRESS: "0x594E1dA675e2a17866B7E3D80c96Cb396f2A4ccD", 
        RATE_LIMIT_CONTRACT_ADDRESS: "0xbd757dD9Bfba4Ac6df1E7e66B9C40486f4681f9B",
        ROUTER_CONTRACT_ADDRESS: "0x9a640Cae460A869b964ecAe7417cc30377E80968",
    
        // -- only for display
        ACCS_CONTRACT_ADDRESS: "0x156a99e169aAcaB8Cf5eA87D034664156Af4F0E6",
        LIT_TOKEN_CONTRACT_ADDRESS: "0x8515B6c4Ce073CDEA3BB0C07DBA2B4413c11F97b",
        MULTI_SENDER_CONTRACT_ADDRESS: "0xe9e9613881F95987559ab943c539f256E582F839",
        DEPLOYER_CONTRACT_ADDRESS: "0x50e2dac5e78B5905CB09495547452cEE64426db2",
        STAKED_NODE_CONTRACT_ADDRESS: "0xdbd360F30097fB6d938dcc8B7b62854B36160B45",
    
        // -- explorer address
        EXPLORER: "https://polygonscan.com/address/",
        NETWORK_NAME: SupportedNetworks.CELO_MAINNET,
        NETWORK: SUPPORTED_CHAINS[SupportedNetworks.CELO_MAINNET],
    },
    MUMBAI: {
        NETWORK_LABEL: {
            ENABLED: true,
            NAME: 'MUMBAI TESTNET',
        },
        ECDSA_KEY: 2,
        IPFS_PIN_NAME: 'Lit Explorer v0.0.2',
        IPFS_PATH: 'https://ipfs.litgateway.com/ipfs',
    
        // --- Main contracts used in this explorer
        PKP_NFT_CONTRACT_ADDRESS: DEPLOYED_CONTRACTS.pkpNftContractAddress, 
        RATE_LIMIT_CONTRACT_ADDRESS: DEPLOYED_CONTRACTS.rateLimitNftContractAddress,
        ROUTER_CONTRACT_ADDRESS: DEPLOYED_CONTRACTS.pubkeyRouterContractAddress,

        // -- (NEW) to be added to the explorer
        PKP_HELPER_CONTRACT_ADDRESS: DEPLOYED_CONTRACTS.pkpHelperContractAddress,
        PKP_PERMISSIONS_CONTRACT_ADDRESS: DEPLOYED_CONTRACTS.pkpPermissionsContractAddress,
    
        // -- only for display
        ACCS_CONTRACT_ADDRESS: DEPLOYED_CONTRACTS.accessControlConditionsContractAddress,
        LIT_TOKEN_CONTRACT_ADDRESS: DEPLOYED_CONTRACTS.litTokenContractAddress,
        MULTI_SENDER_CONTRACT_ADDRESS: DEPLOYED_CONTRACTS.multisenderContractAddress,
        DEPLOYER_CONTRACT_ADDRESS: "(??)0x50e2dac5e78B5905CB09495547452cEE64426db2",
        STAKED_NODE_CONTRACT_ADDRESS: DEPLOYED_CONTRACTS.stakingContractAddress,
    
        // -- explorer address
        EXPLORER: "https://polygonscan.com/address/",
        NETWORK_NAME: SupportedNetworks.CELO_MAINNET,
        NETWORK: SUPPORTED_CHAINS[SupportedNetworks.CELO_MAINNET],
    },
}

export const APP_CONFIG = {
    ...APP_CONFIGS.MUMBAI,
}