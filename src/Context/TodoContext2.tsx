import React, { createContext, useContext, useReducer, useRef } from 'react';

// todoContext2에는 김민준님(velopert)이 제시하는 타입스크립트 가이드라인을 따라서 작성해보았다
// 내가 만든 todoContext 랑 많이 비교해보면 좋을 듯

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

// action 의 타입으로는 각 액션의 타입을 or 로 연결 해주면된다

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

const TodoStateContext = createContext<TypeOfState>(initialTodos);
// 디스패치를 위한 타입 (Dispatch 를 리액트에서 불러올 수 있음), 액션들의 타입을 Dispatch 의 Generics로 설정
const TodoDispatchContext = createContext<
  React.Dispatch<actionType> | undefined
>(undefined);

// useRef는 값이 변하더라도 context에 리렌더링을 일으키지 않아서 그 이점을 이용해 변수를 관리하는데 쓰려고 하는데...
// 제네릭에 어떤 타입을 넣어 줘야 될 지 아직 잘 모르겠다

const TodoNextIdContext = createContext<any>(5);

export function TodoProvider({ children }: { children: React.ReactNode }) {
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

// 커스텀 Hook을 만들어 null check을 해준다
// critical 한 건 아니지만 이런 습관을 들이면 좋다

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
