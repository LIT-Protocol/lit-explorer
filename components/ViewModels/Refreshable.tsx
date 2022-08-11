import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react"
import { wait } from "../../utils/utils";

const Refreshable = ({ 
    children, 
    refresh 
} : any) => {

    // -- (state)
    const [loading, setLoading] = useState(false);
    const [height, setHeight] = useState<number>();

    // -- (mounted)
    useEffect(() => {

        (async() => {

            const _height = document.getElementById('refreshable-content')?.clientHeight;
            setHeight(_height);
            
            if( ! refresh ) return;

            setLoading(true);
            await wait(2000);
            setLoading(false);
        })();

    }, [refresh])

    // -- (render) render loading
    const renderLoading = () => {
        return (
            <div className="mt-12">
                <Skeleton height={height}/>
            </div>
        )
    }

    if ( loading ) return renderLoading();

    return (
        <div id="refreshable-content">
            { children }
        </div>
    )
}
export default Refreshable;