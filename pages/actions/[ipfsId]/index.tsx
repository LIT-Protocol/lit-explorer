import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../../_app"
import MonacoEditor from '@monaco-editor/react';
import ActionCodeOptions from "../../../components/Views/Parts/ActionCodeOptions";
import { fetchActionCode } from "../../../utils/fetch";
import FormAddPermittedAction from "../../../components/Forms/FormAddPermittedAction";
import FormRevokePermittedAction from "../../../components/Forms/FormRevokePermittedAction";
import MyCard from "../../../components/UI/MyCard";
import { wait } from "../../../utils/utils";
import { CircularProgress } from "@mui/material";
import FormAddPermittedAddress from "../../../components/Forms/FormAddPermittedAddress";
import { useAppContext } from "../../../components/Contexts/AppContext";
import getWeb3Wallet from "../../../utils/blockchain/getWeb3Wallet";
import MyButton from "../../../components/UI/MyButton";

const ActionsPage: NextPageWithLayout = () => {

  // -- (app context)
  const { pkpContract } = useAppContext();

  // -- (router)
  const router = useRouter();

  // -- (param)
  const { ipfsId } = router.query;

  // -- (state)
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasPKPs, setHasPKPs] = useState(false);

  // -- (mounted)
  useEffect(() => {
    
    // -- param is not ready
    if(!ipfsId) return;

    (async () => {

      const code = await fetchActionCode((ipfsId as string));

      setCode(code);

      // -- check user has PKP
      await checkifUserHasPKPs();


    })();

  }, [ipfsId])

  // -- (void) check has PKP
  const checkifUserHasPKPs = async () => {

    const { ownerAddress } = await getWeb3Wallet();
    
    const tokens = await pkpContract.read.getTokensByAddress(ownerAddress);

    setHasPKPs(tokens.length > 0);
    
  }

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
          <FormAddPermittedAction ipfsId={(ipfsId as string)} onDone={reRender} />
          <FormRevokePermittedAction ipfsId={(ipfsId as string)} onDone={reRender} />    
          <FormAddPermittedAddress ipfsId={(ipfsId as string)} onDone={reRender} />    
        </>
      )
    }

    const _renderLoading = () => {
      return (
        <CircularProgress disableShrink />
      )
    }

    // -- (render) only render this when user has PKPs
    const _renderHasPKPs = () => {
      return (
        <>
          {
            loading ?
            _renderLoading() :
            _renderContent()
          }
        </>
      )
    }

    // -- (render) else render when user has no PKPs
    const _renderNoPKPsFound = () => {
      return (
        <>
          Click here to 
          <MyButton onClick={() => { router.push('/mint-pkp'); }}>mint</MyButton> 
          one!
        </>
      )
    }
    
    return (
      <MyCard title={hasPKPs ? 'Settings' : 'Oops.. It seems like you don\'t have any PKPs..'} className="mt-24">
        {
          hasPKPs ?
          _renderHasPKPs() :
          _renderNoPKPsFound()
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