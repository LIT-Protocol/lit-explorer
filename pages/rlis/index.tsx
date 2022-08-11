import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import MyDescription from "../../components/UI/MyDescription";
import RLIs from "../../components/Views/RLIs";
import RLITotalSupply from "../../components/Views/Stats/RLITotalSupply";
import MyCard from "../../components/UI/MyCard";

const RLIsPage: NextPageWithLayout = () => {

  const renderDescription = () => {

    return (
      <MyDescription titleId="rlis page - title" paragraphs={[
        { id: 'rlis page' },
      ]}/>
    )

  }

  // -- (render) stats
  const renderStats = () => {
    return (
      <MyCard>
        Total Supply: <RLITotalSupply/>
      </MyCard>
    )
  }
  

  return (
    <>
      { renderDescription() }
      { renderStats() }
      
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