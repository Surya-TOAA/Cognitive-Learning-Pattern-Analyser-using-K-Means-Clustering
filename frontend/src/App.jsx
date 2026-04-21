import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import DashboardApp from './DashboardApp';

function App() {
    const [currentView, setCurrentView] = useState('landing');

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (loggedIn) {
            // Optional: Auto-redirect if you want the user to skip landing if logged in
            // For now, let's keep landing as entry but skip auth if the button is clicked.
        }
    }, []);

    const handleGetStarted = () => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (loggedIn) {
            setCurrentView('app');
        } else {
            setCurrentView('auth');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setCurrentView('landing');
    };

    return (
        <div className="app-root">
            {currentView === 'landing' && (
                <LandingPage onGetStarted={handleGetStarted} />
            )}

            {currentView === 'auth' && (
                <AuthPage
                    onLogin={() => {
                        localStorage.setItem('isLoggedIn', 'true');
                        setCurrentView('app');
                    }}
                    onBackToLanding={() => setCurrentView('landing')}
                />
            )}

            {currentView === 'app' && (
                <DashboardApp onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;
