// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Fri Jul 05 2024 13:38:02 GMT+0100 (British Summer Time)
 export const nesting = `
const nestedSigning = async () => {
  // this Lit Action simply requests an ECDSA signature share from the Lit Node
  const resp = await Lit.Actions.call({
    ipfsId: "QmRwN9GKHvCn4Vk7biqtr6adjXMs7PzzYPCzNCRjPFiDjm",
    params: {
      // this is the string "Hello World" for testing
      toSign: [65, 208, 164, 167, 229, 220, 187, 13, 166, 2, 199, 95, 102, 221, 126, 115, 126, 3, 246, 254, 177, 16, 113, 222, 120, 95, 209, 63, 254, 29, 52, 240],
      publicKey,
      sigName: "childSig",
    },
  });

  console.log("results: ", resp);
};

// you could have various child lit actions that are run depending on the jsParams
if (functionToRun === "nestedSigning") {
  nestedSigning();
}
`;