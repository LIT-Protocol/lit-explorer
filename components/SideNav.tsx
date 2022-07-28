import { Button, Divider, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";

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
                <li><Button onClick={() => router.push('/mint-pkp')} className={currentRoute.includes("/mint-pkp") ? "btn active" : "btn"}>Mint New PKP</Button></li>
                <li><Button onClick={() => router.push('/create-action')} className={currentRoute.includes("/create-action") ? "btn active" : "btn"}>Create Action</Button></li>
            </ul>        

            <Divider className='divider' textAlign="left">PAGES</Divider>
            <ul className='ul'>
                <li><Button onClick={() => router.push('/owners')}  className={currentRoute.includes("/owners") ? "btn active" : "btn"}>Owners</Button></li>
                <li><Button onClick={() => router.push('/pkps')}  className={currentRoute.includes("/pkps") ? "btn active" : "btn"}>PKPS</Button></li>
                <li><Button onClick={() => router.push('/actions')}  className={currentRoute.includes("/actions") ? "btn active" : "btn"}>ACTIONS</Button></li>
                <li><Button onClick={() => router.push('/contracts')}  className={currentRoute.includes("/contracts") ? "btn active" : "btn"}>CONTRACTS</Button></li>
            </ul> 
        </>
    );
}

export default SideNav;