import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';

// Estrutura do estado global do usuário
export type UserState = {
  id?: number;
  nome?: string;
  sobrenome?: string;
  email?: string;
  avatar: string;
  telefone?: string;
  sexo?: string;
  favorites: string[];
  appointments: string[];
};

// Tipos de ações que podem alterar o estado
export type UserAction =
  | { type: 'setAvatar'; payload: { avatar: string } }
  | { type: 'addFavorite'; payload: { favorite: string } }
  | { type: 'setUser'; payload: Partial<UserState> }
  | { type: 'logout' }; // adiciona o logout aqui também

// Estado inicial padrão
export const initialState: UserState = {
  avatar: '',
  favorites: [],
  appointments: [],
};

// Reducer: função que altera o estado conforme a ação
export const UserReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'setAvatar':
      return { ...state, avatar: action.payload.avatar };
    case 'addFavorite':
      return { ...state, favorites: [...state.favorites, action.payload.favorite] };
    case 'setUser':
      return { ...state, ...action.payload };
    case 'logout': // limpa o estado do usuário
      return initialState;
    default:
      return state;
  }
};

// Tipo do contexto
export type UserContextType = {
  state: UserState;
  dispatch: Dispatch<UserAction>;
};

// Criação do contexto
export const UserContext = createContext<UserContextType>({} as UserContextType);

// Provider que vai envolver o app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(UserReducer, initialState);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};
