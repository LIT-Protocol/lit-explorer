import { Alert, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { PopulatedTransaction } from "ethers";
import { useEffect, useState } from "react";
import { asyncForEachReturn } from "../utils/asyncForeach";
import callAddPermittedAction from "../utils/blockchain/callAddPermittedAction";
import getPubkeyRouterAndPermissionsContract from "../utils/blockchain/getPubkeyRouterAndPermissionsContract";
import getTokensByAddress from "../utils/blockchain/getTokensByAddress";
import { cacheFetch } from "../utils/cacheFetch";
import { ipfsIdToIpfsIdHash } from "../utils/ipfs/ipfsHashConverter";
import RenderDate from "../utils/RenderDate";
import RenderLink from "../utils/RenderLink";
import throwError from "../utils/throwError";
import LoadData from "./LoadData";

interface UserTokensProps{
    ownerAddress: string,
    ipfsId?: string | any,
}

interface SelectedToken{
    token: string,
    isPermittedAction: boolean
}

interface mock{
    mock?: boolean;
}

interface UserTokenI{
    token: string
    isPermittedAction: boolean
}

const UserTokens = (props: UserTokensProps) => {


    const [permittedTokens, setPermittedTokens] = useState<Array<UserTokenI>>();
    const [unpermittedTokens, setUnpermittedTokens] = useState<Array<UserTokenI>>();
    
    const [tokens, setTokens] = useState<Array<UserTokenI>>();
    const [selectedToken, setSelectedToken] = useState<SelectedToken | undefined>();

    /**
     * Get and set a list of owner's tokens to this component's state
     */
    const getAndSetTokens = async (mockProp?:mock) => {
        const contract = await getPubkeyRouterAndPermissionsContract();

        const ipfsHash = ipfsIdToIpfsIdHash(props.ipfsId);

        console.log(ipfsIdToIpfsIdHash(props.ipfsId));

        let tokens : any = await getTokensByAddress(props.ownerAddress);
        
        const list : Array<UserTokenI> = ! mockProp?.mock ? await asyncForEachReturn(tokens, (async (token: any) => {
            
            const isPermittedAction = await contract.isPermittedAction(token, ipfsHash);

            return { token, isPermittedAction };

        })): [
            {token: '104351356416782318547361099599174641266708022357390197911624806385736986986952', isPermittedAction: true}
        ];

        console.log("list:", list);
        setTokens(list);

        let permittedPKPs : Array<UserTokenI> = list.filter((item: UserTokenI) => item.isPermittedAction);
        let unPermittedPKPs : Array<UserTokenI> = list.filter((item: UserTokenI) => ! item.isPermittedAction);

        console.log("permittedPKPs:", permittedPKPs);
        console.log("unPermittedPKPs:", unPermittedPKPs);

        setPermittedTokens(permittedPKPs);
        setUnpermittedTokens(unPermittedPKPs);

    }

    useEffect(() => {

        // -- validate
        if(! props?.ownerAddress || !props?.ipfsId) return;

        (async() => {

            console.log("Getting tokens");

            await getAndSetTokens();

        })();
        
    }, [props.ownerAddress])

    // -- (Action) add permission
    const addPermittedAction = async () => {

        // -- validate
        if( ! props?.ipfsId || props?.ipfsId == ''){
            throwError("IPFS ID not found.");
            return;
        }

        // -- validate if the current action is NOT permitted yet
        if( selectedToken?.isPermittedAction ){
            throwError(`${ selectedToken?.token } is already a permitted action for ${props.ownerAddress}`);
            return;
        }
        
        // -- call smart contract to add permitted action
        const mock = false;

        let permittedAction: PopulatedTransaction = mock 
            ? [] 
            : await callAddPermittedAction(props.ipfsId, selectedToken?.token);

        if(permittedAction){
            console.log("permittedAction:", permittedAction);
    
            // -- update a new list of tokens (appending 'Permitted' text)
            setTimeout(async () => {
                await getAndSetTokens({mock});
                alert("Added permitted action!");
            }, 2000)
        }
    }

    // -- (input event) on change token
    const onChangeToken = async (e: any) => {

        const value = e.target.value;

        console.log("onChangeToken:", value);

        setSelectedToken(value);
    }

    if(! tokens ) return <>Loading PKP tokens...</>;
    if(! unpermittedTokens ) return <>Loading unpermitted PKPs...</>;
    if(! permittedTokens ) return <>Loading permitted PKPs...</>;

    return (
        <>
            {
                unpermittedTokens?.length <= 0 ?
                <Alert severity="info">No more available PKPs to permit this action</Alert> :
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
                                (unpermittedTokens as [])?.map((item: any, id: any)=> {
                                    return <MenuItem key={id} value={item}>
                                    { item.token }
                                    </MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>

                    <div className="mt-12 flex">
                        <Button onClick={addPermittedAction} className="btn-2 ml-auto">Add Permitted Action</Button>
                    </div>
                </>
            }
            {
                permittedTokens?.length > 0 ?
                <div className="mt-12">
                    <LoadData
                        key={props.ipfsId.toString()}
                        debug={false}
                        title="Permitted PKPs:"
                        errorMessage="No permitted PKPs found."
                        data={permittedTokens}
                        filter={(rawData: Array<UserTokenI>) => {
                            console.log("on filtered: ", rawData);
                            return rawData;
                        } }
                        renderCols={(width: any) => {
                            return [
                            { headerName: "Permitted PKP", field: "tokenID", minWidth: width, renderCell: RenderLink},
                            ];
                    
                        } }
                        renderRows={(filteredData: any) => {
                            return filteredData?.map((pkp: any, i: number) => {
                            return {
                                id: i + 1,
                                tokenID: pkp.token,
                            };
                            });
                        } }    
                    />
                </div>
                : ''
            }



        </>
    );
}

export default UserTokens;