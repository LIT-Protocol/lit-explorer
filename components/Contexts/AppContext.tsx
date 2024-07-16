import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

// @ts-ignore
import converter from "hex2dec";
import { pub2Addr, wei2eth } from "../../utils/converter";
import {
	Button,
	CircularProgress,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import {
	VESUVIUS_APP_CONFIG,
	CHRONICLE_APP_CONFIG,
	APP_LINKS,
	DEFAULT_LIT_ACTION,
	ROUTES,
	SEARCH_ROUTES,
	STORAGE_KEYS,
	SupportedNetworks,
	SupportedSearchTypes,
	AppConfig,
} from "../../app_config";
import throwError from "../../utils/throwError";
import NavPath from "../UI/NavPath";
import SearchBar from "../Forms/SearchBar";
import router from "next/router";
import { AppRouter } from "../../utils/AppRouter";
import { LitContracts } from "@lit-protocol/contracts-sdk";

import {
	useAccount,
	useConnect,
	useDisconnect,
	Connector,
	ConnectorData,
} from "wagmi";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";

declare global {
	interface Window {
		dec2hex?(pkpId: string): void;
		hex2dec?(pkpId: string): void;
		wei2eth?(v: number): void;
		pub2addr?(v: any): void;
		config: any;
		login: any;
		logout: any;
		listCommands: any;
	}
}

type LitNetwork = "datil-test" | "datil-dev" | "habanero" | "manzano" | "cayenne";

enum LIT_NETWORKS {
	DATIL_TEST = "datil-test",
	DATIL_DEV = "datil-dev",
	HABANERO = "habanero",
	MANZANO = "manzano",
	CAYENNE = "cayenne",
}

interface SharedStates {
	contractsSdk: LitContracts;
	network: LitNetwork;
	onNetworkChange: (network: LitNetwork) => void;
	logout?: () => Promise<void>;
	appConfig: AppConfig;
}

let defaultSharedStates: SharedStates = {
	contractsSdk: {} as LitContracts,
	network: LIT_NETWORKS.DATIL_DEV,
	onNetworkChange: (network: LitNetwork) => {},
	appConfig: VESUVIUS_APP_CONFIG,
};

const AppContext = createContext(defaultSharedStates);

export const AppContextProvider = ({ children }: { children: any }) => {
	// -- (shared states)
	// const [pkpContract, setPkpContract] = useState<PKPContract>();
	// const [pkpPermissionsContract, setPkpPermissionsContract] =
	// 	useState<PKPPermissionsContract>();
	// const [pkpHelperContract, setPkpHelperContract] =
	// 	useState<PKPHelperContract>();
	// const [routerContract, setRouterContract] = useState<RouterContract>();
	// const [rliContract, setRliContract] = useState<RLIContract>();
	const [contractsSdk, setContractsSdk] = useState<LitContracts>();
	const [network, setNetwork] = useState<LitNetwork>(LIT_NETWORKS.DATIL_DEV);

	// -- (state)
	const [web3Installed, setWeb3Installed] = useState<boolean>(false);
	const [contractsLoaded, setContractsLoaded] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [appConfig, setAppConfig] = useState<AppConfig>(VESUVIUS_APP_CONFIG);

	// -- (wagmi)
	const { connectors, connect, error } = useConnect();
	const {
		address,
		connector: activeConnector,
		isConnecting,
		isConnected,
	} = useAccount();
	const { disconnectAsync } = useDisconnect();

	const injectGlobalFunctions = () => {
		// console.warn("...injectGlobalFunctions");

		window.dec2hex = converter.decToHex;
		window.hex2dec = converter.hexToDec;
		window.wei2eth = wei2eth;
		window.pub2addr = pub2Addr;
		// window.login = onLogin;
		window.logout = onLogout;
		window.config = {
			APP_CONFIG: appConfig,
			STORAGE_KEYS,
			APP_LINKS,
			SupportedNetworks,

			SupportedSearchTypes,
			SEARCH_ROUTES,
			ROUTES,
			DEFAULT_LIT_ACTION,
		};
	};

	// -- Initialize contracts
	const connectContracts = async (network: LitNetwork) => {
		setLoading(true);

		if (activeConnector) {
			const signer = await activeConnector!.getSigner();

			const contractsSDK = new LitContracts({
				signer,
				network: network,
				debug: true,
			});

			await contractsSDK.connect();

			console.log(
				`[connectContracts] contractsSDK.network! ${contractsSDK.network}`
			);

			setContractsSdk(contractsSDK);
			setContractsLoaded(true);
		}

		setLoading(false);
	};

	useEffect(() => {
		/**
		 * Export bunch of functions so you can test on the browser
		 */
		injectGlobalFunctions();

		(async () => {
			setLoading(true);

			// -- If wallet is installed
			setWeb3Installed(typeof window?.ethereum !== "undefined");

			// -- If wallet is connected but contracts are not loaded
			if (isConnected && !contractsLoaded) {
				connectContracts(network);
			}

			setLoading(false);
		})();
	}, [isConnected]);

	// -- Listen to account or chain changes
	useEffect(() => {
		const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
			if (account) {
				connectContracts(network);
			} else if (chain) {
				if (chain.unsupported) {
					console.warn(
						`Switched to unsupported chain ${chain.id}... Logging out`
					);
					onLogout();
				}
			}
		};

		if (activeConnector) {
			activeConnector.on("change", handleConnectorUpdate);
			if (!contractsLoaded) connectContracts(network);
		}

		return () => {
			activeConnector?.off("change", handleConnectorUpdate);
		};
	}, [activeConnector, contractsLoaded]);

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
		const text = (document.getElementById("search-bar") as HTMLInputElement)
			.value;

		// -- validate
		if (keyboardKey && keyboardKey !== "Enter") return;
		if (text.length <= MIN_LENGTH) {
			throwError(
				`Search length cannot be less than ${MIN_LENGTH} characters`
			);
		}

		// -- prepare
		const id = text;

		router.push(AppRouter.getPage(id));
	};

	const onNetworkChange = async (network: LitNetwork) => {
		console.log(`Swithing to network: ${network}...`);

		setNetwork(network);
		setAppConfig(
			(network === "datil-dev" || network === "datil-test") ? VESUVIUS_APP_CONFIG : CHRONICLE_APP_CONFIG
		);

		getWeb3Wallet(network);

		await connectContracts(network);
	};

	// -- (event) logout of web 3
	const onLogout = async () => {
		setLoading(true);

		await disconnectAsync();
		setContractsLoaded(false);

		setLoading(false);
	};

	// -- (render) web3 not logged
	const renderNotLogged = () => {
		return (
			<div className="flex login">
				<div className="text-center m-auto">
					<Typography variant="h4">
						Welcome to Lit Explorer! 👋🏻
					</Typography>
					<p className="paragraph">
						Please sign-in to your web3 account and start the
						adventure.
					</p>
					<p className="paragraph">
						To learn more about Programmable Key Pairs (PKPs) and
						Lit Actions, read our{" "}
						<a href="https://developer.litprotocol.com">
							documentation
						</a>
						.
					</p>
					{web3Installed ? (
						<Container maxWidth="xs" sx={{ mt: 2 }}>
							<Stack spacing={1}>
								{connectors.map((connector) => (
									<Button
										className="btn-2"
										disabled={!connector.ready}
										key={connector.id}
										onClick={() =>
											connect({
												connector,
												chainId:
													appConfig.NETWORK.params.id,
											})
										}
										sx={{
											textTransform: "none",
										}}
									>
										{connector.name === "Injected"
											? "Other wallets"
											: connector.name}
									</Button>
								))}
							</Stack>
						</Container>
					) : (
						<p className="paragraph">
							To get started, kindly install a web3 wallet browser
							extension like MetaMask or Coinbase Wallet.
						</p>
					)}
				</div>
			</div>
		);
	};

	if (loading || isConnecting)
		return (
			<div className="w-full h-full flex">
				<CircularProgress className="flex-content flex-content-x" />
			</div>
		);

	if (!isConnected || !contractsLoaded) return renderNotLogged();

	// -- share states for children components
	let sharedStates = {
		contractsSdk: contractsSdk ?? ({} as LitContracts),
		network: network,
		onNetworkChange: onNetworkChange,
		logout: onLogout,
		appConfig,
	};

	return (
		<AppContext.Provider value={sharedStates}>
			<SearchBar onSearch={onSearch} />
			<div id="main-dynamic-content">
				<NavPath />
				{children}
			</div>
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};
