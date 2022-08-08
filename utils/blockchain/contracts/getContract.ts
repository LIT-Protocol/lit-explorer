import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { Contract, ContractInterface, ethers, Signer } from "ethers";
import { SupportedNetworks, SUPPORTED_CHAINS } from "../../../app_config";
import { cacheFetch } from "../../cacheFetch";

/**
 * 
 * Get the signer of the given network, otherwise automatically
 * generates a private key to create a signer
 * 
 * @param { SupportedNetworks } network 
 * @return { Signer }
 */
export const getSigner = async (network: SupportedNetworks) : Promise<Signer> => {
    
    let signer : Signer;

    // -- (CELO MAINNET)
    if( network == SupportedNetworks.CELO_MAINNET){

        const provider = new CeloProvider(SupportedNetworks.CELO_MAINNET);

        await provider.ready;

        const randomWallet = ethers.Wallet.createRandom().privateKey;

        signer = new CeloWallet(randomWallet, provider);

        return signer;
    }

    // -- (otherwise)
    throw new Error(`No signer is found in network "${network}".`);

}

/**
 * 
 * Get the ABI code from the given API and contract address
 * 
 * @property { SupportedNetworks } network
 * @property { string } contractAddress 
 * 
 * @return { Promise<ContractInterface } ABI
 */
export const getABI = async ({network, contractAddress}: {
    network: SupportedNetworks, 
    contractAddress: string
}) : Promise<ContractInterface> => {

    let ABI;
    
    // -- (CELO MAINNET)
    if( network == SupportedNetworks.CELO_MAINNET){

        const ABI_API = SUPPORTED_CHAINS[network].ABI_API + contractAddress;

        const data = await fetch(ABI_API)
            .then((res) => res.json())
            .then((data) => data.result);

        ABI = data;

        return ABI;

    }

    // -- (otherwise)
    throw new Error(`No ABI code is found in network "${network}".`);
    
}

/**
 * 
 * Get the ABI code of a contract by network
 * 
 * @property { SupportedNetworks } network
 * @property { Signer } signer
 * @property { string } contractAddress
 * 
 * @return { Contract } ABI in json format
 */
export const getContract = async (props: {
    network: SupportedNetworks
    signer?: Signer,
    contractAddress: string
}) : Promise<Contract> => {

    let signer: Signer = props?.signer ?? await getSigner(props.network);

    let ABI : ContractInterface | never;

    if( ! localStorage.getItem(props.contractAddress)){
        ABI = await getABI({
            network: props.network,
            contractAddress: props.contractAddress
        });

        localStorage.setItem(props.contractAddress, JSON.stringify(ABI))
    }else{
        const data = localStorage.getItem(props.contractAddress);
        const parsed = JSON.parse(data ?? '');
        ABI = parsed as ContractInterface;
    }

    const contract = new ethers.Contract(props?.contractAddress, ABI, signer);
    
    return contract

}