import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Gallery from '../components/Gallery';
import HowToStart from '../components/HowToStart';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <Hero />
      <Features />
      <Gallery />
      <HowToStart />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default HomePage;
