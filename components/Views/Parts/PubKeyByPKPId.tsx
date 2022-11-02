import { useEffect, useState } from "react";
import { useAppContext } from "../../Contexts/AppContext";
import Copy from "../../UI/Copy";

const PubKeyByPKPId = ({
    pkpId
} : {
    pkpId: string | any 
}) => {

    // -- (app context)
    const { routerContract } = useAppContext();

    // -- (state)
    const [ pubKey, setPubKey] = useState();
    
    // -- (mounted)
    useEffect(() => {

        // -- validate
        if( ! pkpId || routerContract?.read === undefined) return;

        (async() => {

            const _pubKey = await routerContract.read.getFullPubKey(pkpId)

            setPubKey(_pubKey);

        })();

    }, [routerContract?.read])

    // -- (validations)
    if( ! pubKey ) return <>loading...</>

    return (
        <div className="flex text-sm">
            <div className="flex-content">PKP Public Key: { pubKey }</div> 
            <Copy value={pubKey} />
        </div>
    )
}
export default PubKeyByPKPId;