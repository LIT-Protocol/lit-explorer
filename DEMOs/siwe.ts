// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Thu Dec 08 2022 11:21:30 GMT+0000 (Greenwich Mean Time)
 export const siwe = `
const go = async () => {  
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.ethPersonalSignMessageEcdsa({ message, publicKey , sigName });
};

go();
`;