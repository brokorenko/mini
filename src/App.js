import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Create from './pages/Create';
import Manage from './pages/Manage';

function App() {
    return (
        <Router>
            <div className='card-main'>
                <Navbar />
                <Routes>
                    <Route path="/mini" element={<Create />} />
                    <Route path="/manage" element={<Manage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
