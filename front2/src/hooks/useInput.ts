import { useCallback, useState } from "react";

type UseInputReturn = ReturnType<(_input?: string) => [
  string,
  (event: React.ChangeEvent<HTMLInputElement>) => void,
  () => void,
]>

export const useInput = (_input?: string): UseInputReturn => {
  const [input, setInput] = useState<string>(!_input ? "" : _input);
  const onInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    },
    [],
  )

  const inputInit = useCallback(
    () => {
      setInput(!_input ? "" : _input);
    },
    [_input],
  )
  
  return [
    input,
    onInput,
    inputInit
  ]
}