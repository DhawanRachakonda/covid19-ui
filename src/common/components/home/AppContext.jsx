import * as React from 'react';

const AppStateContext = React.createContext(
    undefined
  );
const AppDispatchContext = React.createContext(undefined);

const initialState = {
    selectedUser: '',
    selectedDate: new Date(),
    filter: {
        user:'',
        date:'',
    }
};

function AppReducer(
    state,
    action
  ) {
    switch (action.type) {
      
        case "SET_USER":
            return {
                ...state,
                selectedUser: action.payload.value
            }
        case "SET_DATE":
            return {
                ...state,
                selectedDate: action.payload.value,
            }
        case "RESET":
            return {
                selectedUser: '',
                selectedDate: new Date(),
                filter: {
                    user:'',
                    date:'',
                }
            }
        case "APPLY_FILTER":
            return {
                ...state,
                filter: {
                    user: state.selectedUser,
                    date: state.selectedDate,
                }
            }
      default:
        return state;
    }
  }
  
  function AppProvider({ children }) {
    const [state, dispatch] = React.useReducer(AppReducer, initialState);
  
    return (
      <AppStateContext.Provider value={state}>
        <AppDispatchContext.Provider value={dispatch}>
          {children}
        </AppDispatchContext.Provider>
      </AppStateContext.Provider>
    );
  }
  
  function useAppFormState() {
    const context = React.useContext(AppStateContext);
    if (context === undefined) {
      throw new Error('useCountState must be used within a CountProvider');
    }
    return context;
  }
  
  function useAppDispatch() {
    const context = React.useContext(AppDispatchContext);
    if (context === undefined) {
      throw new Error('useCountState must be used within a CountProvider');
    }
    return context;
  }
  
  export { AppProvider, useAppFormState, useAppDispatch };