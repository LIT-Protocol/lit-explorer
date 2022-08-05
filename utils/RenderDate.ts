import { GridRenderCellParams } from "@mui/x-data-grid";
import { timestamp2Date } from "./converter";

const RenderDate = (props: GridRenderCellParams) => {

    const { value } = props;

    return (
        timestamp2Date(value)
    )
}

export default RenderDate;