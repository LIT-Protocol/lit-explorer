import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import MintNewPKP from "../../components/MintNewPKP";
import { Button } from "@mui/material";
import getPKPNFTContract from "../../utils/blockchain/getPKPNFTContract";
import getWeb3Wallet from "../../utils/blockchain/getWeb3Wallet";
import { ethers } from "ethers";

const MintPKPPage: NextPageWithLayout = () => {

  // -- (smart contract) mint free
  const mintFree = async () => {

    const { signer, addresses } = await getWeb3Wallet();

    const pkpContract = await getPKPNFTContract(signer);

    // const freeMintSigner = await pkpContract.freeMintSigner();
    const freeMintSigner = addresses[0];

    // await pkpContract.setFreeMintSigner(freeMintSigner);

    console.log("[mintFree] freeMintSigner:", freeMintSigner)

    const pubHash = ethers.utils.keccak256(freeMintSigner);

    console.log("[mintFree] pubHash:", pubHash);

    const tokenId = ethers.BigNumber.from(pubHash);

    console.log("[mintFree] tokenId:", tokenId);

    const message = ethers.utils.arrayify(pubHash);
    
    // const sig = "0x92581f80a6df33d423aa3c8f806646b2530c4982bfdf83091c4a6f49ad2c4ec703627b33efe37eaaac2fba1756e86a3cb7e1be0856695c7418ba1f54ee394b081b";
    const sig = await signer.signMessage(message);

    console.log("[mintFree] sig:", sig);
    
    const pk = ethers.utils.recoverPublicKey(pubHash, sig)
    console.log("[mintFree] pk:", pk);
    
    const recoveredAddress = ethers.utils.computeAddress(ethers.utils.arrayify(pk))
    console.log("[mintFree] recoveredAddress:", recoveredAddress);
    
    const msgHash = ethers.utils.hashMessage(message);
    console.log("[mintFree] msgHash:", msgHash);

    const signature = sig.substr(2); //remove 0x
    const r = '0x' + signature.slice(0, 64)
    const s = '0x' + signature.slice(64, 128)
    const v = '0x' + signature.slice(128, 130)

    console.log("[mintFree] r:", r);
    console.log("[mintFree] s:", s);
    console.log("[mintFree] v:", v);

    const mint = await pkpContract.freeMint(tokenId, msgHash, v, r, s);

    console.log("mint:", mint);

  }

  return (
    <>
      <div className="mt-12">
        <MintNewPKP/>
      </div>
      {/* <div className="mt-12">
        <Button onClick={mintFree}>Free Mint Test</Button>
      </div> */}
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