// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Fri Apr 07 2023 19:22:38 GMT+0100 (British Summer Time)
 export const litConditions = `
const go = async () => {
  // test an access control condition
  const testResult = await LitActions.checkConditions({conditions, authSig, chain})

  console.log('testResult', testResult)

  // only sign if the access condition is true
  if (!testResult){
    return;
  }

  // this is the string "Hello World" for testing
  const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey: "1", sigName: "sig1" });
};



go();
`;