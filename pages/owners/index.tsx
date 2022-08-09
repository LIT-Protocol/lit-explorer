import MainLayout from "../../components/MainLayout"
import PKPOwners from "../../components/Views/PKPOwners"
import { NextPageWithLayout } from "../_app"

const OwnersPage: NextPageWithLayout = () => {

  return (
    <>
      <PKPOwners />
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