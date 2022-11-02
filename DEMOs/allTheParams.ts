// This file is auto-generated by tools/getServerlessFunctionTest.mjs 
// Wed Nov 02 2022 14:22:09 GMT+0000 (Greenwich Mean Time)
 export const allTheParams = `
const go = async () => {
  // this is the string "Hello World" for testing
  const toSign = [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100];
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  const sigShare = await LitActions.signEcdsa({ toSign, publicKey: "02c55050b2f1a2f3207452f7a662728ed68f6dd17b8060b07d3af09a801b02f3c0", sigName: "sig1" });
};

// check the params we passed in:
const correctParams = {
  aString: "meow",
  anInt: 42,
  aFloat: 123.456,
  anArray: [1, 2, 3, 4],
  anArrayOfStrings: ["a", "b", "c", "d"],
  anObject: { x: 1, y: 2 },
  anObjectOfStrings: { x: "a", y: "b" },
};

// abort if any of these mismatch.  the signing won't happen.
if (
  aString !== correctParams.aString ||
  anInt !== correctParams.anInt ||
  aFloat !== correctParams.aFloat ||
  JSON.stringify(anArray) !== JSON.stringify(correctParams.anArray) ||
  JSON.stringify(anArrayOfStrings) !==
    JSON.stringify(correctParams.anArrayOfStrings) ||
  JSON.stringify(anObject) !== JSON.stringify(correctParams.anObject) ||
  JSON.stringify(anObjectOfStrings) !==
    JSON.stringify(correctParams.anObjectOfStrings)
) {
  // noooo
  console.log("------------- HEY!  Notice this! -------------");
  console.log("One of the params passed in is not matching");
  console.log("correctParams", JSON.stringify(correctParams));
  console.log(
    "Go and figure out which one below isn't matching correctParams above to debug this"
  );
  console.log("aString: ", aString);
  console.log("anInt: ", anInt);
  console.log("aFloat: ", aFloat);
  console.log("anArray: ", anArray);
  console.log("anArrayOfStrings: ", anArrayOfStrings);
  console.log("anObject: ", anObject),
    console.log("anObjectOfStrings: ", anObjectOfStrings);
  console.log(
    "------------- EXITING LIT ACTION due to above error -------------"
  );
  process.exit(0);
} else {
  console.log('all the params match!')
}




go();
`;