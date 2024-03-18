import { createId } from '@paralleldrive/cuid2'
import { useLocalStorage } from '@uidotdev/usehooks'
import { ReactNode, createContext, useContext } from 'react'
import { State, TodoData } from './types'

const TodosContext = createContext<Context | null>(null)

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useLocalStorage<State>('state', initialState)

  const { todos } = state

  const todosContext: Context = {
    todos,

    add: content => {
      setState({
        todos: [
          ...todos,
          {
            id: createId(),
            content,
            completed: false,
          },
        ],
      })
    },

    remove: id => {
      setState({
        todos: todos.filter(todo => todo.id !== id),
      })
    },

    update: (updatedTodo: TodoData) => {
      setState({
        todos: todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      })
    },

    clearCompleted: () => {
      setState({
        todos: todos.filter(todo => !todo.completed),
      })
    },
  }

  return <TodosContext.Provider value={todosContext}>{children}</TodosContext.Provider>
}

export function useTodos() {
  const context = useContext(TodosContext)
  if (!context) throw new Error('useTodos must be used within a TodosProvider')
  return context
}

const initialState: State = {
  todos: [],
}

type Context = {
  todos: TodoData[]
  add: (content: string) => void
  remove: (id: string) => void
  update: (todo: TodoData) => void
  clearCompleted: () => void
}
