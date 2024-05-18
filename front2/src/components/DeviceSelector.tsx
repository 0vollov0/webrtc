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
  onChangeDevice: (device: MediaDeviceInfo) => void;
}
export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  kind,
  onChangeDevice,
}) => {

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  // const [selected, setSelected] = useState<string>("");

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

  const onChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = event.currentTarget.value;
    const device = devices.find((device) => device.deviceId === deviceId);
    if (device) onChangeDevice(device);
  },[devices, onChangeDevice])

  return (
    <Selector name={kind} onChange={onChange}>
      <DeviceOptions
        devices={devices}
      />
    </Selector>
  )
}