import { Repo } from '@automerge/automerge-repo'
import { BrowserWebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket'
import { RepoContext } from '@automerge/automerge-repo-react-hooks'
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { TodosProvider } from './TodosContext'

import '@ibm/plex/css/ibm-plex.css'
import './index.css'

const repo = new Repo({
  network: [new BrowserWebSocketClientAdapter('wss://sync.inkandswitch.com')],
  storage: new IndexedDBStorageAdapter('todos'),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RepoContext.Provider value={repo}>
      <TodosProvider>
        <App />
      </TodosProvider>
    </RepoContext.Provider>
  </React.StrictMode>
)
