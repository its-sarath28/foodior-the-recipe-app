import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Routers from "../routes/Routers";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[82vh]">
        <Routers />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
