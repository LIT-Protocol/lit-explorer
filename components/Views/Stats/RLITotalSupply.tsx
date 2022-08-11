import { useEffect, useState } from "react";
import { useAppContext } from "../../Contexts/AppContext";

const RLITotalSupply = () => {
    
    // -- (app context)
    const { rliContract } = useAppContext();

    // -- (states)
    const [totalSupply, setTotalSupply] = useState<any>();

    // -- (mounted)
    useEffect(() =>{

        (async() => {
            await fetchRLITotalSupply();
        })();

    }, [])

    // -- (fetch)
    const fetchRLITotalSupply = async() => {

        const _totalSupply = await rliContract.read.totalSupply();

        setTotalSupply(_totalSupply);

    }

    // -- (validate)
    if( ! totalSupply ) return <></>

    return (<>{ totalSupply }</>)
}
export default RLITotalSupply;