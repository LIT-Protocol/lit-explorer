import { useRouter } from "next/router"
import DisplayCode from "./DisplayCode";

const Path = () => {

    const router = useRouter();

    const paths = router.asPath.split('/');

    const page = paths[1];
    const id = paths[2]?.replaceAll('#', '');

    // return (<></>)
    return (
        <>
            <div className="path">
                <div className="path-link" onClick={() => router.push('/')}><img src="/svg/home.svg" alt="home"/></div>
                {
                    page 
                    ? <div className="flex">/ <div onClick={() => router.push(`/${page}`)} className="path-link">{ page }</div> </div>
                    : ''
                }

                {
                    page && id 
                    ? <div className="flex">/ <div onClick={() => router.push(`/${page}/${id}`)} className="path-link">{ id }</div> </div>
                    : '' 
                }
            </div>

            {/* <DisplayCode code={router}/> */}
        </>
    )
}

export default Path