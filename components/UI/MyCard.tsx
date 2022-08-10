import { Box, Typography } from "@mui/material";
import { WHITE_CARD } from "../Modals/_modalStyle";

interface MyCardProps{
    children: any,
    title?: string,
    className?: string
}


const MyCard = (props : MyCardProps) => {
    
    // -- (render) title
    const renderTitle = () => {
        
        if(! props.title) return;

        return <Typography variant="h5">{ props.title }</Typography>;
    }
    
    // -- (finally) render
    return (
        <div className={props.className}>
            <Box sx={WHITE_CARD}>
                { renderTitle() }
                <div className="mt-12">
                    { props?.children }
                </div>
            </Box>
        </div>
    )
}

export default MyCard;