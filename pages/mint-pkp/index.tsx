import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import MintNewPKP from "../../components/MintNewPKP";

const MintPKPPage: NextPageWithLayout = () => {

  return (
    <>
      <div className="mt-12">
        <MintNewPKP/>
      </div>
      {/* <div className="mt-12">
        <MintNewPKP/>
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