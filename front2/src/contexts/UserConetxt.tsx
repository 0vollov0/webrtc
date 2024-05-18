import { createContext, useRef } from "react";

interface UserContextProps {
  userId: string;
}

export const UserContext = createContext<UserContextProps>({
  userId: "",
});

export const UserProvider = ({ children }: {
  children: JSX.Element | JSX.Element[]
}): JSX.Element => {
  const userId = useRef<string>(`user-${Math.random().toString().slice(2,5)}`);

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