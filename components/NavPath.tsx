import { useRouter } from "next/router"
import Copy from "./UI/Copy";

const NavPath = () => {

    const router = useRouter();

    const paths = router.asPath.split('/');

    const page = paths[1];
    const id = paths[2]?.replaceAll('#', '');
    const action = paths[3]?.replaceAll('#', '');

    if( ! page ) return <></>;
    
    return (
        <div className="path flex">
            <div className="path-link" onClick={() => router.push('/')}><img src="/svg/home.svg" alt="home"/></div>
            {
                page 
                ? <div className="flex">
                    <div className="flex-content">/</div>
                    <div onClick={() => router.push(`/${page}`)} className="path-link flex">
                        <div className="flex-content">{ page }</div>    
                    </div> 
                </div>
                : ''
            }

            {
                page && id 
                ? <div className="flex">
                    <div className="flex-content">/</div> 
                    <div onClick={() => router.push(`/${page}/${id}`)} className="path-link flex">
                        <div className="flex-content">{ id }</div>    
                    </div>
                    <div className="flex-content"><Copy value={id} /></div>    
                </div>
                : '' 
            }
            {
                page && id && action
                ? <div className="flex">
                    <div className="flex-content">/</div> 
                    <div onClick={() => router.push(`/${page}/${id}/${action}`)} className="path-link flex">
                        <div className="flex-content">{ action }</div>    
                    </div> </div>
                : '' 
            }
        </div>
    )
}

export default NavPath;