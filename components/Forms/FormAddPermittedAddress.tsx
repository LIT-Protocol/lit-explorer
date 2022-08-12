import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { heyShorty } from "../../utils/converter";
import throwError from "../../utils/throwError";
import { wait } from "../../utils/utils";
import { useAppContext } from "../Contexts/AppContext";
import { MyProgressI } from "./FormInputFields";
import MyButton from "../UI/MyButton";
import MyCard from "../UI/MyCard";
import MyProgress from "../UI/MyProgress";
import SelectionPermittedPKPs from "./SelectionPermittedPKPs";

const FormAddPermittedAddress = ({
    ipfsId,
    onDone,
} : {
    ipfsId: string,
    onDone?(): void
}) => {

    // -- (app context)
    const { routerContract } = useAppContext();

    // -- (state)
    const [isActionRegistered, setIsActionRegisterd] = useState(false);
    const [selectedPKPId, setSelectedPKPId] = useState();
    const [childRefresh, setChildRefresh] = useState(0);
    const [inputAddress, setInputAddress] = useState();
    
const [progress, setProgress] = useState<MyProgressI>();
    // -- (mounted)
    useEffect(() => {

        // -- validate
        if( ! ipfsId ) return;
 
        // -- refresh
        setChildRefresh(prev => prev + 1);

        (async() => {
        
            console.log("[FormAddPermittedAddress] input<ipfsId>:", ipfsId);
            const _isRegistered = await routerContract.read.isActionRegistered(ipfsId);
            console.log("[FormAddPermittedAddress] output<_isRegistered>:", _isRegistered);
            setIsActionRegisterd(_isRegistered);

        })();

    }, [])

    // -- (event) when a PKP is selected
    const onSelectPKP = (pkpId: any) => {
        console.log("[onSelectPKP]: input<pkpId>:", pkpId);
        setSelectedPKPId(pkpId);
    }

    // -- (event) on submit 
    const onSubmit = async () => {

        // -- prepare input data
        const _pkpId = selectedPKPId;
        const _ipfsId = ipfsId;
        const _ownerAddress = inputAddress;
        
        // -- validate
        if( ! _pkpId ){
            throwError("You must select a PKP token!");
            return;
        }
        
        if ( ! _ipfsId ) {
            throwError("_ipfsId cannot be empty!");
            return;
        }
        
        if ( ! _ownerAddress ){
            throwError("_ownerAddress cannot be empty!");
            return;
        }

        
        
        // -- execute
        setProgress({message: `Permitting PKP "${heyShorty(_pkpId)}" to ${heyShorty(_ownerAddress)}...`, progress: 50})
        console.log("[onSubmit]: input<_pkpId>:", _pkpId);
        console.log("[onSubmit]: input<_ipfsId>:", _ipfsId);
        console.log("[onSubmit]: input<_ownerAddress>:", _ownerAddress);

        let tx: any;
        
        try{
            tx = await routerContract.write.addPermittedAddress(_pkpId, _ownerAddress);
            console.log("[onSubmit]: output<tx>:", tx);

            setProgress({message: `Waiting for confirmation...`, progress: 75})
            const res = await tx.wait();
            console.log("[onSubmit]: output<res>:", res);
            
            setProgress({message: `Done!`, progress: 100})
            setChildRefresh(prev => prev + 1);
            
            await wait(2000);
            setProgress({message: ``, progress: 0})

            if(onDone){
                onDone();
            }


        }catch(e: any){
            throwError(e.message);
            setProgress({message: ``, progress: 0});
        }
        
    }

    // -- (event) handle change
    const handleChange = (e: any) => {

        const value = e.target.value;

        console.log("[handleChange]: input<value>", value);

        setInputAddress(value);
    }

    // -- (render)
    const renderProgress = () => {

        const _progress = progress?.progress || 0;
        const _message = progress?.message || '';

        if(_progress <= 0) return <></>

        return (
            <div className="mb-24">
                <MyProgress value={_progress} message={_message}/>
            </div>
        )
    }

    // -- (render)
    const renderButton = () => {

        const _progress = progress?.progress || 0;

        if( _progress > 0) return <></>;

        return (
            <div className="mt-12 flex">
                <MyButton onClick={onSubmit} className="ml-auto">Permit Address</MyButton>
            </div>            
        )

    }

    // -- (render) the selection form
    const renderForm = () => {
        
        const _progress = progress?.progress || 0;

        if (_progress > 0) return <></>

        return (
            <>
            <div className="mt-12">
                <SelectionPermittedPKPs
                    title="Select your PKP"
                    onSelect={onSelectPKP}
                    refresh={childRefresh}
                    ipfsId={ipfsId}
                    onDefaultToken={(defaultToken: any) => {
                        setSelectedPKPId(defaultToken)
                    }}
                />
            </div>
            <div className='mt-24'>
                <TextField
                    label="Permitted Address (eg. 0x3B5...99A1)"
                    defaultValue=""
                    size="small"
                    fullWidth={true}
                    onChange={handleChange}
                />
            </div>
            </>
        )

    }

    // -- (render)
    const renderPKPSelectionForm = () => {        
        return (
            <div className="mt-24">
                <MyCard title="Add permitted Address">
                    { renderProgress() }

                    { renderForm() }

                    { renderButton() }
                </MyCard>
            </div>
        )
    }


    // -- (validation)
    if( ! ipfsId ) return <>ipfsId is not loaded</>
    if( ! isActionRegistered ) return <>Found ipfsId, but Action code is not registered.</>
    
    return (
        <>
            { renderPKPSelectionForm() }
        </>
    )
}
export default FormAddPermittedAddress;