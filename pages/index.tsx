import MainLayout from '../components/Layouts/MainLayout';
import type { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {

  return (
    <div className="mt-12">
    Home page is empty, try other pages 
    </div>
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