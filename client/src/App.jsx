import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Servers from './pages/Servers';
import Credits from './pages/Credits';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <ScrollTop />
      <main>
        <Routes>
          <Route path="/"        element={<Home />}    />
          <Route path="/servers" element={<Servers />} />
          <Route path="/credits" element={<Credits />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
