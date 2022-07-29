import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import MonacoEditor from '@monaco-editor/react';
import { useState } from "react";
import HorizontalLabelPositionBelowStepper from "../../components/Stepper";
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import uploadToIPFS from "../../utils/ipfs/upload";
import { LinearProgressWithLabel } from "../../components/Progress";
import callRegisterAction from "../../utils/blockchain/callRegisterAction";
import throwError from "../../utils/throwError";
import getPKPNFTContract from "../../utils/blockchain/getPKPNFTContract";
import getTokensByAddress from "../../utils/blockchain/getTokensByAddress";
import callAddPermittedAction from "../../utils/blockchain/callAddPermittedAction";
import getTxLink from "../../utils/blockchain/getTxLink";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";

const CreateAction: NextPageWithLayout = () => {

  const litActionCode = `const go = async () => {
  // this is the string "Hello World" for testing
  const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await LitActions.signEcdsa({
    toSign,
    keyId: "1",
    sigName: "sig1",
  });
};

go();`;

  const [code, setCode] = useState(litActionCode);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('Loading...');
  const [counter, setCounter] = useState(0);
  const [ipfsId, setIpfsId] = useState();

  // --- User's tokens
  const [userTokensTabEnabled, setUserTokensTabEnabled] = useState(false);
  const [userTokens, setUserTokens] = useState([]);
  const [userHasTokens, setUserHasTokens] = useState(false);
  const [selectedToken, setSelectedToken] = useState();

  // --- txs
  const [txRegisterActionHash, setTxRegisterActionHash] = useState('');

  /**
   * When code is being edited
   * @param code 
   */
  const onEdit = (code: any) => {
    console.log(code);
    setCode(code);
  }

  /**
   * Upload the code to IPFS 
   */
  const upload = async () => {
    
    setCounter(1);
    setLoading(true);
    setMsg('Uploading to IPFS...');
    const ipfsData = await uploadToIPFS(code);
    
    setCounter(2);
    setMsg('Pinning data...');
    const data = await fetch(`/api/pinata/${ipfsData.path}`).then((res) => res.json());
    
    setCounter(3);
    setIpfsId(data.data.ipfsHash);
    setLoading(false);

  }

  /**
   * Register Lit Action
   * @returns 
   */
  const register = async () => {

    const debug = true;
    
    setUserTokensTabEnabled(true);

    // -- validate
    if( ! ipfsId || ipfsId == ''){
      throwError("IPFS ID not found.");
      return;
    }

    let ownerAddress: string;

    if( debug ){
      setTxRegisterActionHash("FAKE-TRANSACTION-46bbccdcac66bb4d7a4891bc1c76234a9c79f3140699cd0f6117")
      ownerAddress = '0x50e2dac5e78B5905CB09495547452cEE64426db2';
    }else{
      const txRegisterAction = await callRegisterAction(ipfsId);
      console.log("txRegisterAction:", txRegisterAction);
      const { addresses } = await getWeb3Wallet();
      ownerAddress = addresses[0];
    }

    let tokens: any = await getTokensByAddress(ownerAddress);

    setUserTokens(tokens);

    setUserHasTokens(tokens.length <= 0 ? false : true);

  }

  /**
   * Add permission
   */
  const addPermission = async () => {

    // -- validate
    if( ! ipfsId || ipfsId == ''){
      throwError("IPFS ID not found.");
      return;
    }

    let permittedAction;

    try{
      permittedAction = await callAddPermittedAction(ipfsId, selectedToken);
    }catch(e){
      console.warn(e);
    }

    if( permittedAction ){
      alert(permittedAction);
    }


  }

  return (
    <>
    {
      counter > 0
      ? <div className="uploaded-result">
          
          {
            loading ? <>
              <LinearProgressWithLabel value={(counter / 3) * 100} />
              { msg }
            </> : ''
          }
        
        
          {
            counter == 3
            ? <>
              <Alert severity="success">Successfully uploaded to IPFS - Please wait at least 5 minutes for the CID to be pinned</Alert>
              <TextField className="mt-12 textfield" fullWidth label="IPFS ID" value={ipfsId} />
              <div className="mt-12 flex">
                <Button onClick={register} className="btn-2 ml-auto">Register Action</Button>
              </div>

              { 
                txRegisterActionHash !== null || txRegisterActionHash !== ''?
                <div className="mt-12">
                    <div className="mt-12 flex ">
                      <a className="align-right" target="_blank" href={getTxLink(txRegisterActionHash ?? '')}>{ txRegisterActionHash } </a>
                    </div>
                      

                  </div> : ''
              }

              { 
                userTokensTabEnabled ?
                  <div className="mt-12">
                    {
                      userTokens.length > 0 ?
                        <>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Your PKP NFTs</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={selectedToken}
                              label="Your PKP NFTs"
                              onChange={(e: any) => setSelectedToken(e.target.value)}
                            >
                              {
                                userTokens?.map((token: any, id: any)=> {
                                  return <MenuItem key={id} value={token}>{ token }</MenuItem>
                                })
                              }
                            </Select>
                          </FormControl>
                          
                          <div className="mt-12 flex">
                            <Button onClick={addPermission} className="btn-2 ml-auto">Add Permitted Action</Button>
                          </div>

                        </>
                      : ! userHasTokens ? <Alert severity="error">No PKP found.</Alert> : 'Loading your PKPs...'
                    }

                  </div> : ''
              }
              
              


            </>
            : ''
          }
        
      </div>
      : ''
    }
    
    
    <h1>Create Action</h1>

    {/* <HorizontalLabelPositionBelowStepper steps={[
      'Creating Lit Action',
      'Register Action',
      'Create an ad',
    ]}/> */}

    {/* <p>
        <a target="_blank" rel="noreferrer" href="https://developer.litprotocol.com/LitActionsAndPKPs/workingWithLitActions">
            Documentation
        </a>
    </p> */}
        <div className="code-editor mt-12">
            <MonacoEditor
                language="javascript"
                onChange={(code) => onEdit(code)}
                value={code}
                theme="vs-dark"
                height="300px"
            />
        </div>

        <div className="mt-12 flex">
          <Button onClick={upload} className="btn-2 ml-auto">Upload to IPFS</Button>
        </div>        
    </>
  )
}

export default CreateAction

CreateAction.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}