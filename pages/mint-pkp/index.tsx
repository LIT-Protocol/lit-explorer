import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import MintNewPKP from "../../components/Forms/MintPKPForm";

const MintPKPPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="mt-12">
        <MintNewPKP/>
      </div>
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