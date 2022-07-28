import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"

const OwnersPage: NextPageWithLayout = () => {

  return (
    <>
    Owners page with params
    </>
  )
}

export default OwnersPage

OwnersPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}