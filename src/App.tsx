import cx from 'classnames'
import { useRef, useState } from 'react'

import { Todo } from './Todo'
import { useTodos } from './TodosContext'
import { Filter } from './types'

export function App() {
  const newTodoInput = useRef<HTMLInputElement>(null)
  const [filter, setFilter] = useState<Filter>(Filter.all)

  const { todos, add, clearCompleted } = useTodos()

  const getFilteredTodos = (filter: Filter) => {
    return todos.filter(async todo => {
      if (filter === Filter.all) return true
      if (filter === Filter.completed) return todo.completed
      if (filter === Filter.incomplete) return !todo.completed
      return false
    })
  }

  return (
    <>
      <div className="h-screen p-4 bg-primary-50">
        <div className="mx-auto flex flex-col w-4/5 max-w-xl border border-neutral-300 shadow-md rounded-md bg-white">
          {/* new todo form */}
          <header className="p-1">
            <form
              onSubmit={e => {
                e.preventDefault()
                if (!newTodoInput.current) return
                const newTodoText = newTodoInput.current.value.trim()
                if (newTodoText.length === 0) return
                add(newTodoText)
                newTodoInput.current.value = ''
              }}
            >
              <input
                className="w-full p-2 rounded-md"
                placeholder="Add a new todo"
                ref={newTodoInput}
                autoFocus={true}
              />
            </form>
          </header>

          {/* todos */}
          <section>
            <ul className="border-y divide-y divide-solid">
              {getFilteredTodos(filter).map(todo => (
                <Todo key={todo.id} {...todo} />
              ))}
            </ul>
          </section>

          {/* footer  */}
          <footer className="p-3 flex justify-between items-center text-sm">
            {/* filters */}
            <ul className="flex-1 flex space-x-1 cursor-pointer">
              {Object.keys(Filter).map(k => {
                const key = k as Filter
                const active = key === filter

                const buttonStyle = cx({
                  ['text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md']: !active,
                  ['bg-gray-100 text-gray-700 px-3 py-2 font-medium text-sm rounded-md']: active,
                })

                return (
                  <li className="leading-none" key={`filter-${key}`}>
                    <button className={buttonStyle} onClick={() => setFilter(key)}>
                      {key}
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* clear completed button */}
            <div className="flex-1 text-right">
              <button
                className={cx(
                  'leading-none border py-2 px-4 rounded-md',
                  'hover:border-primary-600 hover:bg-primary-500 hover:text-white'
                )}
                onClick={e => clearCompleted()}
              >
                Clear completed
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
