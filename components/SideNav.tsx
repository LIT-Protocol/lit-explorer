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
                <li><Button onClick={() => router.push('/mint-pkp')} className={currentRoute === "/mint-pkp" ? "btn active" : "btn"}>Mint New PKP</Button></li>
                <li><Button onClick={() => router.push('/create-action')} className={currentRoute === "/create-action" ? "btn active" : "btn"}>Create Action</Button></li>
            </ul>        

            <Divider className='divider' textAlign="left">PAGES</Divider>
            <ul className='ul'>
                <li><Button onClick={() => router.push('/owners')}  className={currentRoute === "/owners" ? "btn active" : "btn"}>Owners</Button></li>
                <li><Button onClick={() => router.push('/pkps')}  className={currentRoute === "/pkps" ? "btn active" : "btn"}>PKPS</Button></li>
                <li><Button onClick={() => router.push('/actions')}  className={currentRoute === "/actions" ? "btn active" : "btn"}>ACTIONS</Button></li>
                <li><Button onClick={() => router.push('/contracts')}  className={currentRoute === "/contracts" ? "btn active" : "btn"}>CONTRACTS</Button></li>
            </ul> 
        </>
    );
}

export default SideNav;