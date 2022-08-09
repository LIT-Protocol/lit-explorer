import { Box, Button, Typography, useThemeProps } from "@mui/material";
import MyButton from "./MyButton";

const STYLE = {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    overflow: 'hidden',
    border: '0px solid rgba(0, 0, 0, 0.125)',
    boxShadow: 'rgb(0 0 0 / 10%) 0rem 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0rem 0.125rem 0.25rem -0.0625rem',
}

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
            <Box sx={STYLE}>
                { renderTitle() }
                <div className="mt-12">
                    { props?.children }
                </div>
            </Box>
        </div>
    )
}

export default MyCard;