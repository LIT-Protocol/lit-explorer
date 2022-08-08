import { Button } from "@mui/material";

const MyButton = ({ children, onClick, fullWidth } : { 
    children: any,
    onClick?(e: any): void | Promise<void>,
    fullWidth?: boolean
}) => {


    // -- (event) handleClick
    const handleClick = (e: any) => {
        if(onClick){
            onClick(e);
        }
    }

    return (
        <>
            <Button className="btn-2" fullWidth={fullWidth} onClick={handleClick} >{ children }</Button>
        </>
    )
}

export default MyButton;