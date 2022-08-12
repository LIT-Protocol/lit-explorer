import { NextPageWithLayout } from "../../pages/_app"
import FormInputFields, { MyFormData, MyProgressI } from "./FormInputFields"
import throwError from "../../utils/throwError";
import { useState } from "react";
import { newObjectState } from "../../utils/clone";
import { useRouter } from "next/router";
import { tryUntil, TryUntilProp } from "../../utils/tryUntil";
import { AppRouter } from "../../utils/AppRouter";
import { useAppContext } from "../Contexts/AppContext";
import { hexToDecimal } from "../../utils/converter";

const FormMintNewPKP: NextPageWithLayout = () => {

  // -- app context
  const appContext = useAppContext();
  const { pkpContract, routerContract } = appContext;

  const router = useRouter();

  // -- states
  const [mintProgress, setMintProgress] = useState<MyProgressI>({progress: 0, message: ''})
  const [mintButtonText, setMintButtonText] = useState('Mint');
  const [mintedPKPId, setMintedPKPId] = useState<any>();
  
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
    <FormInputFields
      title={'Mint New PKP'}
      buttonText={mintButtonText}
      // fields={FormMintNewPKPFields}
      onSubmit={onSubmit}
      progress={mintProgress}
      fullWidth={true}
    />
  )
}

export default FormMintNewPKP