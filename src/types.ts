export interface State {
  todos: TodoData[]
}

export interface TodoData {
  id: string
  content: string
  completed: boolean
}

export const Filter = {
  all: 'all',
  incomplete: 'incomplete',
  completed: 'completed',
} as const
export type Filter = (typeof Filter)[keyof typeof Filter]
