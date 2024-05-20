import React, { useCallback } from "react";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks";
import { selectDevice, updateDeviceState } from "../../stores/device-store";

export const CamController: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const videoinputs = useAppSelector(state => state.device.videoinputs);
  const deviceState = useAppSelector(state => state.device.deviceState);
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(updateDeviceState({
      enable: !deviceState.videoinput,
      kind: 'videoinput'
    }));
  }, [deviceState.videoinput, dispatch])

  const handleMenuItemClick = useCallback((
    _: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    const { deviceId, kind } = videoinputs[index];
    dispatch(selectDevice({ deviceId, index, kind }))
    setOpen(false);
  }, [videoinputs, dispatch]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
        color="warning"
      >
        <Button color="warning" onClick={handleClick}>
          {
            deviceState.videoinput ? <VideocamIcon sx={{ color: '#FFFFFF' }} fontSize="large"/> : <VideocamOffIcon sx={{ color: '#FFFFFF' }} fontSize="large"/>
          }
        </Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          color="warning"
        >
          <ArrowDropUpIcon/>
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {videoinputs.map((videoinput, index) => (
                    <MenuItem
                      key={videoinput.deviceId}
                      selected={index === videoinputs.length -1}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {videoinput.label.length > 30 ? videoinput.label.slice(0,30) + '..' : videoinput.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}