import { APP_LINKS } from "../../app_config";
import MainLayout from "../../components/Layouts/MainLayout"
import MyDescription from "../../components/UI/MyDescription";
import Actions from "../../components/Views/Actions";
import { NextPageWithLayout } from "../_app"

const ActionsPage: NextPageWithLayout = () => {

  const renderDescription = () => {

    return (
      <MyDescription titleId="actions page - title" paragraphs={[
        { id: 'actions page' },
        { id: 'read more', link: APP_LINKS.WORKING_WITH_LIT_ACTIONS },
      ]}/>
    )

  }

  return (
    <>
      { renderDescription() }
      <Actions/>
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