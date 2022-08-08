import { NextPageWithLayout } from "../pages/_app"
import CardInputs, { MyFormData, MyProgress } from "../components/CardInputs"
// import getPKPNFTContract from "../utils/blockchain/getPKPNFTContract";
import getWeb3Wallet from "../utils/blockchain/getWeb3Wallet";
// import { Contract, ethers } from "ethers";
import throwError from "../utils/throwError";
import { useState } from "react";
import { newObjectState } from "../utils/clone";
import { useRouter } from "next/router";
// import getPubkeyRouterAndPermissionsContract from "../utils/blockchain/getPubkeyRouterAndPermissionsContract";
import { tryUntil, TryUntilProp } from "../utils/tryUntil";
import { AppRouter } from "../utils/AppRouter";
// import { PKPContract } from "../utils/blockchain/contracts/PKPContract";
// import { APP_CONFIG, SupportedNetworks } from "../app_config";
// import { RouterContract } from "../utils/blockchain/contracts/RouterContract";
// import { wait } from "../utils/utils";
// import { wei2eth } from "../utils/converter";
import { useAppContext } from "./AppContext";
import { hexToDecimal } from "../utils/converter";

const MintNewPKP: NextPageWithLayout = () => {

  // -- app context
  const appContext = useAppContext();
  const { pkpContract, routerContract } = appContext;

  const router = useRouter();

  // -- states
  const [mintProgress, setMintProgress] = useState<MyProgress>({progress: 0, message: ''})
  const [mintButtonText, setMintButtonText] = useState('Mint');
  const [mintedPKPId, setMintedPKPId] = useState<any>();

  // // -- (prepare fields)
  // const mintNewPKPFields = [
  //   {
  //     title: 'Token ID',
  //     label: 'eg. 0xe6b4c652897ba545687b60b566d8d47c8e6d5770085d59a58dafac07012d09c8',
  //   }
  // ];

  // // -- (getter) (smart contract) Get mint cost
  // const getMintCost = async (contract: Contract) => {

  //   const cost = await contract.mintCost();

  //   return {
  //     value: cost,
  //   };

  // }

  // // -- (getter) get token id
  // const getTokenID = (formData: MyFormData) => {

  //   const tokenId = formData.find((item) => item.id == mintNewPKPFields[0].title)?.data;

  //   // -- validate
  //   if( ! tokenId?.includes('0x') ){
  //     throwError("Invalid input - Token ID must begin with 0x");
  //     return null
  //   }

  //   return ethers.BigNumber.from(tokenId);

  // }
  
  // -- (void) redirect
  const redirect = async () => {
    const page = AppRouter.getPage(mintedPKPId);
    router.push(page);
    return;
  }

  // -- (void) mint
  const mint = async (formData: MyFormData) => {
    console.log("[mint] formData:", formData)

    // ===== STEP =====
    setMintProgress(newObjectState(mintProgress, {
      progress: 50,
      message: 'Getting mint cost...'
    }))

    const mintCost = await pkpContract.read.mintCost();
    console.log("mintCost:", mintCost);

    // ===== STEP =====
    try{
      setMintProgress(newObjectState(mintProgress, {
        progress: 75,
        message: `Cost ${mintCost.eth} to mint, minting...`
      }))
      
      const mintRes = await pkpContract.write.mint({
        value: mintCost.arg
      });

      const tokenId = mintRes.tokenId;

      setMintedPKPId(hexToDecimal(tokenId));
  
      const isRouted = await tryUntil({
        onlyIf: async () => await routerContract.read.isRouted(tokenId),
        thenRun: async () => true,
        onTrying: (counter: number) => {
          setMintProgress(newObjectState(mintProgress, {
            progress: 75 + counter,
            message: `${counter} waiting for confirmation...`
          }))
        },
        onError: (props: TryUntilProp) => {
          throwError(`Failed to execute: ${props}`);
        },
        interval: 3000,
      });

      console.log("isRouted:", isRouted)

      setMintProgress(newObjectState(mintProgress, {
        progress: 100,
        message: 'Congratulation! You have minted a PKP!'
      }))
  
      setMintButtonText("Go view your PKP!");

    }catch(e: any){
      setMintProgress(newObjectState(mintProgress, {
        progress: 0,
        message: ''
      }))
      throwError(e.message)
      return;
    }

    return;
  }
  
  /**
   * -- (void) when submit button is clicked, decide which 
   * action to perform based on the mint progress
   * 
   * @param { MyFormData } formData 
   * @returns { void }
   */
  const onSubmit = async (formData: MyFormData) => {

    const progress = mintProgress?.progress ?? 0;

    // when progress is 100%
    if( progress >= 100){
      await redirect();
      return;
    }

    await mint(formData);
  }

  return (
    <>
      <CardInputs
        title={'Mint New PKP'}
        buttonText={mintButtonText}
        // fields={mintNewPKPFields}
        onSubmit={onSubmit}
        progress={mintProgress}
        fullWidth={true}
      />
    </>
  )
}

export default MintNewPKP