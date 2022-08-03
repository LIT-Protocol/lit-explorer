import MainLayout from "../../components/MainLayout"
import { NextPageWithLayout } from "../_app"
import CardInputs from "../../components/CardInputs"

const MintPKPPage: NextPageWithLayout = () => {

  return (
    <>
      <CardInputs
        title={'Mint New PKP'}
        buttonText={'MINT'}
        fields={[
          {
            title: 'Token ID',
            label: 'eg. 0xe6b4c652897ba545687b60b566d8d47c8e6d5770085d59a58dafac07012d09c8',
          },
          {
            title: 'Signature',
            label: 'Signature',
          }
      ]}
      />
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