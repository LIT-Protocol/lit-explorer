
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Chip } from "@mui/material";
import copy from 'copy-to-clipboard';
import alertMsg from '../../utils/alertMsg';

const Copy = ({
    value
}: {
    value: string
}) => {

    // (event) handle copy
    const handleCopy = (value: any) =>{

        copy(value);

        alertMsg({
            title: "Copied!",
            message: `You have copied ${value} to your clipboard!`
        });

    }

    // -- finally
    return (
        <Chip className="copy" onClick={ () => handleCopy(value) } icon={<ContentCopyIcon />} label="" />
    )
}
export default Copy;