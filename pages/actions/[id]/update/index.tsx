import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../../../components/MainLayout";
import { LinearProgressWithLabel } from "../../../../components/Progress";
import callRegisterAction from "../../../../utils/blockchain/callRegisterAction";
import getPubkeyRouterAndPermissionsContract from "../../../../utils/blockchain/getPubkeyRouterAndPermissionsContract";
import getWeb3Wallet from "../../../../utils/blockchain/getWeb3Wallet";
import { ipfsIdToIpfsIdHash } from "../../../../utils/ipfs/ipfsHashConverter";
import throwError from "../../../../utils/throwError";
import { NextPageWithLayout } from "../../../_app";
import AddPermittedAction from "../../../../components/AddPermittedAction";

const RegisterActionPage: NextPageWithLayout = () => {

  const router = useRouter();

  const { id } = router.query;

  const [registered, setRegistered] = useState(false);
  const [signer, setSigner] = useState();
  const [ownerAddress, setOwnerAddress] = useState('');

  const [status, setStatus] = useState({state: 0, msg: ''});
  const [tx, setTx] = useState();

  useEffect(() => {

    const test = () => {
      return false;
    }

    (async() => {

      // -- if params doesnt exist
      if( ! id ) return;

      // -- get owner address
      const { addresses, signer } = await getWeb3Wallet();
      let ownerAddress: string = addresses[0];
      setOwnerAddress(ownerAddress);
      setSigner(signer);

      // -- call 'register' smart contract
      let ipfsId: string | any = id;

      const ipfsHash = ipfsIdToIpfsIdHash(ipfsId);

      const contract = await getPubkeyRouterAndPermissionsContract();

      if(await contract.isActionRegistered(ipfsHash)){
        setStatus({state: 100, msg: 'Action is registered'})
        setRegistered(true);
        return;
      }
      
      setStatus({state: 50, msg: 'Registering action...'})
          
      // await new Promise(resolve => setTimeout(resolve, 1000));
      let txRegisterAction;
      
      try{
        txRegisterAction= await callRegisterAction(ipfsId);
        
        let counter = 0;
        let milliseconds = 2000;
  
        let intervalId = setInterval(async () => {
  
          const isReady = await contract.isActionRegistered(ipfsHash);
          
          // const isReady = counter < 1 ? false : true;

          console.log(`Running: ${isReady}`);
  
          if(isReady){
            setTimeout(() => {
              setStatus({state: 100, msg: 'Action is registered'})
              setTimeout(() => {
                setRegistered(true);
              }, 2000)
              clearInterval(intervalId);
            }, 1000)
          }
  
          counter = counter + 1;
  
          setStatus({state: 75 + counter, msg: `${counter}: Waiting for blockchain confirmation...`})
  
          if(counter >= 10){
            setStatus({state: -1, msg: 'Refresh this page or try again later.'})
            clearInterval(intervalId);
          }
  
        }, milliseconds)

      }catch(e){
        throwError(`Failed to register action ${ipfsId}`);
      }
      
    })();

  }, [id]);

    // -- validate
    if(!registered) return <>
      <div className="uploaded-result">
        <LinearProgressWithLabel value={status.state} />
        { status.msg }
      </div>
    </>

    return (
        <>
          <AddPermittedAction ownerAddress={ownerAddress} ipfsId={id} signer={signer}/>
        </>
    )
    
}

export default RegisterActionPage

RegisterActionPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}