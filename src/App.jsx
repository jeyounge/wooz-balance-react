
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import QuestionPage from './pages/QuestionPage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'
import { Flame, History } from 'lucide-react'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        {/* Header */}
        <header className="w-full bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10 max-w-md mx-auto rounded-b-2xl">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="text-primary w-8 h-8 animate-pulse" />
            <h1 className="text-2xl font-black text-gray-800 tracking-tighter">
              Wooz <span className="text-primary">Balance</span>
            </h1>
          </Link>
          
          <Link to="/history" className="p-2 text-gray-400 hover:text-primary transition-colors">
            <History className="w-6 h-6" />
          </Link>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-md flex-1 p-4 flex flex-col justify-center">
          <Routes>
            <Route path="/" element={<QuestionPage />} />
            <Route path="/result/:id" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="w-full p-4 text-center text-gray-400 text-xs">
          © 2026 Wooz Labs. For fun only.
        </footer>
      </div>
    </Router>
  )
}

export default App
