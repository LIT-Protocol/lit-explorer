import getPKPNFTContract from "./getPKPNFTContract";
// @ts-ignore
import converter from 'hex2dec';


const getTokensByAddress = async (ownerAddress: string) : Promise<Object>=> {

    const contract = await getPKPNFTContract();
    
    let tokens = [];

    for(let i = 0;; i++){

        let token;

        try{

            token = await contract.tokenOfOwnerByIndex(ownerAddress, i);

            token = converter.hexToDec(token.toHexString()); 

            tokens.push(token);
        
        }catch(e){
            console.log(`End of loop: ${i}`)
            break;
        }
    }

    return tokens;
}

export default getTokensByAddress;