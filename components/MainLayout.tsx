import SearchBar from "./SearchBar";
import SideNav from "./SideNav";

import * as isIPFS from 'is-ipfs';
import throwError from '../utils/throwError';
import { useRouter } from "next/router";
import { Alert, AlertTitle } from '@mui/material'

enum SearchTypes {
    ETH_ADDRESS = "ETH_ADDRESS",
    IPFS_ID = "IPFS_ID",
    PKP_TOKEN_ID = "PKP_TOKEN_ID"
}

interface MainLayoutProps {
    children: any
}

const MainLayout = (props: MainLayoutProps) => {

    const router = useRouter();

    /**
     * Get the search type from a string
     * 
     * @example
     *   IPFS ID: QmesxxB4NgrwGW1NZBRrbPj95NJL37aZj7Jcbnw2LVQjAW
     *   ETH Address: 0xC285BBcd9d79225E1a08699Ae355d9C52F58a6c7
     *   Token ID: 3096635843933936779942875635488849512907
     * 
     * @param text 
     * @returns { string } type
     */
     const getSearchType = (text: string) => {
      
      if( text.includes('0x') ){
        return SearchTypes.ETH_ADDRESS;
      }
  
      if( ! text.includes('0x') && (parseInt(text).toString()) !== 'NaN'){
        return SearchTypes.PKP_TOKEN_ID;
      }
  
      if( isIPFS.multihash(text) ){
        return SearchTypes.IPFS_ID;
      }
      
      return null;
  
    }
  
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
      const type = getSearchType(text);
  
      // -- validate
      if( type === null ) return;
  
      // -- execute
      if( type === SearchTypes.ETH_ADDRESS){
        // alertMsg('Success', `Found search type ${SearchTypes.ETH_ADDRESS}`)
        router.push(`/owners/${text}`);
      }
  
      if( type === SearchTypes.PKP_TOKEN_ID){
        // alertMsg('Success', `Found search type ${SearchTypes.PKP_TOKEN_ID}`)
        router.push(`/pkps/${text}`);
      }
  
      if( type === SearchTypes.IPFS_ID){
        // alertMsg('Success', `Found search type ${SearchTypes.IPFS_ID}`);
        router.push(`/actions/${text}`);
      }
  
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