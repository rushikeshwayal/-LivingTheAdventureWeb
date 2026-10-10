import NavBar from '../Nav/NavBar';
import Hero from '../Hero/Hero';
import Footer from '../Footer/Footer';
import AuthButton from '../../Authentication/authButton';
import { useAuth } from '../../context/AuthContext';

function Home({ heroType }) {
    const { user } = useAuth();
    return (
        <main className="flex min-h-screen flex-col overflow-x-clip bg-black text-white">

            {/* Navbar */}
            <div className="sticky top-0 z-40">
                <NavBar />
            </div>
            {user ? null : <div className='z-40'>
                <AuthButton />
            </div>}
            {/* Hero */}
            <div className="relative z-20 min-w-0 flex-1">
                <Hero heroType={heroType} />
            </div>

            {/* Divider + Footer */}
            <div className="relative z-30 w-full pb-16 sm:pb-0">

                {/* Center Divider */}
                <div className="flex justify-center px-5 py-6 sm:py-8">
                    <div className="h-px w-24 rounded-full bg-amber-300/60 sm:w-48 md:w-52" />
                </div>

                <Footer />
            </div>

        </main>
    );
}

export default Home;
