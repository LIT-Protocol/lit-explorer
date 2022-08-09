import { useRouter } from "next/router"
import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import PKPsByOwnerAddress from "../../components/Views/PKPsByOwnerAddress";
import { useAppContext } from "../../components/AppContext";
import RLIsByOwner from "../../components/Views/RLIsByOwner";

const OwnersPageById: NextPageWithLayout = () => {

  // -- (app context)
  const { rliContract } = useAppContext();

  const router = useRouter();
  const { ownerAddress } = router.query;

  let _ownerAddress : string = (ownerAddress as string);

  // -- validate
  if ( ! ownerAddress ) return <p>Param is not ready</p>

  // -- final render
  return (
    <>
      <PKPsByOwnerAddress ownerAddress={_ownerAddress} />
      <RLIsByOwner key={_ownerAddress} contract={rliContract} ownerAddress={_ownerAddress} />
    </>
  )
}

export default OwnersPageById

OwnersPageById.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}