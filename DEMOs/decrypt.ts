// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Mon Oct 31 2022 15:59:55 GMT+0000 (Greenwich Mean Time)
 export const decrypt = `
const go = async () => {  
  // this requests a decryption share from the Lit Node
  // the decryption share will be automatically returned in the HTTP response from the node
  const decryptionShare = await LitActions.decryptBls({ toDecrypt, publicKey, decryptionName });
};

go();
`;