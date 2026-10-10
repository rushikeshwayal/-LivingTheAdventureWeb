import { useState } from 'react';
import NavLink from './NavLink';
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
    const [showOverlay, setShowOverlay] = useState(false);

    return (
        <>
            <div
                className={`fixed inset-0 z-10 pointer-events-none transition-opacity duration-300 ${showOverlay ? 'opacity-60 bg-black' : 'opacity-0'}`}
            />
            <div className="fixed top-0 left-0 h-full w-16 z-20 flex flex-col justify-center items-center py-4 space-y-2">
                <a href="/">
                    <NavLink
                        icon={<FaHome className="h-6 w-6" />}
                        label="Home"
                        onHover={setShowOverlay}
                    />
                </a>
                <a href="/trips">
                    <NavLink
                        icon={<FaSuitcaseRolling className="h-6 w-6" />}
                        label="Trips"
                        onHover={setShowOverlay}
                    />
                </a>
                <a href="/treks">
                    <NavLink
                        icon={<FaHiking className="h-6 w-6" />}
                        label="Treks"
                        onHover={setShowOverlay}
                    />
                </a>
                <a href="/adventure-activity">
                    <NavLink
                        icon={<FaCampground className="h-6 w-6" />}
                        label="Adventure Activity"
                        onHover={setShowOverlay}
                    />
                </a>
                <a href="/peak-expedition">
                    <NavLink
                        icon={<FaMountain className="h-6 w-6" />}
                        label="Peak Expedition"
                        onHover={setShowOverlay}
                    />
                </a>
                <a href="/park-development-design">
                    <NavLink
                        icon={<FaTree className="h-6 w-6" />}
                        label="Park Development and Design"
                        onHover={setShowOverlay}
                    />
                </a>
                <a href="/profile">
                    <NavLink
                        icon={<FaUserCircle className="h-6 w-6" />}
                        label="Profile"
                        onHover={setShowOverlay}
                    />
                </a>
            </div>
        </>
    );
}

export default NavBar;