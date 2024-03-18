import { DocumentId, Repo } from '@automerge/automerge-repo'
import { useDocument, useRepo } from '@automerge/automerge-repo-react-hooks'
import { filter } from '@onsetsoftware/mutable-js'
import { createId } from '@paralleldrive/cuid2'
import { useLocalStorage } from '@uidotdev/usehooks'
import { ReactNode, createContext, useContext } from 'react'
import { State, TodoData } from './types'

const TodosContext = createContext<Context | null>(null)

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const repo = useRepo()
  const docId = useDocId(repo)
  const [doc, changeDoc] = useDocument<State>(docId)

  if (!doc) return null

  const { todos } = doc

  const todosContext: Context = {
    todos,

    add: content => {
      changeDoc(doc => {
        doc.todos.push({
          id: createId(),
          content,
          completed: false,
        })
      })
    },

    remove: id => {
      changeDoc(doc => {
        const index = doc.todos.findIndex(todo => todo.id === id)
        doc.todos.splice(index, 1)
      })
    },

    update: (updatedTodo: TodoData) => {
      changeDoc(doc => {
        const todo = doc.todos.find(todo => todo.id === updatedTodo.id)
        if (todo) {
          todo.content = updatedTodo.content
          todo.completed = updatedTodo.completed
        }
      })
    },

    clearCompleted: () => {
      changeDoc(doc => {
        filter(doc.todos, todo => !todo.completed)
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

const useDocId = (repo: Repo) => {
  const [docId, setDocId] = useLocalStorage<DocumentId | undefined>('docId')

  if (docId) {
    // document already exists
    return docId
  } else {
    // create a new document
    const newId = repo.create(initialState).documentId
    setDocId(newId)
    return newId
  }
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
