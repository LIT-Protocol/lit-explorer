import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import MyDescription from "../../components/UI/MyDescription";
import RLIs from "../../components/Views/RLIs";

const RLIsPage: NextPageWithLayout = () => {

  const renderDescription = () => {

    return (
      <MyDescription titleId="rlis page - title" paragraphs={[
        { id: 'rlis page' },
      ]}/>
    )

  }
  

  return (
    <>
      { renderDescription() }
      <RLIs/>
    </>
  )
}

export default RLIsPage

RLIsPage.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}