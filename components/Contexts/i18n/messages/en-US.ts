import { LOCALES } from '../locales';

export default {
    [LOCALES.ENGLISH]:{
        'read more' : '(...read more)',
        'what is pkp - title' : `What is a PKP?`,
        'what is pkp' : `A PKP is a decentralized programmable key pair. Use this page to mint a PKP NFT that lets you control which Lit Actions can sign using that key.`,
        'Mint New PKP' : 'Mint New PKP',
        'Create Action': 'Create Action',
        'Pages': 'PAGES',
        'Owners': 'Owners',
        'PKPs': 'PKPS',
        'Actions': 'Actions',
        'Contracts': 'Contracts',
        'what are lit actions - title': 'What are Lit Actions?',
        'what are lit actions': `Lit Actions are Javascript functions that can utilize the threshold cryptography that powers the Lit Protocol. You can write some JS code, upload it to IPFS, and ask the Lit Nodes to execute that code and return the result.`,
        'owners page - title': 'Definition of a PKP NFT owner',
        'owners page': 'A PKP NFT owner can grant the ability to use the PKP to sign and decrypt data to both other users (via their wallet address) and also to Lit Actions.',
        'pkps page - title': 'Multiple PKP identifiers',
        'pkps page': 'Since a PKP is a valid ECDSA wallet, you could send a mix of BTC and ETH NFTs to it, and then sell it as a bundle by selling the NFT that controls it on OpenSea. The buyer gets the ability to sign and decrypt data with the PKP, since they own the controlling NFT. The buyer could then withdraw the BTC and NFTs if desired.',
        'actions page - title': 'Where are Lit Actions stored?',
        'actions page': 'Lit Actions are stored on IPFS and are immutable, like smart contracts. You can think of them as Javascript smart contracts that have network access and can make HTTP requests.',
    }
}