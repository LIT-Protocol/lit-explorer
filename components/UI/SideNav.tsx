import { Button, Divider, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormattedMessage } from 'react-intl';

const SideNav = () => {
    const router = useRouter();
    const currentRoute = router.pathname;

    return (
        <>
            <Typography variant="h5" className='title'>
            <div>
                <img src='/svg/logo.svg' alt="Lit Protocol" />
                <Link href="/">Lit Explorer</Link>
            </div>
            </Typography>


            <ul className='ul'>
                <li><Button onClick={() => router.push('/mint-pkp')} className={currentRoute.includes("/mint-pkp") ? "btn active" : "btn"}><FormattedMessage id='Mint New PKP' /></Button></li>
                <li><Button onClick={() => router.push('/create-action')} className={currentRoute.includes("/create-action") ? "btn active" : "btn"}><FormattedMessage id='Create Action' /></Button></li>
            </ul>        

            <Divider className='divider' textAlign="left"><FormattedMessage id='Pages' /></Divider>
            <ul className='ul'>
                <li><Button onClick={() => router.push('/owners')}  className={currentRoute.includes("/owners") ? "btn active" : "btn"}><FormattedMessage id='Owners' /></Button></li>
                <li><Button onClick={() => router.push('/pkps')}  className={currentRoute.includes("/pkps") ? "btn active" : "btn"}><FormattedMessage id='PKPs' /></Button></li>
                <li><Button onClick={() => router.push('/actions')}  className={currentRoute.includes("/actions") ? "btn active" : "btn"}><FormattedMessage id='Actions' /></Button></li>
                <li><Button onClick={() => router.push('/contracts')}  className={currentRoute.includes("/contracts") ? "btn active" : "btn"}><FormattedMessage id='Contracts' /></Button></li>
            </ul> 
        </>
    );
}

export default SideNav;