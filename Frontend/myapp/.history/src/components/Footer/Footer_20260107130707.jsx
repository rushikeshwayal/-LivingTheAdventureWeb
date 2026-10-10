import React from "react";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 py-12 px-16 md:px-20 w-full ">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 items-center">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Company</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">View Website in</h3>
                    <div className="flex items-center gap-2 text-gray-300">
                        {/* <span className="text-xl">✔</span> */}
                        <span>English</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Need Help?</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-white transition-colors">Visit Help Center</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Share Feedback</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Connect with Us</h3>

                    <div className="flex items-center gap-6 mt-2 mb-6">
                        <FaFacebookF className="text-2xl hover:text-white transition-colors cursor-pointer" />
                        <FaXTwitter className="text-2xl hover:text-white transition-colors cursor-pointer" />
                    </div>

                </div>
            </div>
            <div className="max-w-7xl mx-auto text-sm text-gray-500 mt-12 space-y-3">
                <p>© 2025 STAR. All Rights Reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">Terms Of Use</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">FAQ</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
