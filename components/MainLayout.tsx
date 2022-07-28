import SearchBar from "./SearchBar";
import SideNav from "./SideNav";

import throwError from '../utils/throwError';
import { useRouter } from "next/router";
import { Alert, AlertTitle } from '@mui/material'
import pushPage from "../utils/pushPage";

interface MainLayoutProps {
    children: any
}

const MainLayout = (props: MainLayoutProps) => {

    const router = useRouter();

    /**
     * 
     * Event: when user is typing on the search bar
     * 
     * @param { any } e event
     * @returns { void } 
     */
      const onSearch = (e: any): void => {
  
      // -- config
      const MIN_LENGTH = 20;
      
      // -- prepare
      const keyboardKey = e.key;
      const text = (document.getElementById('search-bar') as HTMLInputElement).value;
  
      // -- validate
      if( keyboardKey && keyboardKey !== 'Enter') return;
      if( text.length <= MIN_LENGTH){
        throwError(`Search length cannot be less than ${MIN_LENGTH} characters`)
      };
  
      // -- prepare
      const id = text;

      pushPage(id, router);
  
    }

    return (

        <div className="app-context">

            {/* ----- Error message ----- */}
            <div id="global-message">
                <Alert severity="error">
                    <AlertTitle id="global-message-title">Error</AlertTitle>
                    <div id="global-message-content">123</div>
                </Alert>
            </div>

            {/* ----- Info Message ----- */}
            <div id="global-message-success">
                <Alert severity="success">
                    <AlertTitle id="global-message-success-title"></AlertTitle>
                    <div id="global-message-success-content"></div>
                </Alert>
            </div>

            <div className="layout-wrapper">
        
            {/* ----- Left Side ----- */}
            <div className="side-wrapper">
                <SideNav/>
            </div>
            {/* ----- ... Left Side ----- */}
        
            {/*  ----- Content Wrapper -----*/}
            <div className="content-wrapper">
                <SearchBar onSearch={onSearch} />
                
                <div id="main-dynamic-content">
                    { props.children }
                </div>
            </div>
            {/*  ----- ...Content Wrapper -----*/}
            
            </div>

        </div>

      )
}
export default MainLayout;