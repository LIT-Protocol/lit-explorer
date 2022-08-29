import { ethers } from "ethers";
import { Signer } from 'ethers';
import { SupportedNetworks, SUPPORTED_CHAINS } from "../../app_config";

interface Web3WalletProps{
    wallet: any,
    signer: any,
    addresses: any,
    ownerAddress: any,
}

const defaultProps = {
    wallet: null, 
    signer: null, 
    addresses: null,
    ownerAddress: null,
}

const getWeb3Wallet = async () : Promise<Web3WalletProps | never> => {
    
    const web3Provider = window.ethereum;

    if( ! web3Provider ){
        alert("Please install web3 wallet like Metamask/Brave.");
        return defaultProps;
    }

    const web3ProviderRequest = {
        method: 'wallet_addEthereumChain',
        params: [SUPPORTED_CHAINS[SupportedNetworks.CELO_MAINNET].params],
    }
    
    await web3Provider.request(web3ProviderRequest)

    const wallet = new ethers.providers.Web3Provider(web3Provider);

    await wallet.send("eth_requestAccounts", []);

    const signer : Signer = wallet.getSigner();

    const addresses = await wallet.listAccounts();

    const ownerAddress = addresses[0];

    return { wallet, signer, addresses, ownerAddress };
}

export default getWeb3Wallet;