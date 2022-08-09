import { useRouter } from "next/router"
import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import PKPsByOwnerAddress from "../../components/Views/PKPsByOwnerAddress";

const OwnersPageById: NextPageWithLayout = () => {

  const router = useRouter();
  const { ownerAddress } = router.query;

  // -- validate
  if ( ! ownerAddress ) return <p>Param is not ready</p>

  // -- final render
  return (
    <PKPsByOwnerAddress ownerAddress={ownerAddress} />
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