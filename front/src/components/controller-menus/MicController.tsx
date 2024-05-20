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
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useAppSelector } from "../../hooks";
import { useDispatch } from "react-redux";
import { selectDevice, updateDeviceState } from "../../stores/device-store";

export const MicController: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const audioinputs = useAppSelector(state => state.device.audioinputs);
  const deviceState = useAppSelector(state => state.device.deviceState);
  const dispatch = useDispatch();
  
  const handleClick = useCallback(() => {
    dispatch(updateDeviceState({
      enable: !deviceState.audioinput,
      kind: 'audioinput'
    }));
  }, [deviceState.audioinput, dispatch])

  const handleMenuItemClick = useCallback((
    _: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    const { deviceId, kind } = audioinputs[index];
    dispatch(selectDevice({ deviceId, index, kind }))
    setOpen(false);
  }, [audioinputs, dispatch]);

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
            deviceState.audioinput ? <MicIcon sx={{ color: '#FFFFFF' }} fontSize="large"/> : <MicOffIcon sx={{ color: '#FFFFFF' }} fontSize="large"/>
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
                  {audioinputs.map((audioinput, index) => (
                    <MenuItem
                      key={audioinput.deviceId}
                      selected={index === audioinputs.length-1}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {audioinput.label.length > 30 ? audioinput.label.slice(0,30) + '..' : audioinput.label}
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