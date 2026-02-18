import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ApiProvider } from './context/ApiContext'
import { HistoryProvider } from './context/HistoryContext'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Compress from './pages/Compress'
import History from './pages/History'
import Compare from './pages/Compare'
import Settings from './pages/Settings'
import About from './pages/About'
import './App.css'

export default function App() {
  return (
    <ApiProvider>
      <HistoryProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/compress" element={<Compress />} />
              <Route path="/history" element={<History />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </HistoryProvider>
    </ApiProvider>
  )
}
