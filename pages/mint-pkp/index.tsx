import MainLayout from "../../components/Layouts/MainLayout"
import { NextPageWithLayout } from "../_app"
import FormMintNewPKP from "../../components/Forms/FormMintPKP";
import { APP_LINKS } from "../../app_config";
import MyDescription from "../../components/UI/MyDescription";

const MintPKPPage: NextPageWithLayout = () => {

  return (
    <>
      <div className="mt-12">

        <MyDescription 
          titleId="what is pkp - title"
          paragraphs={[
            {id: 'what is pkp'},
            {id: 'read more', link: APP_LINKS.WHAT_IS_PKP},
          ]}
        />

        <FormMintNewPKP/>
      </div>
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