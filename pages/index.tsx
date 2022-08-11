import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import MainLayout from '../components/Layouts/MainLayout';
import type { NextPageWithLayout } from './_app';

const Home: NextPageWithLayout = () => {

  const router = useRouter();

  useEffect(() => {

    router.push('/mint-pkp')

  }, [])

  return (
    <div className="mt-12">
    {/* Home page is empty, try other pages  */}
    <CircularProgress/>
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