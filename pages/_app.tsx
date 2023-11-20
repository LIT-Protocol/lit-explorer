import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ReactNode } from "react";
import { NextPage } from "next";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";
import { AppContextProvider } from "../components/Contexts/AppContext";
import { I18Provider, LOCALES } from "../components/Contexts/i18n";
import { Analytics } from "@vercel/analytics/react";

import { WagmiConfig, createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { APP_CONFIG } from "../app_config";

NProgress.configure({
	minimum: 0.3,
	easing: "ease",
	speed: 800,
	showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export type NextPageWithLayout<P = {}> = NextPage<P> & {
	getLayout?: (page: ReactNode) => ReactNode;
};

export type Props = AppProps & {
	Component: NextPageWithLayout;
};

// Set up wagmi config with custom network
const { chains, provider, webSocketProvider } = configureChains(
	[
		{
			id: APP_CONFIG.NETWORK.params.id,
			name: APP_CONFIG.NETWORK.params.chainName,
			network: APP_CONFIG.NETWORK.params.network,
			nativeCurrency: {
				decimals: APP_CONFIG.NETWORK.params.nativeCurrency.decimals,
				name: APP_CONFIG.NETWORK.params.nativeCurrency.name,
				symbol: APP_CONFIG.NETWORK.params.nativeCurrency.symbol,
			},
			rpcUrls: {
				public: {
					http: [APP_CONFIG.NETWORK.params.rpcUrls[0]],
				},
				default: {
					http: [APP_CONFIG.NETWORK.params.rpcUrls[0]],
				},
			},
			blockExplorers: {
				default: APP_CONFIG.NETWORK.params.blockExplorerUrls[0],
			},
		},
	],
	[publicProvider()]
);

// Set up wagmi client
const client = createClient({
	autoConnect: true,
	connectors: [
		new MetaMaskConnector({ chains }),
		new CoinbaseWalletConnector({
			chains,
			options: {
				appName: "wagmi",
			},
		}),
		new InjectedConnector({
			chains,
			options: {
				name: "Injected",
				shimDisconnect: true,
			},
		}),
	],
	provider,
	webSocketProvider,
});

function MyApp({ Component, pageProps }: Props) {
	// get layout from component or use default
	const getLayout = Component.getLayout || ((page: any) => page);

	return getLayout(
		<WagmiConfig client={client}>
			<AppContextProvider>
				<Component {...pageProps} />
				<Analytics />
			</AppContextProvider>
		</WagmiConfig>
	);
}

export default MyApp;
