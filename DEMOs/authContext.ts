// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Thu Nov 03 2022 14:20:45 GMT+0000 (Greenwich Mean Time)
 export const authContext = `
const go = async () => {
  Lit.Actions.setResponse({response: JSON.stringify({"Lit.Auth": Lit.Auth})})
};

go();
`;