import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import MonacoEditor from '@monaco-editor/react';
import { useEffect, useState } from "react";
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import uploadToIPFS from "../../utils/ipfs/upload";
import throwError from "../../utils/throwError";
import { useRouter } from "next/router";
import { AppRouter } from "../../utils/AppRouter";
import MyProgress from "../../components/UI/MyProgress";
import MyCard from "../../components/UI/MyCard";
import { APP_CONFIG, APP_LINKS, DEFAULT_LIT_ACTION } from "../../app_config";
import { tryUntil } from "../../utils/tryUntil";
import MyDescription from "../../components/UI/MyDescription";
import { preventPageLeave } from "../../utils/utils";
import * as demos from '../../DEMOs/index';

const CreateAction: NextPageWithLayout = () => {

  const router = useRouter();

  // -- (state)
  const [code, setCode] = useState(DEFAULT_LIT_ACTION);
  const [msg, setMsg] = useState('Loading...');
  const [progress, setProgress] = useState(0);
  const [ipfsId, setIpfsId] = useState<string | any>();
  const [completed, setCompleted] = useState(false);
  const [demoIndex, setDemoIndex] = useState(8);

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

    preventPageLeave();
    
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
        setMsg(`Pinning...`);
      },
      onError: (_: any) => {
        throwError("Failed to check the pinning status, maybe check again in 5 mins");
        return;
      },
      max: 40,
      interval: 3000,
    })

    
    console.log("[handleUpload] isPinned:", isPinned);
    
    setMsg('Done!');
    setProgress(100);
    preventPageLeave({ reset: true });

  }

  /**
   * (render) render progress UI
   */
  const renderProgress = () => {

    // -- validate
    if(progress <= 0 || progress >= 100) return <></>

    // -- finally
    return <MyProgress value={progress} message={msg} />

  }

  const onSelectDemo = (demo: any) => {

    const code = (demos as any)[demo.target.value];

    setCode(code);
    
    // find index by value
    const index = Object.keys(demos).findIndex((key) => (demos as any)[key] === code);
    setDemoIndex(index);
  }
  /*
  * (render) render lit action demo select
  */
 const renderDemoSelect = () => {
    return (
      <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Select Example</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={Object.keys(demos)[demoIndex]}
        label="Select Example"
        onChange={onSelectDemo}
      >
        {
          Object.keys(demos).map((key) => {
            return <MenuItem key={key} value={key}>{key}</MenuItem>
          })
        }
      </Select>
    </FormControl>
    );
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
      if (progress < 100) return <Button disabled className="btn-2 ml-auto">View Code</Button>;

      return <Button onClick={_handleViewCode} className="btn-2 ml-auto">View Code</Button>
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

        <div className="flex">

        <div className="mr-12 w-240 mt-12">
            { renderDemoSelect() }
          </div>

          <div className="code-editor mt-12 width-full">
              <MonacoEditor
                  language="javascript"
                  onChange={(code) => onEdit(code)}
                  value={code}
                  theme="vs-dark"
                  height="300px"
              />
          </div>

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