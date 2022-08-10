import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../../_app"
import MonacoEditor from '@monaco-editor/react';
import ActionCodeOptions from "../../../components/Views/Parts/ActionCodeOptions";
import { fetchActionCode } from "../../../utils/fetch";
import AddPermittedActionForm from "../../../components/Forms/AddPermittedActionForm";
import RevokePermittedActionForm from "../../../components/Forms/RevokePermittedActionForm";
import MyCard from "../../../components/UI/MyCard";
import MyButton from "../../../components/UI/MyButton";
import { wait } from "../../../utils/utils";
import { CircularProgress } from "@mui/material";

const ActionsPage: NextPageWithLayout = () => {

  // -- (router)
  const router = useRouter();

  // -- (param)
  const { ipfsId } = router.query;

  // -- (state)
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // -- (mounted)
  useEffect(() => {
    
    // -- param is not ready
    if(!ipfsId) return;

    (async () => {

      const code = await fetchActionCode((ipfsId as string));

      setCode(code);

    })();

  }, [ipfsId])

  // -- (render) header
  const renderHeader = () => {

    const title = 'Your Lit Action Code';

    return (
      <div className="flex">
        <h2>{ title }</h2> 
        <div className="flex-content">
          <ActionCodeOptions ipfsId={ipfsId} />
        </div>
      </div>
    )
  }

  // -- (render) content
  const renderCode = () => {
    return (
      <div className="code-editor mt-12">
        <MonacoEditor
          language="javascript"
          value={code}
          theme="vs-dark"
          height="300px"
        />
      </div>
    )
  }

  // -- (render) forms
  const renderForms = () => {

    const _renderContent = () => {
      return (
        <>
          <AddPermittedActionForm ipfsId={(ipfsId as string)} onDone={reRender} />
          <RevokePermittedActionForm ipfsId={(ipfsId as string)} onDone={reRender} />    
        </>
      )
    }

    const _renderLoading = () => {
      return (
        <CircularProgress disableShrink />
      )
    }
    
    return (
      <MyCard title="Settings" className="mt-24">
        {
          loading ?
          _renderLoading() :
          _renderContent()
        }
      </MyCard>
    )
  }

  const reRender = async () => {
    setLoading(true);
    await wait(1000);
    setLoading(false);
  }

  if ( ! ipfsId ) return <p>ipfsId is not ready</p>
  if ( ! code ) return <p>Loading action code...</p>

  return (
    <>
      { renderHeader() }
      { renderCode() }
      { renderForms() }
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