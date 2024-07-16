// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Fri Jul 05 2024 13:38:02 GMT+0100 (British Summer Time)
 export const consoleAndResponse = `
const go = async () => {
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the response from the node
  // and combined into a full signature by the LitJsSdk for you to use on the client
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });

  console.log('finished signing!  this is a log statement that will show up in the response under the logs key');

  // you can return anything else extra you want in the response
  const response = JSON.stringify({ signed: "true" });
  LitActions.setResponse({ response });
};

console.log('Running go()');
go();
`;