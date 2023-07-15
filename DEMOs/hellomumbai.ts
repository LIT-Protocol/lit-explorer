// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Fri Apr 07 2023 19:22:38 GMT+0100 (British Summer Time)
 export const hellomumbai = `
const go = async () => {
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the response from the node
  // and combined into a full signature by the LitJsSdk for you to use on the client
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
};

go();
`;