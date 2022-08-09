import { GridRenderCellParams } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { AppRouter } from "../../../utils/AppRouter";

const RenderLink = (props: GridRenderCellParams) => {

    const router = useRouter();

    const onClick = (e: any) => {

        e.preventDefault();
        
        const value = e.target.innerText;

        router.push(AppRouter.getPage(value))

    }

    const { value } = props;

    return (
        <a href={`${AppRouter.getPage(value)}`} onClick={onClick}>{ value }</a>
    )
}

export default RenderLink;