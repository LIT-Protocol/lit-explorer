import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, TextField } from '@mui/material';

import throwError from '../../utils/throwError';
import { tryUntil, TryUntilProp } from '../../utils/tryUntil';
import { LinearProgressWithLabel } from '../UI/Progress';
import { useState } from 'react';
import { useAppContext } from '../Contexts/AppContext';
import { wait } from '../../utils/utils';
import { MODAL_STYLE } from './_modalStyle';
import { heyShorty } from '../../utils/converter';


interface RLITransferModal{
  RLI: string | any,
  ownerAddress: string,
  onDone?(data: any): void
}

export default function RLITransferModal(props: RLITransferModal) {

  // -- (app context)
  const { rliContract } = useAppContext();

  // -- prepare
  const RLI_ID = props.RLI;
  const ownerAddress = props.ownerAddress;
  
  const [open, setOpen] = useState(false);
  const [loading ,setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [address, setAddress] = useState();

  const handleChange = (e: any) => {
    console.log(`[handleChange]: ${e.target.value}`)
    setAddress(e.target.value);
  }

  const resetProgress = () => {
    setLoading(false);
    setProgress(0);
  }

  const handleClick = async () => {

    setLoading(true);
    setProgress(30);

    // -- prepare
    const tokenId = RLI_ID.row.tokenID;
    const recipientAddress = address;
    
    // -- validate
    if( ! recipientAddress ){
      resetProgress();
      throwError("Recipient address cannot be empty");
      return;
    }

    console.log(`[handleClick]: sending RLI Token ID "${tokenId}" to "${recipientAddress}" from "${ownerAddress}"`);
    
    let transferTx;
    
    try{
      transferTx = await rliContract.write.transfer({
        fromAddress: ownerAddress,
        toAddress: recipientAddress,
        RLITokenAddress: tokenId,
      });
    }catch(e: any){
      resetProgress();
      throwError(`Failed to trasnfer token "${tokenId}" from "${ownerAddress}" to "${recipientAddress}" `);
      return;
    }

    setProgress(50);
    console.log("transferTx:", transferTx);

    // -- confirm is routed
    const isTransferred = await tryUntil({
      onlyIf: async () => {

        let _newOwner = (await rliContract.read.ownerOf(tokenId)).toLowerCase();
        let _recipientAddress = (recipientAddress as string).toLowerCase();

        console.log(`${heyShorty(_newOwner)} === ${heyShorty(_recipientAddress)}: ${_newOwner === _recipientAddress}`);

        return _newOwner === _recipientAddress;
      },
      thenRun: async () => true,
      onTrying: (counter: number) => {
        setProgress(55 + counter)
      },
      onError: (props: TryUntilProp) => {
        throwError(`Failed to execute: ${props}`);
      },
      interval: 1000,
      max: 50,
    })

    console.log("isTransferred:", isTransferred)
    setProgress(100);

    await wait(2000);

    if(props.onDone){
      handleClose();
      setLoading(false);
      props.onDone(transferTx);
    }

  }

  return (
    <div>
      {/* ----- Open Button  */}
      <Button onClick={ handleOpen } className='btn-2'>Transfer</Button>
      
      
      {/* ----- Hide by default ----- */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={MODAL_STYLE}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            <div className="text-center">Transfer</div>
          </Typography>
          <Typography id="modal-modal-title" component="h2">
            <div className="text-center text-tiny">RLI Token ID: {RLI_ID.row.tokenID}</div>
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
              label="Recipient Address (eg. 0x3B5...99A1)"
              id="outlined-size-small"
              defaultValue=""
              size="small"
              fullWidth={true}
              onChange={handleChange}
            />
            <Button onClick={handleClick} className="btn-2 ml-auto">Send</Button>
          </div>          
          
        </Box>
      </Modal>
    </div>
  );
}
