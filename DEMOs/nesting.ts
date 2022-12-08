// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Thu Dec 08 2022 11:21:30 GMT+0000 (Greenwich Mean Time)
 export const nesting = `
const signEcdsa = async () => {
  // this Lit Action simply requests an ECDSA signature share from the Lit Node
  const resp = await LitActions.call({
    ipfsId: "Qmb2sJtVLXiNNXnerWB7zjSpAhoM8AxJF2uZsU2iednTtT",
    params: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        "037c9a4097a27573bcda94c2824e92b06204e9a94dbed32fd6506b75d55b4e3c7d",
      sigName: "childSig",
    },
  });

  console.log("results: ", resp);
};

if (functionToRun === "signEcdsa") {
  signEcdsa();
}
`;