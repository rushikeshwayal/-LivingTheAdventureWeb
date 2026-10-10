import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
const EASE = [0.16, 1, 0.3, 1];
const NAV_LINKS = [
 { label: "Events", to: "/admin/home" },
 { label: "Dashboard", to: "/admin/dashboard" },
 { label: "Heroes", to: "/admin/heroes" },
 { label: "Bookings", to: "/admin/bookings" },
 { label: "Guides", to: "/admin/guides" },
 { label: "Analytics", to: "/admin/analytics" },
 { label: "Users", to: "/admin/users" },
];
function BellIcon() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function ChevronIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>; }
export default function Navbar() {
 const [menuOpen,setMenuOpen]=useState(false),[mobileOpen,setMobileOpen]=useState(false);
 const menuRef=useRef(null), location=useLocation();
 const adminEmail=(()=>{try{return localStorage.getItem("admin_email")||"Admin"}catch{return "Admin"}})();
 const initial=adminEmail.charAt(0).toUpperCase();
 useEffect(()=>{function handleClick(e){if(menuRef.current&&!menuRef.current.contains(e.target))setMenuOpen(false)}document.addEventListener("mousedown",handleClick);return()=>document.removeEventListener("mousedown",handleClick)},[]);
 const handleLogout=()=>{localStorage.clear();sessionStorage.clear();window.location.replace("/")};
 const isActive=(to)=>location.pathname.startsWith(to);
 return <header className="sticky top-0 z-40 bg-[#1B222C]"><div className="mx-auto max-w-7xl px-6"><div className="flex h-16 items-center justify-between">
 <Link to="/admin/home" className="flex shrink-0 items-baseline gap-2"><span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-[#C9A55C]/80 sm:inline">Living The</span><span className="font-serif text-xl tracking-wide text-[#F5F2E9]">Adventure</span></Link>
 <nav className="hidden items-center gap-1 lg:flex">{NAV_LINKS.map(link=>{const active=isActive(link.to);return <Link key={link.to} to={link.to} className="relative px-3 py-2 text-sm font-medium"><span className={active?"text-[#F5F2E9]":"text-[#F5F2E9]/55 transition-colors hover:text-[#F5F2E9]/85"}>{link.label}</span>{active&&<motion.span layoutId="nav-underline" transition={{duration:.35,ease:EASE}} className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#A9782F]"/>}</Link>})}</nav>
 <div className="flex items-center gap-4"><button className="relative hidden text-[#F5F2E9]/60 transition-colors hover:text-[#F5F2E9] sm:flex" aria-label="Notifications"><BellIcon/><span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-[#A9782F]"/></button><div className="hidden h-6 w-px bg-[#F5F2E9]/10 sm:block"/>
 <div className="relative" ref={menuRef}><button onClick={()=>setMenuOpen(v=>!v)} className="group flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#A9782F]/40 bg-[#A9782F]/20 text-sm font-medium text-[#C9A55C]">{initial}</span><span className="hidden text-[#F5F2E9]/40 md:block"><ChevronIcon/></span></button><AnimatePresence>{menuOpen&&<motion.div initial={{opacity:0,y:-6,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-6,scale:.98}} transition={{duration:.18,ease:EASE}} className="absolute right-0 mt-3 w-52 overflow-hidden rounded-sm bg-[#F5F2E9] shadow-xl"><div className="border-b border-[#1B222C]/10 px-4 py-3"><p className="truncate text-xs text-[#6E6A5E]">{adminEmail}</p></div><button onClick={handleLogout} className="w-full px-4 py-2.5 text-left text-sm text-[#9C4A3C] hover:bg-[#9C4A3C]/5">Log out</button></motion.div>}</AnimatePresence></div>
 <button className="text-[#F5F2E9]/70 lg:hidden" onClick={()=>setMobileOpen(v=>!v)} aria-label="Toggle menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{mobileOpen?<path d="M18 6 6 18M6 6l12 12"/>:<path d="M3 6h18M3 12h18M3 18h18"/>}</svg></button></div></div></div>
 <AnimatePresence>{mobileOpen&&<motion.nav initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.3,ease:EASE}} className="overflow-hidden border-t border-[#F5F2E9]/10 lg:hidden"><div className="flex flex-col gap-1 px-6 py-3">{NAV_LINKS.map(link=><Link key={link.to} to={link.to} onClick={()=>setMobileOpen(false)} className={`py-2.5 text-sm font-medium ${isActive(link.to)?"text-[#C9A55C]":"text-[#F5F2E9]/60"}`}>{link.label}</Link>)}</div></motion.nav>}</AnimatePresence></header>;
}
