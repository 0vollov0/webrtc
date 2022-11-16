import { useCallback, useEffect, useState } from "react";
import styled from "styled-components"

const Selector = styled.select`
  
`

interface DeviceOptionsProps {
  devices: MediaDeviceInfo[];
}

const DeviceOptions: React.FC<DeviceOptionsProps> = ({
  devices
}) => {
  return (
    <>
      {
        devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))
      }
    </>
  )
}

interface DeviceSelectorProps {
  kind: MediaDeviceKind;
}
export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  kind,
}) => {

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selected, setSelected] = useState<string>("");

  const loadConnectedDevices = useCallback((type: MediaDeviceKind) => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
          const filtered = devices.filter(device => device.kind === type);
          setDevices(filtered);
      });
  },[])

  useEffect(() => {
    loadConnectedDevices(kind);
    return () => {
      setDevices([])
    }
  }, [kind, loadConnectedDevices]);

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', event => {
      loadConnectedDevices(kind)
    });
  }, [kind, loadConnectedDevices]);

  return (
    <Selector name={kind} value={selected}>
      <DeviceOptions
        devices={devices}
      />
    </Selector>
  )
}