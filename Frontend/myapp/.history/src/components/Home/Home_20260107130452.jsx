import NavBar from '../Nav/NavBar';
import Hero from '../Hero/Hero';
import Footer from '../Footer/Footer';


function Home({ heroType }) {
    return (
        <main className="flex-1 flex flex-col">
            <div className="sticky top-0 z-40">
                <NavBar />
            </div>
            <Hero heroType={heroType} className="z-20 mb-10" />
            <div className="z-30 flex-col justify-center items-center w-full">
                <hr className='border-t border-white border-2 w-2xl' />
                <Footer />
            </div>

        </main>
    );
}

export default Home;
