// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Mon Oct 31 2022 15:31:51 GMT+0000 (Greenwich Mean Time)
 export const ethers = `
const go = async () => {
  const val = ethers.utils.formatEther(10000)
  LitActions.setResponse({response: JSON.stringify({val})})
};

go();
`;