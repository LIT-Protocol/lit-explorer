import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import FormMintNewPKP from "../../components/Forms/FormMintPKP";

const MintPKPPage: NextPageWithLayout = () => {
  return (
    <>
      <div className="mt-12">
        <FormMintNewPKP/>
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