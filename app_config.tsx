// import json
import deployedContracts from "./ABIs/deployed-contracts.json";
import PKPHelper from "./ABIs/PKPHelper.json";
import PKPNFT from "./ABIs/PKPNFT.json";
import PKPPermissions from "./ABIs/PKPPermissions.json";
import PubkeyRouter from "./ABIs/PubkeyRouter.json";
import RateLimitNFT from "./ABIs/RateLimitNFT.json";
// import { Network } from "alchemy-sdk";

/** ========== Storage Keys ========== */
export const STORAGE_KEYS = {
	// WALLET_CONNECTED: "lit-explorer-wallet-connected",
	LANG: "lit-explorer-i18n-lang",
	// WALLET_EVENTS: "lit-explorer-wallet-events",
	// LOGGED: "lit-logged",
};

/** ========== LINKS ========== */
export const APP_LINKS = {
	WHAT_IS_PKP: "https://developer.litprotocol.com/v3/sdk/wallets/intro",
	WHAT_IS_RLI:
		"https://developer.litprotocol.com/v3/resources/glossary#rate-limiting",
	WORKING_WITH_LIT_ACTIONS:
		"https://developer.litprotocol.com/v3/sdk/serverless-signing/overview",
	LIT_DISCORD: "https://litgateway.com/discord",
	DOC: "https://developer.litprotocol.com",
};

/** ========== CURRENT NETWORK ========== */
export const CURRENT_NETWORK = "LIT_PROTOCOL";

export const LitChain = {
	chronicle: {
		params: {
			id: 175177,
			chainId: "0x2AC49",
			chainName: "Chronicle - Lit Protocol Testnet",
			network: "chronicle",
			nativeCurrency: {
				name: "LIT",
				symbol: "LIT",
				decimals: 18,
			},
			rpcUrls: ["https://chain-rpc.litprotocol.com/http"],
			blockExplorerUrls: [
				{
					name: "lit-protocol Explorer",
					url: "https://chain.litprotocol.com",
				},
			],
		},
		api: "https://chain.litprotocol.com/api",
	},
	datilDev: {
		params: {
			id: 2311,
			chainId: "0x907",
			chainName: "Datil Devnet - Lit Protocol",
			network: "datil-dev",
			nativeCurrency: {
				name: "tstLPX",
				symbol: "tstLPX",
				decimals: 18,
			},
			rpcUrls: ["https://vesuvius-rpc.litprotocol.com"],
			blockExplorerUrls: [
				{
					name: "Datil Devnet Explorer",
					url: "https://vesuvius-explorer.litprotocol.com",
				},
			],
		},
		api: "https://vesuvius-explorer.litprotocol.com/api/v2/",
	},
};

export enum SupportedNetworks {
	LIT_PROTOCOL = "LIT_PROTOCOL",
}

/** ========== APP ROUTES ========== */
export enum SupportedSearchTypes {
	ETH_ADDRESS = "ETH_ADDRESS",
	IPFS_ID = "IPFS_ID",
	PKP_TOKEN_ID = "PKP_TOKEN_ID",
}

export const SEARCH_ROUTES = {
	[SupportedSearchTypes.ETH_ADDRESS]: {
		getRoute: (id: string) => `/owners/${id}`,
	},
	[SupportedSearchTypes.PKP_TOKEN_ID]: {
		getRoute: (id: string) => `/pkps/${id}`,
	},
	[SupportedSearchTypes.IPFS_ID]: {
		getRoute: (id: string) => `/actions/${id}`,
	},
};

export const ROUTES = {
	HOME: "/",
	PROFILE: "/profile",
	MINT_PKP: "/mint-pkp",
	CREATE_ACTION: "/create-action",
	GET_CREDITS: "/get-credits",
	OWNERS: "/owners",
	PKPS: "/pkps",
	ACTIONS: "/actions",
	RLIS: "/rlis",
	CONTRACTS: "/contracts",
	DOCUMENTATION: "/documentation",
};

// ========== Lit Action Code ==========
export const DEFAULT_LIT_ACTION = `const go = async () => {
    // this is the string "Hello World" for testing
    const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
    // this requests a signature share from the Lit Node
    // the signature share will be automatically returned in the HTTP response from the node
    const sigShare = await LitActions.signEcdsa({
      toSign,
      publicKey, // <-- You should pass this in jsParam
      sigName: "sig1",
    });
  };
  
  go();`;

/** ========== CHANGE THIS INFORMATION FOR YOUR NETWORK! ========== */
interface ContractConfig {
	ADDRESS: string;
	ABI?: any;
}

