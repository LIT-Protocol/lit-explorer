import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import MonacoEditor from '@monaco-editor/react';
import { useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import uploadToIPFS from "../../utils/ipfs/upload";
import { LinearProgressWithLabel } from "../../components/Progress";
import throwError from "../../utils/throwError";
import { useRouter } from "next/router";
import { CeloExplorer } from "../../utils/blockchain/CeloExplorer";
import { AppRouter } from "../../utils/AppRouter";

const CreateAction: NextPageWithLayout = () => {

  const router = useRouter();

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

    // -- validate
    if( ! ipfsId || ipfsId == ''){
      throwError("IPFS ID not found.");
      return;
    }

    const page = AppRouter.getPage(ipfsId);
    router.push(page);

    return;

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
                      <a className="align-right" target="_blank" rel="noreferrer" href={CeloExplorer.txLink(txRegisterActionHash ?? '')}>{ txRegisterActionHash } </a>
                    </div>
                      

                  </div> : ''
              }

            </>
            : ''
          }
        
      </div>
      : ''
    }
    
    
    <h1>Create Action</h1>

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