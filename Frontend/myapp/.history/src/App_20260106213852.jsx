// App.jsx
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import EventDetail from './components/EventDetails/Adventure/EventDetail.jsx'
import ViewAll from './components/View/ViewAll.jsx';

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
        <Route path="/adventure" element={<ViewAll event_type="adventure" />} />
        <Route path="/trip" element={<ViewAll event_type="trip" />} />
        <Route path="/trek" element={<ViewAll event_type="trek" />} />
        <Route path="/peak" element={<ViewAll event_type="peak" />} />
        <Route path="/special_event" element={<ViewAll event_type="special_event" />} />
        <Route path="/best_of_the_year" element={<ViewAll event_type="best_of_the_year" />} />
      </Routes>
    </Router>
  )
}

export default App
