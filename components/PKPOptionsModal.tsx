import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import { Button, Chip, TextField } from '@mui/material';

// @ts-ignore
import converter from 'hex2dec';
import throwError from '../utils/throwError';
import { tryUntil, TryUntilProp } from '../utils/tryUntil';
import { LinearProgressWithLabel } from './Progress';
import { useState } from 'react';
import { AppRouter } from '../utils/AppRouter';
import { SupportedSearchTypes } from '../app_config';
import { useAppContext } from './AppContext';
import { wait } from '../utils/utils';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgb(49, 45, 75)',
  boxShadow: 'rgb(19 17 32 / 10%) 0px 2px 10px 0px',
  p: 4,
  color: 'rgba(231, 227, 252, 0.87)',
  borderRadius: '6px',
  maxHeight: '600px',

};

interface PKPOptionsModalProps{
  pkpId: string | any,
  onDone?(userAddress: string): void
}

export default function PKPOptionsModal(props: PKPOptionsModalProps) {

  // -- (app context)
  const { routerContract } = useAppContext();

  // -- prepare
  const pkpId = props.pkpId;
  
  const [open, setOpen] = useState(false);
  const [loading ,setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [address, setAddress] = useState();

  const handleChange = (e: any) => {
    setAddress(e.target.value);
  }

  const resetProgress = (message: string) => {
    throwError(message);
    setProgress(0);
    setLoading(false);
  }

  // -- (event) handle click
  const handleClick = async () => {

    setLoading(true);
  

    setProgress(20);

    // -- prepare params for smart contract
    const pkpId_hex = converter.decToHex(pkpId);
    const user_address : any = address;
    const inputType = AppRouter.getSearchType(user_address);
    
    // -- validate
    if( inputType !== SupportedSearchTypes.ETH_ADDRESS){
      resetProgress(`Incorrect input type. Expecting 'ETH_ADDRESS' but received ${inputType}`);
      return;
    }

    console.log("[handleClick] pkpId_hex:", pkpId_hex);
    console.log("[handleClick] user_address:", user_address);
    console.log("[handleClick] inputType:", inputType);
    
    setProgress(70);
    const permittedAddressTx = await routerContract.write.addPermittedAddress(pkpId, user_address);

    console.log("[handleClick]:", permittedAddressTx);
    
    setProgress(90);
    const txConfirmed = await tryUntil({
      onlyIf: async () => await routerContract.read.isPermittedAddress(pkpId, user_address),
      thenRun: async () => true,
      onTrying: (counter: number) => {
        console.log(`${counter} confirming transaction...`);
        setProgress(90 + counter);
      },
      onError: (props: TryUntilProp) => {
        throwError(`Failed to execute: ${props}`);
      },
      interval: 4500
    });
    
    
    setProgress(100);
    console.log("txConfirmed:", txConfirmed);
    
    setTimeout(() => {
      setLoading(false);
      handleClose();

      if (props?.onDone){
        props.onDone(user_address);
      }

    }, 2000)

  }

  return (
    <div>
      <Chip onClick={ handleOpen } icon={<AddIcon />} label="Add Permitted Address" />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            <div className="text-center">Add Permitted Address</div>
          </Typography>
          <Typography id="modal-modal-title" component="h2">
            <div className="text-center text-tiny">TokenId:{converter.decToHex(pkpId)}</div>
          </Typography>
          <Typography id="modal-modal-title" component="h2">

          {
            loading ? 
            <Box sx={{ width: '100%' }}>
              <LinearProgressWithLabel value={progress} />
            </Box> : 
            ''
          }

          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            
          </Typography>

          <div className='flex'>
            <TextField
              className="modal-input"
              label="Permitted Address (eg. 0x3B5...99A1)"
              id="outlined-size-small"
              defaultValue=""
              size="small"
              fullWidth={true}
              onChange={handleChange}
            />
            <Button onClick={handleClick} className="btn-2 ml-auto">Add</Button>
          </div>

        </Box>
      </Modal>
    </div>
  );
}
