// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Thu Dec 08 2022 11:21:30 GMT+0000 (Greenwich Mean Time)
 export const authContext = `
const go = async () => {
  Lit.Actions.setResponse({response: JSON.stringify({"Lit.Auth": Lit.Auth})})
};

go();
`;