//Tipos principais
export type UserState = {
    id?: number;
    nome?: string;
    sobrenome?: string;
    email?: string;
    avatar: string;
    favorites: string[];
    appointments: string[];
};

// Tipos de ações que o reducer entende
export type UserAction =
    | { type: 'setAvatar'; payload: { avatar: string } }
    | { type: 'addFavorite'; payload: { favorite: string } }
    | { type: 'setUser'; payload: Partial<UserState> }; // Atualiza múltiplos campos de uma vez

// Estado inicial padrão
export const initialState: UserState = {
    avatar: '',
    favorites: [],
    appointments: [],
};

// Reducer — função que manipula o estado com base na ação recebida
export const UserReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case 'setAvatar':
            return { ...state, avatar: action.payload.avatar };

        case 'addFavorite':
            return { ...state, favorites: [...state.favorites, action.payload.favorite] };

        case 'setUser':
            return { ...state, ...action.payload }; // Atualiza o usuário (nome, email, avatar etc.)

        default:
            return state;
    }
};
