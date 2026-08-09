import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Inscricao from './pages/Inscricao'
import Obrigado from './pages/Obrigado'
import Expectativas from './pages/Expectativas'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscricao" element={<Inscricao />} />
        <Route path="/obrigado" element={<Obrigado />} />
        <Route path="/expectativas" element={<Expectativas />} />
      </Routes>
    </BrowserRouter>
  )
}

