import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarExecutive from './components/NavbarExecutive.jsx';
import Home from './components/Home';
import NotFoundPage from './components/NotFoundPage';
import NavbarCustomer from "./components/NavbarCustomer.jsx";
import LoginCustomer from './components/LoginCustomer.jsx';
import LoginExecutive from './components/LoginExecutive.jsx';
import RegisterCustomer from "./components/RegisterCustomer.jsx";
import CustomerProfile from "./components/CustomerProfile.jsx";
import CustomerRequests from "./components/CustomerRequests.jsx";
import CustomerPersonalInformation from "./components/CustomerPersonalInformation.jsx";
import Loans from "./components/Loans.jsx";
import ExecutiveHome from './components/ExecutiveHome.jsx';
import CustomerHome from './components/CustomerHome.jsx';
import ManagementExecutive from "./components/ManagementExecutive.jsx";
import Simulation from "./components/Simulation";
import NavbarHome from "./components/NavbarHome.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<NavbarHome />}>
                    <Route index element={<Home />} />
                    <Route path="home" element={<Home />} />
                </Route>
                <Route path="/customer" element={<NavbarCustomer />}>
                    <Route path="home" element={<CustomerHome />} />
                    <Route path="login" element={<LoginCustomer />} />
                    <Route path="register" element={<RegisterCustomer />} />
                    <Route path="loans" element={<Loans />} />
                    <Route path="simulation" element={<Simulation />} />
                    <Route path="profile" element={<CustomerProfile />}>
                        <Route path="personal-information" element={<CustomerPersonalInformation />} />
                        <Route path="requests" element={<CustomerRequests />} />
                    </Route>
                </Route>
                <Route path="/executive" element={<NavbarExecutive />}>
                    <Route path="home" element={<ExecutiveHome />} />
                    <Route path="management" element={<ManagementExecutive />} />
                    <Route path="profile" element={<ExecutiveHome />} />
                    <Route path="login" element={<LoginExecutive />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}


export default App;
