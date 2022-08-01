import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import MonacoEditor from '@monaco-editor/react';
import ActionCodeStatus from "../../components/ActionCodeStatus";

const ActionsPage: NextPageWithLayout = () => {

  const router = useRouter();
  const { id } = router.query;

  const [isLoading, setLoading] = useState(false)
  const [code, setCode] = useState('');

  useEffect(() => {

    setLoading(true);

    if(!id) return;

    const baseURL = process.env.NEXT_PUBLIC_IPFS_BASE_URL ?? '';

    const url = `${baseURL}/${id}`;

    fetch(url).then((response) => response.text()).then((code) => {
      console.log("baseURL:", baseURL);
      console.log("url:", url);
      console.log(code)
      setCode(code);
    });


  }, [id])

  if ( ! id ) return <p>Param is not ready</p>
  if ( ! code ) return <p>Loading data...</p>

  return (
    <>
    <div className="flex">
      <h2>Your Lit Action Code</h2> 
      <div className="flex-content">
        <ActionCodeStatus ipfsId={id}/>
      </div>
    </div>
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