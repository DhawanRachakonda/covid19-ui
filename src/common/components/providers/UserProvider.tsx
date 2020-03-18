import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store/rooReducerConfig';
import { User } from '../../../store/user/types';
import { appState } from '../../../store/initialstate';

const UserProviderContext = React.createContext<User>(
  appState.user.userDetails!
);

interface IUserProvider {
  children: React.ReactNode;
}

function UserProvider({ children }: IUserProvider) {
  const user = useSelector((state: AppState) => state.user.userDetails!);
  return (
    <UserProviderContext.Provider value={user}>
      {children}
    </UserProviderContext.Provider>
  );
}

function useUserState() {
  const context = React.useContext(UserProviderContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}

export { useUserState, UserProvider };
