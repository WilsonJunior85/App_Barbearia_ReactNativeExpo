// Define a estrutura do estado global do usuário
export type UserState = {
    id?: number;
    nome?: string;
    sobrenome?: string;
    email?: string;
    telefone?: string;   // adiciona telefone aqui
    sexo?: string;       // adiciona sexo aqui
    avatar: string;
    favorites: string[];
    appointments: string[];
};

// Tipos de ações (UserAction)
export type UserAction =
    | { type: 'setAvatar'; payload: { avatar: string } }
    | { type: 'addFavorite'; payload: { favorite: string } }
    | { type: 'setUser'; payload: Partial<UserState> }
    | { type: 'logout' }; // adiciona a ação de logout

// Estado inicial do usuário
export const initialState: UserState = {
    avatar: '',
    favorites: [],
    appointments: [],
};

// Reducer: altera o estado com base na ação
export const UserReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case 'setAvatar':
            return { ...state, avatar: action.payload.avatar };

        case 'addFavorite':
            return { ...state, favorites: [...state.favorites, action.payload.favorite] };

        case 'setUser':
            return { ...state, ...action.payload };

        case 'logout':
            return initialState; // limpa o estado do usuário ao deslogar

        default:
            return state;
    }
};
