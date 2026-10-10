import { useState } from 'react';
import NavLink from './NavLink';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Common/Logo/logo';
import {
    FaHome,
    FaSuitcaseRolling,
    FaHiking,
    FaCampground,
    FaMountain,
    FaTree,
    FaUserCircle
} from 'react-icons/fa';

function NavBar() {

    const { user } = useAuth();   // ✅ move hook inside component

    const [showOverlay, setShowOverlay] = useState(false);

    return (
        <>
            {/* Overlay */}
            <div
                className={`
                    fixed inset-0 z-10 hidden sm:block
                    pointer-events-none
                    transition-opacity duration-300
                    ${showOverlay ? 'opacity-60 bg-black' : 'opacity-0'}
                `}
            />

            {/* Sidebar */}
            <div
                className="
                fixed bottom-0 left-0 z-50
                h-16 w-full
                flex flex-row justify-around items-center
                px-2 py-1
                border-t border-white/10 bg-neutral-950/95 backdrop-blur-lg
                sm:bottom-auto sm:top-0 sm:h-full sm:w-14 sm:flex-col sm:justify-center sm:space-y-1.5 sm:bg-transparent sm:px-0 sm:py-3
                md:w-16 md:space-y-2
                "
            >
                <div className="absolute top-8 hidden h-28 w-28 items-center justify-center sm:flex">
                    <Logo />
                </div>

                <a className="min-w-0 flex-1 sm:flex-none" href="/">
                    <NavLink
                        icon={<FaHome className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                        label="Home"
                        onHover={setShowOverlay}
                    />
                </a>

                <a className="min-w-0 flex-1 sm:flex-none" href="/trips">
                    <NavLink
                        icon={<FaSuitcaseRolling className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                        label="Trips"
                        onHover={setShowOverlay}
                    />
                </a>

                <a className="min-w-0 flex-1 sm:flex-none" href="/treks">
                    <NavLink
                        icon={<FaHiking className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                        label="Treks"
                        onHover={setShowOverlay}
                    />
                </a>

                <a className="min-w-0 flex-1 sm:flex-none" href="/adventure-activity">
                    <NavLink
                        icon={<FaCampground className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                        label="Adventure Activity"
                        onHover={setShowOverlay}
                    />
                </a>

                <a className="min-w-0 flex-1 sm:flex-none" href="/peak-expedition">
                    <NavLink
                        icon={<FaMountain className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                        label="Peak Expedition"
                        onHover={setShowOverlay}
                    />
                </a>

                <a className="hidden min-w-0 flex-1 sm:block sm:flex-none" href="/park-development-design">
                    <NavLink
                        icon={<FaTree className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                        label="Park Development and Design"
                        onHover={setShowOverlay}
                    />
                </a>

                {/* Profile link */}
                <a className="min-w-0 flex-1 sm:flex-none" href={user ? "/profile" : "/auth"}>
                    <NavLink
                        icon={<FaUserCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                        label="Profile"
                        onHover={setShowOverlay}
                    />
                </a>

            </div>
        </>
    );
}

export default NavBar;