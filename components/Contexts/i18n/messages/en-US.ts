import { LOCALES } from "../locales";

export default {
	[LOCALES.ENGLISH]: {
		"read more": "(...read more)",
		"what is pkp - title": `What is a Programmable Key Pair (PKP)?`,
		"what is pkp": `A PKP is a public and private keypair that can be associated with one or many smart contracts. PKPs let developers create applications where user controlled keys can sign in the decentralized cloud. Use this page to mint a PKP NFT that lets you control which Lit Actions can sign using that key `,
		"PKP & Lit Action": "PKP & Lit Action",
		"Mint New PKP": "Mint New PKP",
		"Buy Capacity Credits": "Buy Capacity Credits",
		Profile: "Profile",
		"profile page - title": "Personal Dashboard",
		"profile page - p1":
			"Here's where you can view your own PKPs and Capacity Credits.",
		"Create Action": "Create Action",
		Pages: "Lit Actions",
		Owners: "PKP Owners",
		PKPs: "PKPS",
		Actions: "Published Lit Actions",
		Contracts: "Contracts",
		Documentation: "Documentation",
		RLIs: "RLIs",
		Other: "Resources",
		"what are lit actions - title": "What are Lit Actions?",
		"what are lit actions": `Lit Actions are Javascript functions that can utilize the threshold cryptography that powers the Lit Protocol. Lit Actions are written in JavaScript, uploaded to IPFS, and the Lit Nodes execute that code and return the result `,
		"owners page - title": "Definition of a PKP NFT owner",
		"owners page":
			"A PKP NFT owner can grant the ability to use the PKP to sign and decrypt data to both other users (via their wallet address) and also to Lit Actions.",
		"pkps page - title": "Multiple PKP identifiers",
		"pkps page":
			"A PKP is a valid ECDSA wallet, so you could send a mix of BTC and ETH NFTs to it, and then sell it as a bundle by selling the NFT that controls it on OpenSea. The buyer gets the ability to sign and decrypt data with the PKP, since they own the controlling NFT. The buyer could then withdraw the BTC and NFTs if desired.",
		"actions page - title": "Where are Lit Actions stored?",
		"actions page":
			"Lit Actions are stored on IPFS and, like smart contracts, are immutable. You can think of them as Javascript smart contracts that have network access and can make HTTP requests.",
		"rlis page - title": "What is a Capacity Credits NFT?",
		"rlis page":
			'By default, each Lit Action execution comes with a "free plan" that allows you to execute a limited number of requests per second on the Lit nodes. To lift this limitation, you can "upgrade" your plan by purchasing an Capacity Credits NFT that comes with "flexible terms" which can be customized by 2 factors, the number of requests per second and the expiry date.',
		"all rlis - title":
			"Latest Capacity Credits NFTs minted by other users",
		"all rlis - error": "No Capacity Credits NFTs found.",
		"all rlis - loading": "Loading Capacity Credits NFTs...",
		"mint rli - title": "Mint a Capacity Credits NFT",
		"mint rli - button": "Buy Capacity Credits",
		"authorised action - title": "Authorized Lit Actions stored on IPFS:",
		"authorised action - loading":
			"Loading Authorized Actions stored on IPFS...",
		"authorised action - error": "Cannot find authorized actions.",
		"action page - title": "How do Lit Actions and PKPs work together?",
		"action page":
			"A user may generate a new PKP, and may grant a Lit Action the right to sign using it. This means that Lit actions are kind of like smart contracts with a secret key they can use to sign or decrypt things.",
	},
};
