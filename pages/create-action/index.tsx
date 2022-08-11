import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import MonacoEditor from '@monaco-editor/react';
import { useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import uploadToIPFS from "../../utils/ipfs/upload";
import throwError from "../../utils/throwError";
import { useRouter } from "next/router";
import { AppRouter } from "../../utils/AppRouter";
import MyProgress from "../../components/UI/MyProgress";
import MyCard from "../../components/UI/MyCard";
import { APP_CONFIG, APP_LINKS } from "../../app_config";
import { tryUntil } from "../../utils/tryUntil";
import MyDescription from "../../components/UI/MyDescription";

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
  const [ipfsId, setIpfsId] = useState<string | any>();
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
    console.log("[handleUpload] ipfsData:", ipfsData)
    
    setProgress(40);
    setMsg('Requesting data to be pinned...');
    const data = await fetch(`/api/pinata/${ipfsData.path}`).then((res) => res.json());
    console.log("[handleUpload] data:", data);

    setProgress(60);
    setMsg('Data uploaded! waiting for it to be pinned...');
    setIpfsId(data.data.ipfsHash);

    const isPinned = await tryUntil({
      onlyIf: async () => (await fetch(`${APP_CONFIG.IPFS_PATH}/${data.data.ipfsHash}`)).status !== 404,
      thenRun: async () => true,
      onTrying: (counter: number) => {
        setCompleted(true);
        setProgress(60 + counter);
        setMsg(`Still waiting... but your code is available to register! just not ready to be viewed at the moment...`);
      },
      onError: (_: any) => {
        throwError("Failed to check the pinning status, maybe check again in 5 mins");
        return;
      },
      max: 20,
      interval: 6000,
    })

    
    console.log("[handleUpload] isPinned:", isPinned);
    
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

    const page = AppRouter.getPage(ipfsId) + '/update';
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

    // (inner event) handleViewCode
    const _handleViewCode = () => {
      const page = AppRouter.getPage(ipfsId);
      router.push(page);
    }

    // (inner render) render status
    const _renderStatus = () => {
      if (progress < 100) return '';
      return <Alert severity="success">Successfully uploaded to IPFS!</Alert>;
    }

    // (inner render) render view code button
    const _renderViewCodeButton = () => {
      if (progress < 100) return '';
      return <Button onClick={_handleViewCode} className="btn-2 ml-auto">View code</Button>
    }

    // -- validate
    if ( ! completed ) return <></>

    // -- finally
    return (
      <MyCard className="mt-12">
        
        { _renderStatus() }
        
        <TextField className="mt-12 textfield" fullWidth label="IPFS ID" value={ipfsId} />
        <div className="mt-12 flex">
          <div className="ml-auto flex">
            { _renderViewCodeButton() }
            <Button onClick={handleRegister} className="btn-2 ml-auto">Register Action</Button>
          </div>
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

  const renderDescription = () => {

    return (
      <MyDescription titleId="what are lit actions - title" paragraphs={[
        { id: 'what are lit actions' },
        { id: 'read more', link: APP_LINKS.WORKING_WITH_LIT_ACTIONS },
      ]}/>
    )

  }

  // (validations)

  return (
    <>
      { renderDescription() }
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