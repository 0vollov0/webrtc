import { TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import React, { JSXElementConstructor, ReactElement, forwardRef, useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { createRoom, joinRoom } from '../stores/signal-store';
import { SOCKET_ERROR_CODE } from '../socket';


const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export const Entrance: React.FC = () => {
  const mode = useAppSelector(state => state.screen.mode);
  const room = useAppSelector(state => state.signal.room);
  const errorCode = useAppSelector(state => state.signal.errorCode);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [input, setInput] = useState<string>('');

  const handleButton = useCallback((type: 'join' | 'create') => {
    if(input.length >= 2 && input.length <= 20) {
      setHelperText('')
      dispatch( type === 'create' ? createRoom(input) : joinRoom(input));
    } else setHelperText('Please type a input name in at least 2 characters and not more than 20 characters');
  }, [dispatch, input])

  useEffect(() => {
    setOpen(!room.length)
  }, [room])

  useEffect(() => {
    switch (errorCode) {
      case SOCKET_ERROR_CODE.CREATE_ROOM:
        setHelperText('Create room failed. please retry again.');
        break;
      case SOCKET_ERROR_CODE.JOIN_ROOM:
        setHelperText('Join room failed. please retry again.');
        break;
      default:
        break;
    }
  }, [errorCode])

  return (
    <Dialog
      fullScreen={mode === 'mobile'}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      // onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Room Manager</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Welcome, this service serves text and video chat you can experience WebRTC protocol.
          Before to use you may create or join input.
        </Typography>
        <Typography gutterBottom>
          Please type a input name after that click the join or create button which you want.
        </Typography>
      </DialogContent>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TextField
          error={helperText.length > 0}
          label="Room Name"
          helperText={helperText}
          variant="standard"
          value={input}
          onChange={(ev) => setInput(ev.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleButton('join')}>Join</Button>
        <Button onClick={() => handleButton('create')}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}