import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import pushPage, { getPage } from "./pushPage";

const RenderLink = (props: GridRenderCellParams) => {

    const router = useRouter();

    const onClick = (e: any) => {

        e.preventDefault();
        
        const value = e.target.innerText;

        pushPage(value, router);

    }

    const { value } = props;

    return (
        <a href={`${getPage(value, router)}`} onClick={onClick}>{ value }</a>
    )
}

export default RenderLink;