import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import MyDescription from "../../components/UI/MyDescription";
import RLIs from "../../components/Views/RLIs";
import RLITotalSupply from "../../components/Views/Stats/RLITotalSupply";
import Refreshable from "../../components/ViewModels/Refreshable";
import FormMintRLI from "../../components/Forms/FormMintRLI";
import { useState } from "react";

const RLIsPage: NextPageWithLayout = () => {

  const [refresh, onRefresh] = useState(0);

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
      <>
        Total Supply: <RLITotalSupply/>
      </>
    )
  }
  

  return (
    <>
      { renderDescription() }
      { renderStats() }

      <Refreshable refresh={refresh}>
        <FormMintRLI onMint={() => onRefresh(prev => prev + 1)}/>
        <RLIs/>
      </Refreshable>
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