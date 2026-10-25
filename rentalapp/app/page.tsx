import Header from './components/header';
import Hero from "./components/Hero";
import RecentlyAdded from './components/RecentlyAdded';
import Footer from './components/Footer';

export const revalidate = 60;

export default function Home() {
  return (
    <>
    <Header />
    <Hero />
    <RecentlyAdded />
    <Footer />
    </>
  );
}
