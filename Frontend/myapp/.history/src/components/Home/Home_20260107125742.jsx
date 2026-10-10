import NavBar from '../Nav/NavBar';
import Hero from '../Hero/Hero';
import Footer from '../Footer/Footer';


function Home({ heroType }) {
    return (
        <main className="flex-1 flex flex-col w-full min-h-screen">
            <div className="sticky top-0 z-40">
                <NavBar />
            </div>
            <Hero heroType={heroType} className="z-20 mb-10" />
            <div className="z-30 ">
                <div className='border-t border-white border-2 w-'></div>
                {/* <hr className='text-gray-600 max-w-52' /> */}
                <Footer />
            </div>

        </main>
    );
}

export default Home;
