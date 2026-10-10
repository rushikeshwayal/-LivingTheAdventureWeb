import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import Spinner from "./components/Spinner/Spinner.jsx";

const Home = lazy(() => import("./components/Home/Home.jsx"));
const EventDetail = lazy(() => import("./components/EventDetails/EventDetail.jsx"));
const ViewAll = lazy(() => import("./components/View/ViewAll.jsx"));
const Auth = lazy(() => import("./Authentication/Auth.jsx"));
const SignupForm = lazy(() => import("./Authentication/SignupForm.jsx"));
const Profile = lazy(() => import("./components/Profile/Profile.jsx"));
const AboutUs = lazy(() => import("./components/Legal/AboutUs.jsx"));
const ContactUs = lazy(() => import("./components/Legal/ContactUs.jsx"));
const PrivacyPolicyPage = lazy(() => import("./components/Legal/PrivacyPolicyPage.jsx"));
const TermsConditions = lazy(() => import("./components/Legal/TermsConditions.jsx"));
const RefundPolicy = lazy(() => import("./components/Legal/RefundPolicy.jsx"));
const HelpCenter = lazy(() => import("./components/Legal/HelpCenter.jsx"));

function App() {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={<div className="app-page flex min-h-screen items-center justify-center px-6"><Spinner label="Preparing your adventure" /></div>}>
                    <Routes>
                        <Route path="/" element={<Home heroType="home" />} />
                        <Route path="/treks" element={<Home heroType="trek" />} />
                        <Route path="/trips" element={<Home heroType="trip" />} />
                        <Route path="/adventure-activity" element={<Home heroType="adventure" />} />
                        <Route path="/peak-expedition" element={<Home heroType="peek" />} />
                        <Route path="/park-development-design" element={<Home heroType="parkdev" />} />
                        <Route path="/eventDetails/:id" element={<EventDetail />} />

                        <Route path="/adventure" element={<ViewAll event_type="adventure" />} />
                        <Route path="/trip" element={<ViewAll event_type="trip" />} />
                        <Route path="/trek" element={<ViewAll event_type="trek" />} />
                        <Route path="/peak" element={<ViewAll event_type="peak" />} />
                        <Route path="/special_event" element={<ViewAll event_type="special_event" />} />
                        <Route path="/best_of_the_year" element={<ViewAll event_type="best_of_the_year" />} />

                        <Route path="/adventure/upcoming" element={<ViewAll event_type="adventure" state="Upcoming" />} />
                        <Route path="/adventure/launched" element={<ViewAll event_type="adventure" state="Launched Now!" />} />
                        <Route path="/adventure/completed" element={<ViewAll event_type="adventure" state="Completed" />} />
                        <Route path="/adventure/inprogress" element={<ViewAll event_type="adventure" state="In Progress" />} />
                        <Route path="/adventure/launch" element={<ViewAll event_type="adventure" state="Launch" />} />

                        <Route path="/trip/upcoming" element={<ViewAll event_type="trip" state="Upcoming" />} />
                        <Route path="/trip/launched" element={<ViewAll event_type="trip" state="Launched Now!" />} />
                        <Route path="/trip/completed" element={<ViewAll event_type="trip" state="Completed" />} />
                        <Route path="/trip/inprogress" element={<ViewAll event_type="trip" state="In Progress" />} />
                        <Route path="/trip/launch" element={<ViewAll event_type="trip" state="Launch" />} />

                        <Route path="/trek/upcoming" element={<ViewAll event_type="trek" state="Upcoming" />} />
                        <Route path="/trek/launched" element={<ViewAll event_type="trek" state="Launched Now!" />} />
                        <Route path="/trek/completed" element={<ViewAll event_type="trek" state="Completed" />} />
                        <Route path="/trek/inprogress" element={<ViewAll event_type="trek" state="In Progress" />} />
                        <Route path="/trek/launch" element={<ViewAll event_type="trek" state="Launch" />} />

                        <Route path="/peek/upcoming" element={<ViewAll event_type="peak" state="Upcoming" />} />
                        <Route path="/peek/launched" element={<ViewAll event_type="peak" state="Launched Now!" />} />
                        <Route path="/peek/completed" element={<ViewAll event_type="peak" state="Completed" />} />
                        <Route path="/peek/inprogress" element={<ViewAll event_type="peak" state="In Progress" />} />
                        <Route path="/peek/launch" element={<ViewAll event_type="peak" state="Launch" />} />

                        <Route path="/special_event/upcoming" element={<ViewAll event_type="special_event" state="Upcoming" />} />
                        <Route path="/special_event/launched" element={<ViewAll event_type="special_event" state="Launched Now!" />} />
                        <Route path="/special_event/completed" element={<ViewAll event_type="special_event" state="Completed" />} />
                        <Route path="/special_event/inprogress" element={<ViewAll event_type="special_event" state="In Progress" />} />
                        <Route path="/special_event/launch" element={<ViewAll event_type="special_event" state="Launch" />} />

                        <Route path="/best_of_the_year/upcoming" element={<ViewAll event_type="best_of_the_year" state="Upcoming" />} />
                        <Route path="/best_of_the_year/launched" element={<ViewAll event_type="best_of_the_year" state="Launched Now!" />} />
                        <Route path="/best_of_the_year/completed" element={<ViewAll event_type="best_of_the_year" state="Completed" />} />
                        <Route path="/best_of_the_year/inprogress" element={<ViewAll event_type="best_of_the_year" state="In Progress" />} />
                        <Route path="/best_of_the_year/launch" element={<ViewAll event_type="best_of_the_year" state="Launch" />} />

                        <Route path="/auth" element={<Auth />} />
                        <Route path="/signup" element={<SignupForm />} />
                        <Route path="/profile" element={<Profile />} />

                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms-conditions" element={<TermsConditions />} />
                        <Route path="/refund-policy" element={<RefundPolicy />} />
                        <Route path="/help" element={<HelpCenter />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;
