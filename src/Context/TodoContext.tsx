import { createContext, useContext, useReducer, useRef } from 'react';

type TodoType = {
  id: number;
  text: string;
  done: boolean;
};

type TodoTypeArray = TodoType[];

const initialValue: TodoTypeArray = [
  { id: 1, text: '프로젝트 생성하기', done: true },

  { id: 2, text: '안녕', done: true },

  { id: 3, text: '안녕하세요', done: true },

  { id: 4, text: '오랜만', done: true },
];

const todoReducer = (state: TodoTypeArray, action: any) => {
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
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const TodoStateContext = createContext<TodoTypeArray>(initialValue);
const TodoDispatchContext = createContext<React.Dispatch<any> | undefined>(
  undefined
);
const TodoNextIdContext = createContext<any>(5);

type TodoProviderProps = {
  children: React.ReactNode;
};
export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [state, dispatch] = useReducer(todoReducer, initialValue);
  const nextId = useRef<number>(5);
  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        <TodoNextIdContext.Provider value={nextId}>
          {children}
        </TodoNextIdContext.Provider>
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
};

export const useTodoState = () => {
  const context = useContext(TodoStateContext);
  if (!context) {
    throw new Error('state컨텍스트가 없대요');
  }
  return context;
};

export const useTodoDispatch = () => {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error('dispatch 컨텍스트가 없대요');
  }
  return context;
};

export const useTodoNextId = () => {
  const context = useContext(TodoNextIdContext);
  if (!context) {
    throw new Error('nextId 컨텍스트가 없대요');
  }
  return context;
};
