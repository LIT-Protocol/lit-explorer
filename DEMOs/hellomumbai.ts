// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Thu Nov 03 2022 11:55:42 GMT+0000 (Greenwich Mean Time)
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