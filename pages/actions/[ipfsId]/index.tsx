import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../../components/MainLayout"
import { NextPageWithLayout } from "../../_app"
import MonacoEditor from '@monaco-editor/react';
import ActionCodeOptions from "../../../components/Views/Parts/ActionCodeOptions";
import MyProgress from "../../../components/UI/MyProgress";
import { MyProgressI } from "../../../components/UI/CardInputs";

const ActionsPage: NextPageWithLayout = () => {

  const router = useRouter();
  const { ipfsId } = router.query;

  const [code, setCode] = useState('');
  const [progress, setProgress] = useState<MyProgressI>();

  const [refresh, setRefresh] = useState(0);

  // -- (mounted)
  useEffect(() => {
    
    // -- param is not ready
    if(!ipfsId) return;

    const baseURL = process.env.NEXT_PUBLIC_IPFS_BASE_URL ?? '';

    const url = `${baseURL}/${ipfsId}`;

    fetch(url).then((response) => response.text()).then((code) => {
      console.log("baseURL:", baseURL);
      console.log("url:", url);
      // console.log(code)
      setCode(code);
    });


  }, [ipfsId])

  // -- (event:callback) onProgress
  const onProgress = async (props: MyProgressI) => {

    const progress = props.progress ?? 0;

    console.log("[onProgress] props:", props);
    setProgress(props);

    if(progress >= 100){
      console.log("[onProgress] 100%");
      setRefresh(prev => prev + 1);
    }

  }

  // -- (render) progress from callbacks
  const renderProgress = () => {

    const _progress = progress?.progress || 0;
    const _message = progress?.message || '';

    // -- validate
    if(_progress <= 0) return <></>

    return (
      <MyProgress message={_message} value={_progress}/>
    )

  }

  if ( ! ipfsId ) return <p>ipfsId is not ready</p>
  if ( ! code ) return <p>Loading data...</p>

  return (
    <>

      { renderProgress() }

      {/* ----- header ----- */}
      <div className="flex">
        <h2>Your Lit Action Code</h2> 
        <div className="flex-content">
          <ActionCodeOptions 
            ipfsId={ipfsId}
            onProgress={onProgress}
            refresh={refresh} 
          />
        </div>
      </div>

      {/* ----- content ----- */}
      <div className="code-editor mt-12">
        <MonacoEditor
          language="javascript"
          value={code}
          theme="vs-dark"
          height="300px"
        />
      </div>
    </>
  )
}

export default ActionsPage

ActionsPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}