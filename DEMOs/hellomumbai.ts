// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Mon Oct 31 2022 15:59:55 GMT+0000 (Greenwich Mean Time)
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