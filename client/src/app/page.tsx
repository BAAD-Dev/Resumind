import Navbar from "../components/Navbar";
import Stats from "../components/Stats";
import Hero from "../components/Hero";
import About from "@/components/About";
import Pricing from "@/components/Price";
import Footer from "@/components/Footer";
import Reviews from "@/components/Review";
import NavbarServer from "@/components/NavbarServer";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <NavbarServer />
      <Hero />
      <Stats />
      <About />
      <Pricing />
      <Reviews />
      <Footer />
    </main>
  );
}
