import { useRouter } from "next/router"
import DisplayCode from "./DisplayCode";

const Path = () => {

    const router = useRouter();

    const paths = router.asPath.split('/');

    const page = paths[1];
    const id = paths[2];
    return (<></>)
    return (
        <>
            <div className="path">
                <div><img src="/svg/home.svg" alt="home"/></div>
                {
                    page ? <div>/ { page }</div> : ''
                }
            </div>

            <DisplayCode code={router}/>
        </>
    )
}

export default Path