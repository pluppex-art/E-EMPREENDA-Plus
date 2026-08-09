import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Inscricao from './pages/Inscricao'
import Obrigado from './pages/Obrigado'
import Expectativas from './pages/Expectativas'
import ObrigadoPesquisa from './pages/ObrigadoPesquisa'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscricao" element={<Inscricao />} />
        <Route path="/obrigado" element={<Obrigado />} />
        <Route path="/expectativas" element={<Expectativas />} />
        <Route path="/obrigado-pesquisa" element={<ObrigadoPesquisa />} />
      </Routes>
    </BrowserRouter>
  )
}

