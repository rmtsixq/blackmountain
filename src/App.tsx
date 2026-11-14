import { Header } from './components/Header'
import { MapView } from './components/MapView'
import { Sidebar } from './components/Sidebar'
import { useDem } from './hooks/useDem'

function App() {
  const state = useDem()

  return (
    <div className="flex min-h-svh flex-col bg-ink-950 font-sans text-zinc-300 lg:h-svh lg:overflow-hidden">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <MapView state={state} />
        <Sidebar dem={state.dem} />
      </main>
    </div>
  )
}

export default App
