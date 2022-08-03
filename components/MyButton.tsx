import { Button } from "@mui/material";

const MyButton = ({ children, onClick } : { 
    children: any,
    onClick?(e: any): void | Promise<void>,
}) => {


    // -- (event) handleClick
    const handleClick = (e: any) => {
        if(onClick){
            onClick(e);
        }
    }

    return (
        <>
            <Button className="btn-2" onClick={handleClick}>{ children }</Button>
        </>
    )
}

export default MyButton;