export interface AppConfig {
	EXPLORER: string;
	NETWORK_NAME: string;
	NETWORK: typeof LitChain.datilDev | typeof LitChain.chronicle;
	NETWORK_LABEL: {
		ENABLED: boolean;
		NAME: string;
	};
	API_URL: string;
	ECDSA_KEY: number;
	IPFS_PIN_NAME: string;
	IPFS_PATH: string;
	PKP_NFT_CONTRACT: ContractConfig;
	RATE_LIMIT_CONTRACT: ContractConfig;
	ROUTER_CONTRACT: ContractConfig;
	PKP_HELPER_CONTRACT: ContractConfig;
	PKP_PERMISSIONS_CONTRACT: ContractConfig;
	ACCS_CONTRACT: {
		ADDRESS: string;
	};
	LIT_TOKEN_CONTRACT: {
		ADDRESS: string;
	};
	MULTI_SENDER_CONTRACT: {
		ADDRESS: string;
	};
	DEPLOYER_CONTRACT: {
		ADDRESS: string;
	};
	STAKED_NODE_CONTRACT: {
		ADDRESS: string;
	};
}

export const VESUVIUS_APP_CONFIG = {
	// -- explorer address
	EXPLORER: LitChain.datilDev.params.blockExplorerUrls[0].url,
	NETWORK_NAME: CURRENT_NETWORK,
	NETWORK: LitChain.datilDev,
	NETWORK_LABEL: {
		ENABLED: false,
		NAME: LitChain.datilDev.params.chainName,
	},
	API_URL: LitChain.datilDev.api,
	ECDSA_KEY: 2,
	IPFS_PIN_NAME: "Lit Explorer DatilDev",
	IPFS_PATH: "https://lit.mypinata.cloud/ipfs",

	// --- Main contracts used in this explorer
	PKP_NFT_CONTRACT: {
		ADDRESS: deployedContracts.pkpNftContractAddress,
		ABI: PKPNFT.abi,
	},
	RATE_LIMIT_CONTRACT: {
		ADDRESS: deployedContracts.rateLimitNftContractAddress,
		ABI: RateLimitNFT.abi,
	},
	ROUTER_CONTRACT: {
		ADDRESS: deployedContracts.pubkeyRouterContractAddress,
		ABI: PubkeyRouter.abi,
	},

	PKP_HELPER_CONTRACT: {
		ADDRESS: deployedContracts.pkpHelperContractAddress,
		ABI: PKPHelper.abi,
	},
	PKP_PERMISSIONS_CONTRACT: {
		ADDRESS: deployedContracts.pkpPermissionsContractAddress,
		ABI: PKPPermissions.abi,
	},

	// -- (NOT IMPORTANT) Only for display
	ACCS_CONTRACT: {
		ADDRESS: deployedContracts.accessControlConditionsContractAddress,
	},
	LIT_TOKEN_CONTRACT: {
		ADDRESS: deployedContracts.litTokenContractAddress,
	},
	MULTI_SENDER_CONTRACT: {
		ADDRESS: deployedContracts.multisenderContractAddress,
	},
	DEPLOYER_CONTRACT: {
		ADDRESS: "0x50e2dac5e78B5905CB09495547452cEE64426db2",
	},
	STAKED_NODE_CONTRACT: {
		ADDRESS: deployedContracts.stakingContractAddress,
	},
};

export const CHRONICLE_APP_CONFIG = {
	// -- explorer address
	EXPLORER: LitChain.chronicle.params.blockExplorerUrls[0].url,
	NETWORK_NAME: CURRENT_NETWORK,
	NETWORK: LitChain.chronicle,
	NETWORK_LABEL: {
		ENABLED: false,
		NAME: LitChain.chronicle.params.chainName,
	},
	API_URL: LitChain.chronicle.api,
	ECDSA_KEY: 2,
	IPFS_PIN_NAME: "Lit Explorer v0.1.0",
	IPFS_PATH: "https://lit.mypinata.cloud/ipfs",

	// --- Main contracts used in this explorer
	PKP_NFT_CONTRACT: {
		ADDRESS: deployedContracts.pkpNftContractAddress,
		ABI: PKPNFT.abi,
	},
	RATE_LIMIT_CONTRACT: {
		ADDRESS: deployedContracts.rateLimitNftContractAddress,
		ABI: RateLimitNFT.abi,
	},
	ROUTER_CONTRACT: {
		ADDRESS: deployedContracts.pubkeyRouterContractAddress,
		ABI: PubkeyRouter.abi,
	},

	PKP_HELPER_CONTRACT: {
		ADDRESS: deployedContracts.pkpHelperContractAddress,
		ABI: PKPHelper.abi,
	},
	PKP_PERMISSIONS_CONTRACT: {
		ADDRESS: deployedContracts.pkpPermissionsContractAddress,
		ABI: PKPPermissions.abi,
	},

	// -- (NOT IMPORTANT) Only for display
	ACCS_CONTRACT: {
		ADDRESS: deployedContracts.accessControlConditionsContractAddress,
	},
	LIT_TOKEN_CONTRACT: {
		ADDRESS: deployedContracts.litTokenContractAddress,
	},
	MULTI_SENDER_CONTRACT: {
		ADDRESS: deployedContracts.multisenderContractAddress,
	},
	DEPLOYER_CONTRACT: {
		ADDRESS: "0x50e2dac5e78B5905CB09495547452cEE64426db2",
	},
	STAKED_NODE_CONTRACT: {
		ADDRESS: deployedContracts.stakingContractAddress,
	},
};
