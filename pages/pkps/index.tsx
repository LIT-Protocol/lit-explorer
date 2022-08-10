import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import PKPs from "../../components/Views/PKPs";

const PKPsPage: NextPageWithLayout = () => {

  return (
    <>
      <PKPs/>
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