import { LinearProgressWithLabel } from "./Progress";

const MyProgress = ({
    value,
    message
}:{
    value: number,
    message: string,
}) => {
    return (
        <div className="uploaded-result">
            <LinearProgressWithLabel value={value} />
            { message }
        </div>
    )
}
export default MyProgress;