import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { Contract, ContractInterface, ethers, Signer } from "ethers";
// import { ABIsFallback } from "../../../ABIsFallback";
import { APP_CONFIG, SupportedNetworks, SUPPORTED_CHAINS } from "../../../app_config";
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
    
    console.log("[getSigner] network:", network);

    let signer : Signer;

    // -- (CELO MAINNET)
    if( network == SupportedNetworks.CELO_MAINNET){

        const rpc = APP_CONFIG.NETWORK.params.rpcUrls[0];

        const provider = new CeloProvider(rpc);

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
    contractAddress?: string
}) : Promise<ContractInterface> => {

    let ABI;
    
    const selectedNetwork = APP_CONFIG.NETWORK;

    // -- (CELO MAINNET)
    // if( network == SupportedNetworks.CELO_MAINNET){
    try{
        const ABI_API = selectedNetwork.ABI_API + contractAddress;

        const data = await fetch(ABI_API)
        .then((res) => res.json())
        .then((data) => data.result);

        ABI = data;
        
        // -- using fallback
        // if( data.includes('Max rate limit reached')){
        //     console.warn("Using fallback for contract:", contractAddress);
        //     let found : any = Object.entries(ABIsFallback).find((item) => item[0].toLowerCase() == contractAddress.toLocaleLowerCase());
            
        //     ABI = JSON.parse(found[1]);
        // }

        return ABI;
    }catch(e){
        throw new Error(`No ABI code is found in network "${network}".`);
    }

    // }

    // -- (otherwise)
    
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
    contractAddress?: string
}) : Promise<Contract | undefined> => {

    let signer: Signer = props?.signer ?? await getSigner(props.network);
    
    let ABI : ContractInterface | never;

    const _contractAddress = props.contractAddress ?? '';

    if( _contractAddress === ''){
        console.error("Contract address cannot be empty");
        return;
    }

    if (typeof window === 'undefined'){
        ABI = await getABI({
            network: props.network,
            contractAddress: props.contractAddress
        });
    }else{

        if( ! localStorage.getItem(_contractAddress)){
            ABI = await getABI({
                network: props.network,
                contractAddress: _contractAddress
            });
    
            localStorage.setItem(_contractAddress, JSON.stringify(ABI))
        }else{
            const data = localStorage.getItem(_contractAddress);
            const parsed = JSON.parse(data ?? '');
            ABI = parsed as ContractInterface;
        }
    }



    const contract = new ethers.Contract(_contractAddress, ABI, signer);
    
    return contract

}