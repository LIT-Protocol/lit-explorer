import SearchBar from "../Forms/SearchBar";
import SideNav from "../UI/SideNav";
import throwError from '../../utils/throwError';
import { useRouter } from "next/router";
import { Alert, AlertTitle, Chip } from '@mui/material'
import NavPath from "../UI/NavPath";
import { AppRouter } from "../../utils/AppRouter";
import { I18Provider, LOCALES } from "../Contexts/i18n";
import LanguagePickerModal from "../Modals/LanguagePickerModal";
import { APP_CONFIG, APP_LINKS } from "../../app_config";
import SupportIcon from '@mui/icons-material/Support';
import { useEffect, useState } from "react";

interface MainLayoutProps {
    children: any
}

const MainLayout = (props: MainLayoutProps) => {

    const router = useRouter();

    const [locale, setLocale] = useState(LOCALES.ENGLISH);

    useEffect(() => {

        /**
         * Select default language
         */
        console.log("locale:", locale);
        console.log("[localStorage.getItem('lang')]:", localStorage.getItem('lang'));

        const key = 'lang';

        if( ! localStorage.getItem(key) ){
            localStorage.setItem(key, LOCALES.ENGLISH);
            setLocale(LOCALES.ENGLISH)
        }else{
            setLocale((localStorage.getItem(key) as string))
        }

    }, [])

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

      router.push(AppRouter.getPage(id))
    }

    // -- (event) on select language
    const onSelectLanguage = (value: string) => {

        const lang : any = LOCALES;
        const selectedLocale = lang[value];

        localStorage.setItem('lang', selectedLocale);

        setLocale(selectedLocale);
        
    }


    return (

    <I18Provider locale={locale}>
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
                    <NavPath/>
                    { props.children }
                </div>
            </div>
            {/*  ----- ...Content Wrapper -----*/}
            
            {/* ----- Floating Objects ----- */}
            <div className="support flex">
                {/* <LanguagePickerModal onSelectLanguage={onSelectLanguage}/> */}
                
                <a target="_blank" rel="noreferrer" href={APP_LINKS.LIT_DISCORD}>
                    <Chip onClick={ () => {} } icon={<SupportIcon />} label="Support"/>
                </a>
            </div>
            
            </div>
        </div>
        </I18Provider>
      )
}
export default MainLayout;