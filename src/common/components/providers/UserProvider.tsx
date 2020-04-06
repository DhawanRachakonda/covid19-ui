import React from 'react';
import UserService from '../../../services/user-services';

type User = {
  userName: string;
  isAdmin: boolean;
};

const userDetails: User = {
  userName: '',
  isAdmin: false
};

const UserProviderContext = React.createContext<User>(userDetails);

interface IUserProvider {
  children: React.ReactNode;
}

function UserProvider({ children }: IUserProvider) {
  const user = UserService.getUserDate();
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
