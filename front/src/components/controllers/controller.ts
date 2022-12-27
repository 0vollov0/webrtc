import styled from "styled-components";

export const Icon = styled.div`
  color: #9EA1A6;
`

export interface ControllerProps {
  kind: MediaDeviceKind;
  onChangeDevice: (device: MediaDeviceInfo) => void;
  selectedDevice?: MediaDeviceInfo;
}