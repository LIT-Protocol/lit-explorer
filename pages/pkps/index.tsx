import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"

const PKPsPage: NextPageWithLayout = () => {

  return (
    <>
    PKPs page
    </>
  )
}

export default PKPsPage

PKPsPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}