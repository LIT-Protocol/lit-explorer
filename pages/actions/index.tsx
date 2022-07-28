import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"

const ActionsPage: NextPageWithLayout = () => {

  return (
    <>
    Actions page
    </>
  )
}

export default ActionsPage

ActionsPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}