import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import ChatApp from './components/ChatApp'
import AdminDashboard from './components/AdminDashboard'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ChatApp />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
