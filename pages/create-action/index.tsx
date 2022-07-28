import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import MonacoEditor from '@monaco-editor/react';
import { useState } from "react";

const CreateAction: NextPageWithLayout = () => {

const litActionCode = `const go = async () => {  
    // this requests a decryption share from the Lit Node
    // the decryption share will be automatically returned in the HTTP response from the node
    const decryptionShare = await LitActions.decryptBls({ toDecrypt, keyId, decryptionName });
};
    
go();`;

const [code, setCode] = useState(litActionCode);


  return (
    <>
    <h1>Create Lit Action</h1>
    <p>
        <a target="_blank" rel="noreferrer" href="https://developer.litprotocol.com/LitActionsAndPKPs/workingWithLitActions">
            Documentation
        </a>
    </p>
        <div className="code-editor">
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

export default CreateAction

CreateAction.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}