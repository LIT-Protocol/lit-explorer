import SearchBar from "../Forms/SearchBar";
import SideNav from "../UI/SideNav";
import throwError from '../../utils/throwError';
import { useRouter } from "next/router";
import { Alert, AlertTitle, Button, Chip, Snackbar, Stack } from '@mui/material'
import NavPath from "../UI/NavPath";
import { AppRouter } from "../../utils/AppRouter";
import { I18Provider, LOCALES } from "../Contexts/i18n";
import { APP_LINKS, STORAGE_KEYS } from "../../app_config";
import SupportIcon from '@mui/icons-material/Support';
import { useEffect, useState } from "react";
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { AppContextProvider, useAppContext } from "../Contexts/AppContext";
import SEOHeader from "../Contexts/SEOHeader";
import CloseIcon from '@mui/icons-material/Close';

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
        const key = STORAGE_KEYS.LANG;
        console.log("[locale] state<locale>:", locale);
        console.log(`[localStorage.getItem('${key}')]:`, localStorage.getItem(key));

        if( ! localStorage.getItem(key) ){
            localStorage.setItem(key, LOCALES.ENGLISH);
            setLocale(LOCALES.ENGLISH)
        }else{
            setLocale((localStorage.getItem(key) as string))
        }

    }, [])

    // -- (event) on select language
    const onSelectLanguage = (value: string) => {

        const lang : any = LOCALES;
        const selectedLocale = lang[value];

        localStorage.setItem(STORAGE_KEYS.LANG, selectedLocale);

        setLocale(selectedLocale);
        
    }

    const clearMessage = () => {
        console.log("clear message");

        const globalMessage = document.getElementById('global-message-success') as HTMLDivElement;

        const globalMessageTitle = document.getElementById('global-message-success-title') as HTMLDivElement;
    
        const globalMessageContent = document.getElementById('global-message-success-content') as HTMLDivElement;

        
        clearTimeout(window.messageTimeout)

        globalMessage.style.display = 'none';
        globalMessageTitle.innerText = '';
        globalMessageContent.innerText = '';
        
    }

    return (
        <>
            <SEOHeader/>
            <I18Provider locale={locale}>
                
                <div className="app-context">

                    {/* <Snackbar open={true} autoHideDuration={6000} onClose={() => {}}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                        <Alert onClose={() => {}} severity="success" sx={{ width: '100%' }}>
                        This is a success message!
                        </Alert>
                    </Snackbar> */}

                    {/* ----- Error message ----- */}
                    <div id="global-message">
                        <CloseIcon className="closeBtn" onClick={clearMessage}/>
                        <Alert severity="error">
                            <AlertTitle id="global-message-title">Error</AlertTitle>
                            <div id="global-message-content">123</div>
                        </Alert>
                    </div>

                    {/* ----- Info Message ----- */}
                    <div id="global-message-success">
                        <CloseIcon className="closeBtn" onClick={clearMessage}/>
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
                            { props.children }
                        </div>
                        {/*  ----- ...Content Wrapper -----*/}
                        
                    </div>
                    
                    {/* ----- Floating Footer ------ */}
                    <div className="support flex">
                        {/* <LanguagePickerModal onSelectLanguage={onSelectLanguage}/> */}
                        
                        <div className="ml-auto flex">
                            <a target="_blank" rel="noreferrer" href={APP_LINKS.LIT_DISCORD}>
                                <Chip onClick={ () => {} } icon={<SupportIcon />} label="Support"/>
                            </a>
                        </div>
                    </div>
                    
                </div>
            </I18Provider>
        </>
      )
}
export default MainLayout;