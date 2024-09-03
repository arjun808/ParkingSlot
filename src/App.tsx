// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpaceManager from './components/Testin';
import PaymentPage from './components/PaymentPage';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<SpaceManager />} />
            <Route path="/payment/:id" element={<PaymentPage/>} />
        </Routes>
    </Router>
);

export default App;
