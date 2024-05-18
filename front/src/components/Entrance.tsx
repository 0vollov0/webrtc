import { TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { JSXElementConstructor, ReactElement, forwardRef, useEffect, useState } from 'react';


const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export const Entrance: React.FC = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(true);
  }, [])

  return (
    <Dialog
      fullScreen={fullScreen}
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
          Before to use you may create or join room.
        </Typography>
        <Typography gutterBottom>
          Please type a room name after that click the join or create button which you want.
        </Typography>
      </DialogContent>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TextField
          label="Room Name"
          defaultValue=""
          helperText="Please type a room name in at least 2 characters and not more than 20 characters"
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Join</Button>
        <Button onClick={handleClose}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}