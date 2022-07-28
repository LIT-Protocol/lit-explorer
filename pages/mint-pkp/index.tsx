import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"

const MintPKPPage: NextPageWithLayout = () => {

  return (
    <>
    Mint PKP page
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