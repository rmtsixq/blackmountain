import { Header } from './components/Header'
import { MapView } from './components/MapView'
import { Sidebar } from './components/Sidebar'
import { useWorld } from './hooks/useWorld'
import { useStore } from './store'

function App() {
  const state = useWorld()
  const mode = useStore((s) => s.mode)

  return (
    <div className="flex min-h-svh flex-col bg-ink-950 font-sans text-zinc-300 lg:h-svh lg:overflow-hidden">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <MapView state={state} />
        {mode === 'explore' && <Sidebar />}
      </main>
    </div>
  )
}

export default App
