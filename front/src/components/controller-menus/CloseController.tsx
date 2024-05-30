import React, { useCallback } from "react";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useAppSelector } from "../../hooks";
import { useDispatch } from "react-redux";
import LogoutIcon from '@mui/icons-material/Logout';
import { exitRoom } from "../../stores/signal-store";

export const CloseController: React.FC = () => {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const room = useAppSelector(state => state.signal.room);
  const screenSize = useAppSelector(state => state.screen.size);
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(exitRoom(room));
  }, [dispatch, room])

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
          <LogoutIcon sx={{ color: '#FFFFFF' }} fontSize="large"/>
        </Button>
      </ButtonGroup>
    </React.Fragment>
  )
}