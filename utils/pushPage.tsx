import { NextRouter } from "next/router";
import getSearchType, { SearchTypes } from "./getSearchType";

const pushPage = (id: string, router: NextRouter) => {
    
    const type = getSearchType(id);

    // -- validate
    if( type === null ) return;

    // -- execute
    if( type === SearchTypes.ETH_ADDRESS){
        // alertMsg('Success', `Found search type ${SearchTypes.ETH_ADDRESS}`)
        router.push(`/owners/${id}`);
    }

    if( type === SearchTypes.PKP_TOKEN_ID){
        // alertMsg('Success', `Found search type ${SearchTypes.PKP_TOKEN_ID}`)
        router.push(`/pkps/${id}`);
    }

    if( type === SearchTypes.IPFS_ID){
        // alertMsg('Success', `Found search type ${SearchTypes.IPFS_ID}`);
        router.push(`/actions/${id}`);
    }


}

export default pushPage;