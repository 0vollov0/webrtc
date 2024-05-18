import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import styled from 'styled-components';

const LoadingFrame = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`

export default function Loading() {
  return (
    <LoadingFrame>
      <Box>
        <CircularProgress size={'10vw'}/>
      </Box>
    </LoadingFrame>
  );
}