import NavBar from "../Nav/NavBar";
import Hero from "../Hero/Hero";
import Footer from "../Footer/Footer";
import AuthButton from "../../Authentication/authButton";
import { useAuth } from "../../context/AuthContext";

function Home({ heroType }) {
    const { user } = useAuth();

    return (
        <main className="app-page flex min-h-screen flex-col">
            <NavBar />
            {!user && <AuthButton />}
            <div className="min-w-0 flex-1">
                <div className="relative md:pl-[76px]">
                    <Hero heroType={heroType} />
                </div>
                <div className="mx-auto my-8 h-px w-28 rounded-full bg-gradient-to-r from-transparent via-amber-300/40 to-transparent sm:my-10 md:ml-[calc(50%+38px)]" />
                <Footer />
            </div>
        </main>
    );
}

export default Home;
