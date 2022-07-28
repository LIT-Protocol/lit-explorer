import { GridRenderCellParams } from "@mui/x-data-grid";
import timestampToDate from "./timestampToDate";

const RenderDate = (props: GridRenderCellParams) => {

    const { value } = props;

    return (
        timestampToDate(value)
    )
}

export default RenderDate;