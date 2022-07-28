import MainLayout from '../components/MainLayout';
import type { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {

  return (
    <>
    Main Page
    </>
  )
}

export default Home

Home.getLayout = function getLayout(page: any) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}