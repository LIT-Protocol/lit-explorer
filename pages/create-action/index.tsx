import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import MonacoEditor from '@monaco-editor/react';
import { useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import uploadToIPFS from "../../utils/ipfs/upload";
import throwError from "../../utils/throwError";
import { useRouter } from "next/router";
import { AppRouter } from "../../utils/AppRouter";
import MyProgress from "../../components/UI/MyProgress";
import MyCard from "../../components/MyCard";
import { APP_CONFIG } from "../../app_config";
import { tryUntil } from "../../utils/tryUntil";

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

  // -- (state)
  const [code, setCode] = useState(litActionCode);
  const [msg, setMsg] = useState('Loading...');
  const [progress, setProgress] = useState(0);
  const [ipfsId, setIpfsId] = useState();
  const [completed, setCompleted] = useState(false);

  /**
   * When code is being edited
   * @param code 
   */
  const onEdit = (code: any) => {
    setCode(code);
  }

  /**
   * (event) Upload the code to IPFS 
   */
  const handleUpload = async () => {
    
    setProgress(20);
    setMsg('Uploading to IPFS...');
    const ipfsData = await uploadToIPFS(code);
    console.log("ipfsData:", ipfsData)
    
    setProgress(40);
    setMsg('requesting data to be pinned...');
    const data = await fetch(`/api/pinata/${ipfsData.path}`).then((res) => res.json());
    console.log("data:", data);

    setProgress(60);
    setMsg('data uploaded! waiting for it to be pinned...');
    setIpfsId(data.data.ipfsHash);

    setCompleted(true);

    const isPinned = await tryUntil({
      onlyIf: async () => (await fetch(`${APP_CONFIG.IPFS_PATH}/${data.data.ipfsHash}`)).status !== 404,
      thenRun: async () => true,
      onTrying: (counter: number) => {
        setProgress(60 + counter);
        setMsg(`${counter} Your code is available to register but not ready to be viewed yet..`);
      },
      onError: (_: any) => {
        throwError("Failed to check the pinning status, maybe check again in 5 mins");
        return;
      },
      max: 20,
      interval: 6000,
    })

    
    console.log("isPinned:", isPinned);
    
    setMsg('Done!');
    setProgress(100);

  }

  /**
   * (event) Register Lit Action
   * @returns 
   */
  const handleRegister = async () => {

    // -- validate
    if( ! ipfsId || ipfsId == ''){
      throwError("IPFS ID not found.");
      return;
    }

    const page = AppRouter.getPage(ipfsId);
    router.push(page);

    return;

  }

  /**
   * (render) render progress UI
   */
  const renderProgress = () => {

    // -- validate
    if(progress <= 0 || progress >= 100) return <></>

    // -- finally
    return (
      <>
        <MyProgress value={progress} message={msg} />
      </>
    )

  }

  /**
   * (render) render post upload
   */
  const renderPostUpload = () => {

    // -- validate
    if ( ! completed) return <></>

    // -- finally
    return (
      <MyCard className="mt-12">
        {
          progress >= 100 ? 
          <Alert severity="success">Successfully uploaded to IPFS!</Alert> : 
          ''
        }
        <TextField className="mt-12 textfield" fullWidth label="IPFS ID" value={ipfsId} />
        <div className="mt-12 flex">
          <Button onClick={handleRegister} className="btn-2 ml-auto">Register Action</Button>
        </div>
      </MyCard>
    )
  }

  /**
   * (render) render content
   */
  const renderContent = () => {

    return (
      <>
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
          <Button onClick={handleUpload} className="btn-2 ml-auto">Upload to IPFS</Button>
        </div>  
      </>
    )

  }

  // (validations)

  return (
    <>
      { renderProgress() }
      { renderPostUpload() }
      { renderContent() }      
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