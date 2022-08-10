import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import { asyncForEachReturn } from "../../utils/utils";
import { useAppContext } from "../Contexts/AppContext";

const UnpermittedPKPsSelectionForm = ({ 
    title,
    onSelect,
    refresh,
    ipfsId,
 }: {
    title?: string,
    label?: string,
    onSelect?(data: any): void,
    refresh?: number,
    ipfsId?: string,
}) => {

    // -- (app context)
    const { pkpContract, routerContract } = useAppContext();

    // -- (state)
    const [tokens, setTokens] = useState<Array<string>>();
    const [selectedToken, setSelectedToken] = useState<string>();

    // -- (mounted)
    useEffect(() => {

        // -- debug
        if(refresh){
            console.log("[UnpermittedPKPsSelectionForm] refresh:", refresh);
        }
        
        (async() => {
            await fetchTokens();
        })();

    }, [refresh]);

    // -- (void)
    const fetchTokens = async () => {

        const { ownerAddress } = await getWeb3Wallet();

        const _tokens : Array<string> = await pkpContract.read.getTokensByAddress(ownerAddress);
        console.log("[fetchTokens] output<_tokens>:", _tokens);
        
        let _unpermitted = await asyncForEachReturn(_tokens, async (pkpId: string) => {
            return await routerContract.read.isPermittedAction(pkpId, (ipfsId as string)) ? null : pkpId;
        })
        _unpermitted = _unpermitted.filter((pkpId) => pkpId != null)

        console.log("[_unpermitted] output<_unpermitted>:", _unpermitted);

        setTokens(_unpermitted);

        // -- only run the first time
        if( ! refresh ){
            setSelectedToken(_tokens[0])
        }
    }

    // -- (event)
    const handleChange = (e: any) => {

        const _token = e.target.value;

        setSelectedToken(_token);
        
        // -- callback
        if(onSelect){
            onSelect(_token);
        }
    }

    // -- (validations)
    if( ! tokens ) return <>No PKPs found.</>
    if( ! ipfsId ) return <>No ipfsId found.</>

    return (
        <>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{ title ?? 'TITLE' }</InputLabel>
            
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedToken}
                label={ title ?? 'TITLE' }
                onChange={handleChange}
            >
                {
                    tokens.map((pkpId) => {
                        return <MenuItem key={pkpId} value={pkpId}>{pkpId}</MenuItem>;
                    })
                }
            </Select>
            </FormControl>
        </>
    )
}
export default UnpermittedPKPsSelectionForm;