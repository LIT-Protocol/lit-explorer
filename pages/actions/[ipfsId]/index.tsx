import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../../_app"
import MonacoEditor from '@monaco-editor/react';
import ActionCodeOptions from "../../../components/Views/Parts/ActionCodeOptions";
import { fetchActionCode } from "../../../utils/fetch";
import { useAppContext } from "../../../components/Contexts/AppContext";
import AddPermittedActionForm from "../../../components/Forms/AddPermittedActionForm";

const ActionsPage: NextPageWithLayout = () => {

  // -- (router)
  const router = useRouter();

  // -- (param)
  const { ipfsId } = router.query;

  // -- (state)
  const [code, setCode] = useState('');

  // -- (app context)
  const { pkpContract } = useAppContext();

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

  // -- (render) a form to allow users to add permitted action to their PKP
  // -- input 1: pkpId
  // -- input 2: user address
  const renderAddPermittedActionsForm = () => {
    return <AddPermittedActionForm ipfsId={(ipfsId as string)} />;
  }

  if ( ! ipfsId ) return <p>ipfsId is not ready</p>
  if ( ! code ) return <p>Loading action code...</p>

  return (
    <>
      { renderHeader() }
      { renderCode() }
      { renderAddPermittedActionsForm() }
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