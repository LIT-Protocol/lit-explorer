// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Mon Oct 31 2022 15:59:55 GMT+0000 (Greenwich Mean Time)
 export const authContext = `
const go = async () => {
  Lit.Actions.setResponse({response: JSON.stringify({"Lit.Auth": Lit.Auth})})
};

go();
`;