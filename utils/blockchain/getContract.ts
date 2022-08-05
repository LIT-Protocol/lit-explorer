import { CeloProvider, CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import { Contract, ContractInterface, ethers, Signer } from "ethers";
import { SupportedNetworks, SUPPORTED_CHAINS } from "../../app_config";

export interface GetContractProps{
    network: SupportedNetworks
    signer?: Signer,
    contractAddress: string
}

/**
 * 
 * Get the signer of the given network, otherwise automatically
 * generates a private key to create a signer
 * 
 * @param { string } network 
 * @returns 
 */
export const getSigner = async (network: string) : Promise<Signer> => {
    
    let signer : Signer;

    if( network == SupportedNetworks.CELO_MAINNET){

        const provider = new CeloProvider(SupportedNetworks.CELO_MAINNET);

        await provider.ready;

        const randomWallet = ethers.Wallet.createRandom().privateKey;

        signer = new CeloWallet(randomWallet, provider);

        return signer;
    }

    throw new Error(`No signer is found in network "${network}".`);

}

/**
 * 
 * @param { string } network 
 */
export const getABI = async ({network, contractAddress}: {
    network: string, 
    contractAddress: string
}) : Promise<ContractInterface> => {

    
    let ABI;
    
    if( network == SupportedNetworks.CELO_MAINNET){

        const ABI_API = SUPPORTED_CHAINS[network].ABI_API + contractAddress;

        const data = await fetch(ABI_API)
            .then((res) => res.json())
            .then((data) => data.result);

        ABI = data;

        return ABI;

    }

    throw new Error(`No ABI code is found in network "${network}".`);
    
}

/**
 * 
 * Get the ABI code of a contract by network
 * 
 * @param { GetContractProps } props
 * @return { Contract } ABI in json format
 */
export const getContract = async (props:GetContractProps) : Promise<Contract> => {

    let signer: Signer = props?.signer ?? await getSigner(props.network);

    let ABI : ContractInterface = await getABI({
        network: props.network,
        contractAddress: props.contractAddress
    });

    const contract = new ethers.Contract(props?.contractAddress, ABI, signer);
    
    return contract

}