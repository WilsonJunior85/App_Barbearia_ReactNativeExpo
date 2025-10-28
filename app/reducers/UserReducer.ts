// Define a estrutura do estado global do usuário
export type UserState = {
    id?: number;
    nome?: string;
    sobrenome?: string;
    email?: string;
    avatar: string;
    favorites: string[];
    appointments: string[];
};

// Tipos de ações (UserAction)
// Cada ação representa uma possível mudança no estado do usuário.
// O 'type' define o tipo da ação, e o 'payload' traz os dados necessários.
export type UserAction =
    | { type: 'setAvatar'; payload: { avatar: string } }
    | { type: 'addFavorite'; payload: { favorite: string } }
    | { type: 'setUser'; payload: Partial<UserState> }; // Atualiza múltiplos campos de uma vez

// Estado inicial do usuário (usado no useReducer)
export const initialState: UserState = {
    avatar: '',          // Começa sem avatar
    favorites: [],       // Nenhum favorito inicialmente
    appointments: [],    // Nenhum agendamento inicialmente
};

// Reducer: função pura que altera o estado com base na ação recebida
// É usada dentro do hook useReducer() no contexto de usuário.
// Recebe o estado atual (state) e uma ação (action),
// e retorna um novo estado atualizado.
export const UserReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        // Atualiza apenas o avatar do usuário
        case 'setAvatar':
            return { ...state, avatar: action.payload.avatar };
        // Adiciona um novo item à lista de favoritos
        case 'addFavorite':
            return { ...state, favorites: [...state.favorites, action.payload.favorite] };
        // Atualiza múltiplos campos do usuário de uma vez
        // (por exemplo: nome, email, avatar, etc.)
        case 'setUser':
            return { ...state, ...action.payload }; // Atualiza o usuário (nome, email, avatar etc.)
        // Caso nenhuma ação corresponda, retorna o estado atual sem alteração
        default:
            return state;
    }
};
