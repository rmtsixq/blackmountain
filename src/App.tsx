import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { FullscreenHint } from './components/FullscreenHint'
import { Header } from './components/Header'
import { LanguageGate } from './components/LanguageGate'
import { MapView } from './components/MapView'
import { Sidebar } from './components/Sidebar'
import { useWorld } from './hooks/useWorld'
import { useStore } from './store'

function App() {
  const state = useWorld()
  const mode = useStore((s) => s.mode)
  const lang = useStore((s) => s.lang)
  // the hint follows the language screen only, not a deep link with ?lang=
  const [gated] = useState(() => lang === null)

  useEffect(() => {
    if (lang) document.documentElement.lang = lang
  }, [lang])

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-svh flex-col bg-paper font-sans text-ink-2 lg:h-svh lg:overflow-hidden">
        <Header />
        <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <MapView state={state} />
          {mode === 'explore' && <Sidebar />}
        </main>
      </div>
      {/* the data loads behind the choice */}
      <AnimatePresence>{lang === null && <LanguageGate />}</AnimatePresence>
      {gated && lang !== null && <FullscreenHint lang={lang} />}
    </MotionConfig>
  )
}

export default App
