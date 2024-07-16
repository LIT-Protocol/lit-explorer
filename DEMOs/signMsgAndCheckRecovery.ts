// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Fri Jul 05 2024 13:38:02 GMT+0100 (British Summer Time)
 export const signMsgAndCheckRecovery = `
const go = async () => {  
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.ethPersonalSignMessageEcdsa({ message, publicKey , sigName });
};

go();
`;