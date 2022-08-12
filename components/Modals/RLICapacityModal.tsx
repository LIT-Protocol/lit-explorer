import { Box, Chip, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from "react";
import { MODAL_STYLE } from './_modalStyle';
import MoreIcon from '@mui/icons-material/More';

const RLICapacityModal = (capacity: any) => {

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

    // -- (mounted)
    useEffect(() =>{

        console.log("capacity:", capacity);

    }, [])

    // -- (render) modal
    const renderModal = () => {

        return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{...MODAL_STYLE, width: window.innerWidth - 450}}>

                    {/* --- title --- */}
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                        <div className="text-center">{capacity.capacity.name}</div>
                    </Typography>

                    {/* --- subtitle --- */}
                    <Typography id="modal-modal-title" component="h2">
                        <div className="text-center">{capacity.capacity.description}</div>
                    </Typography>

                    <div className="flex">
                        <div className="thumbnail m-auto" dangerouslySetInnerHTML={{ __html: capacity?.capacity?.image_data }} />
                    </div>

                    {
                        capacity.capacity.attributes.map((item: any, i:number) => {
                            return (
                                <div key={i} className='mt-12 text-center'>
                                    { item.trait_type } : { item.value }
                                </div>
                            )
                        })
                    }

                </Box>
                
            </Modal>
        )

    }

    // -- (render) button
    const renderButton = () => {
        return (
            <Chip onClick={ handleClick } icon={<MoreIcon />} label="View more" />
        )
    }

    return (
        <>

            { renderModal() }
            { renderButton() }
        </>
    )
}
export default RLICapacityModal;