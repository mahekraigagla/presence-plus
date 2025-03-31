import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
                {/* Add other routes here */}
                <Route component={NotFound} /> {/* Catch-all route */}
            </Switch>
        </Router>
    );
}

export default App;
