import React, { useCallback } from "react";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useAppSelector } from "../../hooks";
import { useDispatch } from "react-redux";
import { updateDeviceState } from "../../stores/device-store";

export const AudioController: React.FC = () => {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const deviceState = useAppSelector(state => state.device.deviceState);
  const screenSize = useAppSelector(state => state.screen.size);
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(updateDeviceState({
      enable: !deviceState.audiooutput,
      kind: 'audiooutput'
    }));
  }, [deviceState.audiooutput, dispatch])

  /* const handleMenuItemClick = useCallback((
    _: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    const { deviceId, kind } = audiooutputs[index];
    dispatch(selectDevice({ deviceId, index, kind }))
    setOpen(false);
  }, [audiooutputs, dispatch]);

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
  }; */

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
        color="warning"
        size={ screenSize.width < 420 ? 'small' : 'large'}
      >
        <Button color="warning" onClick={handleClick}>
          {
            deviceState.audiooutput ? <VolumeUpIcon sx={{ color: '#FFFFFF' }} fontSize="large"/> : <VolumeOffIcon sx={{ color: '#FFFFFF' }} fontSize="large"/>
          }
        </Button>
        {/* <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          color="warning"
        >
          <ArrowDropUpIcon/>
        </Button> */}
      </ButtonGroup>
      {/* <Popper
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
                  {audiooutputs.map((audiooutput, index) => (
                    <MenuItem
                      key={audiooutput.deviceId}
                      selected={index === audiooutputs.length-1}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {audiooutput.label.length > 30 ? audiooutput.label.slice(0,30) + '..' : audiooutput.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper> */}
    </React.Fragment>
  )
}