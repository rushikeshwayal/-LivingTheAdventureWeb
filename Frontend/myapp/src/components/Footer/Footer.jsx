// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 py-12 px-16 md:px-20 w-full border-t border-gray-800">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:flex md:justify-around gap-10">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Company</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/about" className="hover:text-white transition-colors">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact-us" className="hover:text-white transition-colors">
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Legal</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/privacy-policy"
                                className="hover:text-white transition-colors"
                            >
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/terms-conditions"
                                className="hover:text-white transition-colors"
                            >
                                Terms & Conditions
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/refund-policy"
                                className="hover:text-white transition-colors"
                            >
                                Refund Policy
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">View Website in</h3>
                    <div className="flex items-center gap-2 text-gray-300">
                        <span>English</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Need Help?</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/help" className="hover:text-white transition-colors">
                                Visit Help Center
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact-us" className="hover:text-white transition-colors">
                                Share Feedback
                            </Link>
                        </li>
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

            <div className="max-w-full mx-auto text-sm text-gray-500 mt-12 space-y-3 flex-col justify-center items-center md:flex md:space-y-0 md:flex-row md:gap-6">
                <p>© 2026 LivingTheAdventure. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;