import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';

const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const BookTechnician = lazy(() => import('./pages/BookTechnician'));
const BookConfirm = lazy(() => import('./pages/BookConfirm'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const RateService = lazy(() => import('./pages/RateService'));
const Technicians = lazy(() => import('./pages/Technicians'));
const TechnicianProfile = lazy(() => import('./pages/TechnicianProfile'));
const Join = lazy(() => import('./pages/Join'));
const Partners = lazy(() => import('./pages/Partners'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const About = lazy(() => import('./pages/About'));
const Faq = lazy(() => import('./pages/Faq'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Admin = lazy(() => import('./pages/Admin'));
const Legal = lazy(() => import('./pages/Legal'));
const Credits = lazy(() => import('./pages/Credits'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="book/:slug" element={<BookTechnician />} />
        <Route path="book/:slug/confirm" element={<BookConfirm />} />
        <Route path="booking/:id/success" element={<BookingSuccess />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="rate/:bookingId" element={<RateService />} />
        <Route path="technicians" element={<Technicians />} />
        <Route path="technicians/:id" element={<TechnicianProfile />} />
        <Route path="join" element={<Join />} />
        <Route path="partners" element={<Partners />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<Faq />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="admin" element={<Admin />} />
        <Route path="privacy" element={<Legal doc="privacy" />} />
        <Route path="terms" element={<Legal doc="terms" />} />
        <Route path="cancellation-refund" element={<Legal doc="cancellation" />} />
        <Route path="credits" element={<Credits />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
