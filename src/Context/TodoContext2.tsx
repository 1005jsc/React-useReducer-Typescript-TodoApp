import { createContext, useContext, useReducer, useRef } from 'react';

export {};
// useReducer를 사용한 Context api 만들기

type TodoType = {
  id: number;
  text: string;
  done: boolean;
};

type TypeOfState = TodoType[];

const initialTodos: TypeOfState = [
  {
    id: 1,
    text: '프로젝트 생성하기',
    done: true,
  },
  {
    id: 2,
    text: '컴포넌트 스타일링하기',
    done: true,
  },
  {
    id: 3,
    text: 'Context 만들기',
    done: false,
  },
  {
    id: 4,
    text: '기능 구현하기',
    done: false,
  },
];

type actionType =
  | { type: 'CREATE'; todo: TodoType }
  | { type: 'TOGGLE'; id: number }
  | { type: 'REMOVE'; id: number };

const todoReducer = (state: TypeOfState, action: actionType) => {
  switch (action.type) {
    case `CREATE`:
      return state.concat(action.todo);
    case `TOGGLE`:
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case `REMOVE`:
      return state.filter((todo) => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type`);
  }
};

type TodoProviderProps = {
  children: React.ReactNode;
};

const TodoStateContext = createContext<TypeOfState>(initialTodos);
const TodoDispatchContext = createContext<React.Dispatch<any> | undefined>(
  undefined
);
const TodoNextIdContext = createContext<any>(5);

export function TodoProvider({ children }: TodoProviderProps) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const nextId = useRef(5);
  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        <TodoNextIdContext.Provider value={nextId}>
          {children}
        </TodoNextIdContext.Provider>
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

export const useTodoState = () => {
  const context = useContext(TodoStateContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
};

export const useTodoDispatch = () => {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
};

export const useTodoNextId = () => {
  const context = useContext(TodoNextIdContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
};
