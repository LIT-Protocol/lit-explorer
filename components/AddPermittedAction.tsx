import { Alert, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { PopulatedTransaction, Signer } from "ethers";
import { useEffect, useState } from "react";
import { asyncForEach, asyncForEachReturn } from "../utils/asyncForeach";
import callAddPermittedAction from "../utils/blockchain/callAddPermittedAction";
import getPubkeyRouterAndPermissionsContract from "../utils/blockchain/getPubkeyRouterAndPermissionsContract";
import getTokensByAddress from "../utils/blockchain/getTokensByAddress";
import { cacheFetch } from "../utils/cacheFetch";
import { getBytes32FromMultihash, IPFSHash, ipfsIdToIpfsIdHash } from "../utils/ipfs/ipfsHashConverter";
import RenderDate from "../utils/RenderDate";
import RenderLink from "../utils/RenderLink";
import throwError from "../utils/throwError";
import LoadData from "./LoadData";
import { LinearProgressWithLabel } from "./Progress";

interface AddPermittedActionProps{
    ownerAddress: string,
    ipfsId?: string | any,
    signer?: any
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

const AddPermittedAction = (props: AddPermittedActionProps) => {
    
    const [tokens, setTokens] = useState<Array<UserTokenI>>([]);
    const [permittedTokens, setPermittedTokens] = useState<Array<UserTokenI>>([]);
    const [selectedToken, setSelectedToken] = useState<SelectedToken | undefined>();

    const [addingPermission, setAddingPermission] = useState(false);
    const [addingPermissionState, setAddingPermissionState] = useState(0);

    /**
     * Get and set a list of owner's tokens to this component's state
     */
    const getAndSetTokens = async (mockProp?:mock) => {

        const contract = await getPubkeyRouterAndPermissionsContract({wallet: props.signer});

        const ipfsHash = ipfsIdToIpfsIdHash(props.ipfsId);

        let tokens : any = await getTokensByAddress(props.ownerAddress, props.signer);
        
        const list : Array<UserTokenI> = ! mockProp?.mock ? await asyncForEachReturn(tokens, (async (token: any) => {

            // const isPermittedAction = await tryUntil({
            //     onlyIf: async () => await contract.isActionRegistered(ipfsHash),
            //     thenRun: async () => await contract.isPermittedAction(token, ipfsHash),
            // });

            const isPermittedAction = await contract.isPermittedAction(token, ipfsHash);
        
            return { token, isPermittedAction };

        })): [
            {token: '104351356416782318547361099599174641266708022357390197911624806385736986986952', isPermittedAction: true}
        ];

        setTokens(list);
        setPermittedTokens([...list].filter((item) => item.isPermittedAction));

        return list;

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

        const tokenId = (selectedToken as any).token;

        // -- trigger loading component
        setAddingPermission(true);
        setAddingPermissionState(20);
        
        // -- call smart contract to add permitted action
        let permittedAction:any = await callAddPermittedAction({
            ipfsId: props.ipfsId,
            selectedToken: tokenId,
            signer: props.signer,
        });

        console.warn("Action Permitte! (TX):", permittedAction);

        setAddingPermissionState(75);

        const newList = [...tokens].map((item) => {
            if(item.token == tokenId){
                item.isPermittedAction = true;
            }
            return item;
        })

        setPermittedTokens(newList);
        
        setAddingPermissionState(100);
        setAddingPermission(false);
        
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
            {
                tokens?.length <= 0 ?
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
                                (tokens as [])?.map((item: any, id: any)=> {
                                    return <MenuItem key={id} value={item}>
                                    { item.token }{ item.isPermittedAction ? ': (Permitted)' : '' }
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
                addingPermission ? 
                <div className="uploaded-result mt-12">
                    <LinearProgressWithLabel value={addingPermissionState} />
                    Adding permission...
                </div>
                : ''
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

export default AddPermittedAction;