import MainLayout from "../../components/Layouts/MainLayout"
import MyDescription from "../../components/UI/MyDescription"
import PKPOwners from "../../components/Views/PKPOwners"
import { NextPageWithLayout } from "../_app"

const OwnersPage: NextPageWithLayout = () => {

  const renderDescription = () => {

    return (
      <MyDescription titleId="owners page - title" paragraphs={[
        { id: 'owners page' },
      ]}/>
    )

  }
  

  return (
    <>
      { renderDescription() }
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