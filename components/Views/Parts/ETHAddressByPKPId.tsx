import { useEffect, useState } from "react";
import { pub2Addr } from "../../../utils/converter";
import { useAppContext } from "../../Contexts/AppContext";
import Copy from "../../UI/Copy";

const ETHAddressByPKPId = ({
    pkpId
} : {
    pkpId: string | any 
}) => {

    // -- (app context)
    const { routerContract } = useAppContext();

    // -- (state)
    const [address, setAddress] = useState<any>();
    
    // -- (mounted)
    useEffect(() => {

        // -- validate
        if( ! pkpId ) return;

        (async() => {

            const _pubKey = await routerContract.read.getFullPubKey(pkpId);

            const _ethAddress = '0x' + pub2Addr(_pubKey);

            setAddress(_ethAddress);

        })();

    }, [])

    // -- (validations)
    if( ! address ) return <>loading...</>

    return (
        <div className="flex text-sm">
            <div className="flex-content">ETH Address: { address }</div> 
            <Copy value={address} />
        </div>
    )
}
export default ETHAddressByPKPId;