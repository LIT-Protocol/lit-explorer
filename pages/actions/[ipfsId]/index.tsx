import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../../_app"
import MonacoEditor from '@monaco-editor/react';
import { fetchActionCode } from "../../../utils/fetch";
import FormAddPermittedAction from "../../../components/Forms/FormAddPermittedAction";
import FormRevokePermittedAction from "../../../components/Forms/FormRevokePermittedAction";
import MyCard from "../../../components/UI/MyCard";
import { Alert, CircularProgress } from "@mui/material";
import { useAppContext } from "../../../components/Contexts/AppContext";
import getWeb3Wallet from "../../../utils/blockchain/getWeb3Wallet";
import MyButton from "../../../components/UI/MyButton";
import { ROUTES } from "../../../app_config";
import ButtonActionRegisterByIPFSId from "../../../components/Forms/ButtonActionRegisterByIPFSId";
import Refreshable from "../../../components/ViewModels/Refreshable";
import MyDescription from "../../../components/UI/MyDescription";

const ActionsPage: NextPageWithLayout = () => {

  // -- (app context)
  const { pkpContract, routerContract } = useAppContext();

  // -- (router)
  const router = useRouter();

  // -- (param)
  const { ipfsId } = router.query;

  // -- (state)
  const [code, setCode] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [hasPKPs, setHasPKPs] = useState(false);
  const [actionRegistered, setActionRegistered] = useState(false);
  const [counter, setCounter] = useState(5);

  // -- (mounted)
  useEffect(() => {
    
    // -- param is not ready
    if( ! ipfsId ) return;

    (async () => {

      const error = 'The owner of this gateway does not have this content pinned to their Pinata account. In order to view this content, please reach out to the owner. - ERR_ID:00006';

      let code : any = null;

      if ( counter >= 5){
        code = await fetchActionCode((ipfsId as string));
      }

      if ( code ===  error|| code === null){
        setCode('404');

        setTimeout(() => {
          
          setCounter(prev => prev - 1);

          if( counter <= 0){
            setCounter(5);
          }

        }, 1000);
      }else{
        setCode(code);
        clearTimeout();
      }


      // -- checks
      await checkifUserHasPKPs();
      await checkIfActionRegistered();


    })();

    return () => {
      clearTimeout();
    }

  }, [ipfsId, counter])

  // -- (void) check has PKP
  const checkifUserHasPKPs = async () => {

    const { ownerAddress } = await getWeb3Wallet();
    
    const tokens = await pkpContract.read.getTokensByAddress(ownerAddress);

    setHasPKPs(tokens.length > 0);
    
  }

  // -- (void) check if action is registered
  const checkIfActionRegistered = async () => {
    const _isRegistered = await routerContract.read.isActionRegistered((ipfsId as string));
    setActionRegistered(_isRegistered);
  }

  // -- (render) render description
  const renderDescription = () => {
    return <MyDescription 
      titleId={'action page - title'} 
      paragraphs={[{id: 'action page'}]}      
    />
  }

  // -- (render) header
  const renderHeader = () => {

    const title = 'Your Lit Action Code';

    return (
      <div className="flex">
        <h2>{ title }</h2> 
        {/* <div className="flex-content">
          <ButtonActionRegisterByIPFSId ipfsId={ipfsId} onDone={reRender}/>
        </div> */}
      </div>
    )
  }

  // -- (render) content
  const renderCode = () => {

    if( code === '404' ){
      return (
        <>
          404 - Code is not ready or it does not exist. Please try again later. <br/>
          { counter <= 0 ? <CircularProgress/> : `Refershing in ${counter} second${counter > 1 ? 's' : ''}...`}
          
        </>
      )
    }

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

    // -- (inner render)
    const _renderLoading = () => {
      return (
        <MyCard title={'Loading action settings...'} className="mt-24">
          <CircularProgress/>
        </MyCard>
      )
    }

    // -- (inner render) else render when user has no PKPs
    const _renderNoPKPsFound = () => {
      return (
        <MyCard title={'Oops.. It seems like you don\'t have any PKPs..'} className="mt-24">
          <MyButton onClick={() => { router.push(ROUTES.MINT_PKP); }}>Click here to mint one!</MyButton> 
        </MyCard>
      )
    }

    // -- (inner render) render when action is not registered
    const _renderActionNotRegistered = () => {
        
      return (
        <MyCard className="mt-24" title="Action is not registered!">
          <Alert severity="info">Registering your code allows you to set/unset which PKP and addresses that have permission to execute this code. </Alert>
        </MyCard>
      )
    }


    // -- (validations)
    if( ! hasPKPs && ! actionRegistered) return _renderLoading();
    if( ! hasPKPs ) return _renderNoPKPsFound();
    // if( ! actionRegistered ) return _renderActionNotRegistered();
    if ( code === '404' ) return <></>
    // -- (finally)
    return (
      <MyCard title={'PKP & Lit Action Settings'} className="mt-24">

          <FormAddPermittedAction ipfsId={(ipfsId as string)} onDone={reRender} />

          <FormRevokePermittedAction ipfsId={(ipfsId as string)} onDone={reRender} />
          
          {/* <FormAddPermittedAddress ipfsId={(ipfsId as string)}  />     */}
      </MyCard>
    )
  }

  const reRender = async () => {
    console.log("[reRender]");
    setRefresh(prev => prev + 1)
    await checkifUserHasPKPs();
    await checkIfActionRegistered();
  }

  if ( ! ipfsId ) return <p>ipfsId is not ready</p>
  if ( ! code ) return <p>Loading action code...</p>

  return (
    <>      
      { renderDescription() }
      { renderHeader() }
      { renderCode() }
      <Refreshable refresh={refresh} >
        { renderForms() }
      </Refreshable>
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