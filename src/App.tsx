import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import PlayerDetails from './components/Players/PlayerDetails';

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/player/:playerKey" element={<PlayerDetails />} />
      </Routes>
    </Router>
  );
};

export default App;