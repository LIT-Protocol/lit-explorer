import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import CardInputs, { MyFormData, MyProgress } from "../../components/CardInputs"
import getPKPNFTContract from "../../utils/blockchain/getPKPNFTContract";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import { Contract, ethers } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";
import throwError from "../../utils/throwError";
import alertMsg from "../../utils/alertMsg";
import { useState } from "react";
import { newObjectState } from "../../utils/clone";
import { useRouter } from "next/router";
import { RouterPush } from "../../utils/RouterPush";
import getPubkeyRouterAndPermissionsContract from "../../utils/blockchain/getPubkeyRouterAndPermissionsContract";
import tryUntil from "../../utils/tryUntil";

const MintPKPPage: NextPageWithLayout = () => {

  const router = useRouter();

  // -- states
  const [mintProgress, setMintProgress] = useState<MyProgress>({progress: 0, message: ''})
  const [mintButtonText, setMintButtonText] = useState('Mint');

  // -- (prepare fields)
  const mintNewPKPFields = [
    {
      title: 'Token ID',
      label: 'eg. 0xe6b4c652897ba545687b60b566d8d47c8e6d5770085d59a58dafac07012d09c8',
    }
  ];

  // -- (getter) (smart contract) Get mint cost
  const getMintCost = async (contract: Contract) => {

    const cost = await contract.mintCost();

    return {
      value: cost,
    };

  }

  // -- (getter) get token id
  const getTokenID = (formData: MyFormData) => {

    const tokenId = formData.find((item) => item.id == mintNewPKPFields[0].title)?.data;

    // -- validate
    if( ! tokenId?.includes('0x') ){
      throwError("Invalid input - Token ID must begin with 0x");
      return null
    }

    return ethers.BigNumber.from(tokenId);

  }

  // -- (void) mint
  const onSubmit = async (formData: MyFormData) => {

    const progress = mintProgress?.progress ?? 0;

    // when progress is 100%
    if( progress >= 100){

      const { addresses } = await getWeb3Wallet();
      RouterPush.owner(router, addresses[0]);
      return;
    }


    console.log("[mint] formData:", formData)

    // -- prepare smart contract calls
    const { signer } = await getWeb3Wallet();
    const pkpContract = await getPKPNFTContract(signer);
    const routerContract = await getPubkeyRouterAndPermissionsContract(signer);

    // -- prepare input 1
    const tokenId = getTokenID(formData);

    if( ! tokenId ) return

    console.log("[mint] TokenID:", tokenId);

    // -- prepare input 2
    setMintProgress(newObjectState(mintProgress, {
      progress: 50,
      message: 'Getting mint cost...'
    }))
    const mintCost = await getMintCost(pkpContract);

    console.log("[mint] mintCost:", mintCost)


    // -- submit inputs
    let callMint;
    
    try{
      setMintProgress(newObjectState(mintProgress, {
        progress: 75,
        message: 'Minting...'
      }))
      
      callMint = await pkpContract.mint(tokenId, mintCost);
      console.log("[mint] callMint:", callMint);
  
      const isRouted = await tryUntil({
        onlyIf: async () => await routerContract.isRouted(tokenId),
        thenRun: async () => true,
        onTrying: (counter: number) => {
          setMintProgress(newObjectState(mintProgress, {
            progress: 75 + counter,
            message: `${counter} waiting for confirmation...`
          }))
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
      throwError(e.message)
      return;
    }
    

  }

  return (
    <>
      <CardInputs
        title={'Mint New PKP'}
        buttonText={mintButtonText}
        fields={mintNewPKPFields}
        onSubmit={onSubmit}
        progress={mintProgress}
      />
    </>
  )
}

export default MintPKPPage

MintPKPPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}