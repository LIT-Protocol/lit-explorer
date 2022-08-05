import { ethers } from "ethers";
import { Signer } from 'ethers';
import { SupportedNetworks, SUPPORTED_CHAINS } from "../../app_config";

interface Web3WalletProps{
    wallet: any,
    signer: any,
    addresses: any,
}

const getWeb3Wallet = async () : Promise<Web3WalletProps> => {
    const web3Provider = window.ethereum;

    if( ! web3Provider ){
        alert("Please connect to a web3 wallet like Metamask.");
        return {wallet: null, signer: null, addresses: null};
    }

    await web3Provider.request({
        method: 'wallet_addEthereumChain',
        params: [SUPPORTED_CHAINS[SupportedNetworks.CELO_MAINNET].params]
    })

    const wallet = new ethers.providers.Web3Provider(web3Provider);

    await wallet.send("eth_requestAccounts", []);

    const signer : Signer = wallet.getSigner();

    const addresses = await wallet.listAccounts();

    return { wallet, signer, addresses };
}

export default getWeb3Wallet;