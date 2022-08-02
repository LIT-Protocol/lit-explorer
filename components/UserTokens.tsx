import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { asyncForEachReturn } from "../utils/asyncForeach";
import callAddPermittedAction from "../utils/blockchain/callAddPermittedAction";
import getPubkeyRouterAndPermissionsContract from "../utils/blockchain/getPubkeyRouterAndPermissionsContract";
import getTokensByAddress from "../utils/blockchain/getTokensByAddress";
import { cacheFetch } from "../utils/cacheFetch";
import { ipfsIdToIpfsIdHash } from "../utils/ipfs/ipfsHashConverter";
import throwError from "../utils/throwError";

interface UserTokensProps{
    ownerAddress: string,
    ipfsId?: string | any,
}

const UserTokens = (props: UserTokensProps) => {

    const [tokens, setTokens] = useState();
    const [selectedToken, setSelectedToken] = useState();
    
    const getTokens = async () => {
        const contract = await getPubkeyRouterAndPermissionsContract();

        const ipfsHash = ipfsIdToIpfsIdHash(props.ipfsId);

        console.log(ipfsIdToIpfsIdHash(props.ipfsId));

        let tokens : any = await getTokensByAddress(props.ownerAddress);
        
        const list : any = await asyncForEachReturn(tokens, (async (token: any) => {
            
            const isPermittedAction = await contract.isPermittedAction(token, ipfsHash);

            return {
                token,
                isPermittedAction,
            };
        }));

        console.log("list:", list);
        setTokens(list);
    }

    useEffect(() => {

        // -- validate
        if(! props?.ownerAddress || !props?.ipfsId) return;

        (async() => {

            console.log("Getting tokens");

            await getTokens();

        })();
        
    }, [props.ownerAddress])

    // -- (Action) add permission
    const addPermission = async () => {

        // -- validate
        console.log("props?.ipfsId:", props?.ipfsId);
        if( ! props?.ipfsId || props?.ipfsId == ''){
            throwError("IPFS ID not found.");
            return;
        }
        
        console.log("selectedToken:", selectedToken);

        let permittedAction;

        try{
            permittedAction = await callAddPermittedAction(props.ipfsId, (selectedToken as any).token);
        }catch(e){
            console.error(e);
        }

        if( permittedAction ){
            console.log("permittedAction:", permittedAction);
            alert("Added permitted action!");
            await getTokens();
        }
    }

    // -- (input event) on change token
    const onChangeToken = async (e: any) => {

        const value = e.target.value;

        console.log("onChangeToken:", value);

        setSelectedToken(value);
    }

    if(! tokens ) return <>Loading PKP tokens...</>;

    return (
        <>
            <FormControl fullWidth className="mt-24">
                <InputLabel id="demo-simple-select-label">Your PKP NFTs</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedToken}
                    label="Your PKP NFTs"
                    onChange={onChangeToken}
                >
                    {
                        (tokens as [])?.map((item: any, id: any)=> {
                            return <MenuItem key={id} value={item}>
                                { item.token } { item.isPermittedAction ? '(Permitted)' : '' }
                            </MenuItem>
                        })
                    }
                </Select>
            </FormControl>

            <div className="mt-12 flex">
                <Button onClick={addPermission} className="btn-2 ml-auto">Add Permitted Action</Button>
            </div>

        </>
    );
}

export default UserTokens;