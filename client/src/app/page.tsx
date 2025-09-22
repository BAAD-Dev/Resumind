import About from "@/components/homepage/About";
import Footer from "@/components/homepage/Footer";
import Hero from "@/components/homepage/Hero";
import NavbarServer from "@/components/NavbarServer";
import Pricing from "@/components/homepage/Price";
import Reviews from "@/components/homepage/Review";
import Stats from "@/components/homepage/Stats";

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
