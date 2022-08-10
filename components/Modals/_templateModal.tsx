import { Box, Chip, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useState } from "react";
import { MODAL_STYLE } from './_modalStyle';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { LinearProgressWithLabel } from '../Progress';

const _templateModal = (props: any) => {

    // -- (state) 
    const [open, setOpen] = useState(false);
    const [loading ,setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // -- (event) handleClick
    const handleClick = async () => {
        handleOpen();
    }

    // -- (render) modal
    const renderModal = () => {

        return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={MODAL_STYLE}>
                    
                    {/* --- title --- */}
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        <div className="text-center">Title</div>
                    </Typography>

                    {/* --- subtitle --- */}
                    <Typography id="modal-modal-title" component="h2">
                        <div className="text-center text-tiny">RLI Token ID:123</div>
                    </Typography>

                    {/* --- progress --- */}
                    <Box sx={{ width: '100%' }}>
                        <LinearProgressWithLabel value={0} />
                    </Box>

                </Box>
                
            </Modal>
        )

    }

    // -- (render) button
    const renderButton = () => {
        return (
            <Chip onClick={ handleClick } icon={<AppRegistrationIcon />} label="Click to register" />
        )
    }

    return (
        <>

            { renderModal() }
            { renderButton() }
        </>
    )
}
export default _templateModal;