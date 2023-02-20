import { createContext, useRef } from "react";
import { nanoid } from 'nanoid'

interface UserContextProps {
  userId: string;
}

export const UserContext = createContext<UserContextProps>({
  userId: "",
});

export const UserProvider = ({ children }: {
  children: JSX.Element | JSX.Element[]
}): JSX.Element => {
  const userId = useRef<string>(nanoid().slice(0,5));

  return (
    <UserContext.Provider
      value={{
        userId: userId.current
      }}
    >
      {children}
    </UserContext.Provider>
  )
}