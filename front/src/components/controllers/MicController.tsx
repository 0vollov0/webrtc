import styled from "styled-components"
import { BsMicFill, BsMicMuteFill } from "react-icons/bs"
import { GoChevronUp, GoChevronDown } from "react-icons/go"
import { useCallback, useEffect, useState } from "react"
import { ControllerProps } from "./controller"

const Font = styled.div`
  color: #9EA1A6;
  font-size: 13px;
`

const Mic = styled.div`
  color: #9EA1A6;
`

const ChevronFrame = styled.div`
  display: grid;
  color: #9EA1A6;
  margin-bottom: 20px;
`

const DropdownContentFrame = styled.div<{dropped: boolean}>`
  position: absolute;
  display: none;
  bottom: 100%;
  overflow: visible;
  background-color: #0e0d0d;
  width: max-content;
  border-radius: 5px;
  padding: 0px;

  ${({dropped}) => {
    if (dropped) {
      return `
        display: grid;
        place-items: center;
        gap: 5px 0px;
      `
    } else return ``;
  }}
`

const DropdownContent = styled.div<{selected?: boolean}>`
  color: ${({selected}) => selected ? '#ffffff' : '#cbbebeca'};
  padding: 5px 10px;
  :hover {
    color: #ffffff;
  }
`

const MicControllerFrame = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
  }

  :hover ${ChevronFrame} {
    color: white;
  }

  :hover ${Font} {
    color: white;
  }

  :hover ${Mic} {
    color: white;
  }
`

const VoiceFrame = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 2px 0px;
  width: 80px;
  place-items: center;
`
export const MicController: React.FC<ControllerProps> = ({
  kind,
  onChangeDevice,
  selectedDevice,
  enabled,
  setEnable
}) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [dropped, setDropped] = useState<boolean>(false);

  const onDropdown = useCallback(() => {
    setDropped((prev) => !prev);
  },[])

  const loadConnectedDevices = useCallback((type: MediaDeviceKind) => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
          const filtered = devices.filter(device => device.kind === type);
          setDevices(filtered);
          if (filtered.length) onChangeDevice(filtered[0])
      });
  },[onChangeDevice])

  useEffect(() => {
    loadConnectedDevices(kind);
    navigator.mediaDevices.addEventListener('devicechange', event => {
      loadConnectedDevices(kind)
    });
    return () => {
      setDevices([])
    }
  }, [kind, loadConnectedDevices]);

  const onDeviceClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const device = devices.find((device) => device.deviceId === event.currentTarget.id);
    if (device) onChangeDevice(device);
    setDropped(false);
  },[devices, onChangeDevice])

  return (
    <MicControllerFrame>
      <VoiceFrame
        onClick={() => setEnable(!enabled)}
      >
        <Mic>
          {
            enabled ? <BsMicFill size={18}/> : <BsMicMuteFill size={18}/>
          }
        </Mic>
        <Font>{enabled ? 'Mute' : 'Play'}</Font>
      </VoiceFrame>
      <ChevronFrame
        onClick={onDropdown}
      >
        {dropped ? <GoChevronDown/> : <GoChevronUp/>}
      </ChevronFrame>
      <DropdownContentFrame
        dropped={dropped}
      >
        {
          devices.filter((device) => device.deviceId !== selectedDevice?.deviceId).map((device) => (
            <DropdownContent
              id={device.deviceId}
              key={device.deviceId}
              onClick={onDeviceClick}
            >
              {device.label}
            </DropdownContent>
          ))
        }
        {
          selectedDevice
          ?(
            <DropdownContent
              id={selectedDevice.deviceId}
              selected={true}
              onClick={onDeviceClick}
            >
              {selectedDevice.label}
            </DropdownContent>
          )
          :(<></>)
        }
      </DropdownContentFrame>
    </MicControllerFrame>
  )
}