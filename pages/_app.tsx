import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ReactNode } from 'react';
import { NextPage } from 'next';

import NProgress from 'nprogress';
import "nprogress/nprogress.css";
import Router from 'next/router';
import AppContext from '../components/AppContext';

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export type Props = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: Props) {
  
  // get layout from component or use default
  const getLayout = Component.getLayout || ((page: any) => page)
  
  return getLayout(
      <>
        <AppContext>
          <Component {...pageProps} />
        </AppContext>
      </>
  )
}

export default MyApp