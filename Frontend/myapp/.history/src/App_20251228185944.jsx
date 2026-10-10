// App.jsx
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import EventDetail from './components/EventDetails/Adventure/EventDetail.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home heroType="home" />} />
        <Route path="/treks" element={<Home heroType="trek" />} />
        <Route path="/trips" element={<Home heroType="trip" />} />
        <Route path="/adventure-activity" element={<Home heroType="adventure" />} />
        <Route path="/peak-expedition" element={<Home heroType="peek" />} />
        <Route path="/park-development-design" element={<Home heroType="parkdev" />} />
        <Route path="/eventDetails/:id" element={<EventDetail />} />
      </Routes>
    </Router>
  )
}

export default App
