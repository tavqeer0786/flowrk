import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  Menu, X, Home, Search, Briefcase, Shield, User, LogIn,
  ChevronDown, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GoogleTranslate from '@/components/GoogleTranslate';

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authStatus = await base44.auth.isAuthenticated();
      setIsAuthenticated(authStatus);
      if (authStatus) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async () => {
    try {
      await base44.auth.loginWithGoogle();
      // After login, check role
      const user = await base44.auth.me();
      if (user?.user_role) {
        // Redirect based on role
        if (user.user_role === 'worker') navigate(createPageUrl('WorkerHome'));
        else if (user.user_role === 'employer') navigate(createPageUrl('EmployerHome'));
      } else {
        // New user or no role selected
        navigate(createPageUrl('RoleSelection'));
      }
      // Force refresh of auth state in UI
      checkAuth();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  // Navigation links - available to all users
  const navLinks = [
    { name: 'Home', page: 'Home', icon: Home },
    { name: 'Find Work', page: 'FindWork', icon: Search },
    { name: 'Post Work', page: 'PostWork', icon: Briefcase },
    { name: 'Safety', page: 'Safety', icon: Shield },
  ];

  const getDashboardLink = () => {
    if (user?.user_role === 'worker') return 'WorkerHome';
    if (user?.user_role === 'employer') return 'EmployerHome';
    return 'RoleSelection';
  };

  // Hide layout on certain pages
  const hideLayout = ['RoleSelection', 'WorkerRegistration', 'EmployerRegistration'].includes(currentPageName);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom CSS Variables */}
      <style>{`
        :root {
          --color-primary: #0d9488;
          --color-primary-dark: #0f766e;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgA46Qw6ntDkJiXcPEliuaml-QgRXmUDGlZU3Oa1pvW6_3FNri7I2wcDxCCuzf4lzDI2hIMabw_nLFFK0Z4lrY1S950KpkB0vqAa6x5zMZHmoN4D9ROY4oWFUVcJgCRizv9rNV20PFRUKXl4Jbn-PkNkpvZbqerbm4oGX8cYozirHzmrOPBH1tmHKdzJT6G/s1600/logo.png"
                alt="Flowrk Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <span className="font-bold text-xl text-gray-900">Flowrk</span>
                <span className="text-teal-600 font-bold">.in</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors
                    ${currentPageName === link.page
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              <div className="mr-2">
                <GoogleTranslate />
              </div>
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                        {user?.full_name?.[0] || user?.email?.[0] || 'U'}
                      </div>
                      <span className="max-w-[100px] truncate">{user?.full_name?.split(' ')[0] || 'User'}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate(createPageUrl(getDashboardLink()))}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <X className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={handleLogin} className="bg-teal-600 hover:bg-teal-700 rounded-xl">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login / Signup
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                      ${currentPageName === link.page
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                ))}

                <div className="pt-4 border-t">
                  <div className="mb-4 flex justify-center">
                    <GoogleTranslate />
                  </div>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={createPageUrl(getDashboardLink())}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50"
                      >
                        <X className="w-5 h-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogin();
                      }}
                      className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl h-12"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login / Signup
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgA46Qw6ntDkJiXcPEliuaml-QgRXmUDGlZU3Oa1pvW6_3FNri7I2wcDxCCuzf4lzDI2hIMabw_nLFFK0Z4lrY1S950KpkB0vqAa6x5zMZHmoN4D9ROY4oWFUVcJgCRizv9rNV20PFRUKXl4Jbn-PkNkpvZbqerbm4oGX8cYozirHzmrOPBH1tmHKdzJT6G/s1600/logo.png"
                  alt="Flowrk Logo"
                  className="h-12 w-auto object-contain bg-white rounded-lg px-2"
                />
              </div>
              <p className="text-gray-400 mb-4 max-w-sm">
                Find work or workers in your area — no resume, no agents
              </p>
              <p className="text-sm text-gray-500">
                India's trusted local job platform for daily wage workers
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to={createPageUrl('FindWork')} className="hover:text-teal-400 transition-colors">
                    Find Work
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('PostWork')} className="hover:text-teal-400 transition-colors">
                    Post Work
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('Safety')} className="hover:text-teal-400 transition-colors">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('AboutUs')} className="hover:text-teal-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl('ContactUs')} className="hover:text-teal-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-white mb-4">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <Link to={`${createPageUrl('FindWork')}?category=painting`} className="hover:text-teal-400 transition-colors">
                    Painting
                  </Link>
                </li>
                <li>
                  <Link to={`${createPageUrl('FindWork')}?category=cleaning`} className="hover:text-teal-400 transition-colors">
                    Cleaning
                  </Link>
                </li>
                <li>
                  <Link to={`${createPageUrl('FindWork')}?category=delivery`} className="hover:text-teal-400 transition-colors">
                    Delivery
                  </Link>
                </li>
                <li>
                  <Link to={`${createPageUrl('FindWork')}?category=shop_helper`} className="hover:text-teal-400 transition-colors">
                    Shop Helper
                  </Link>
                </li>
                <li>
                  <Link to={`${createPageUrl('FindWork')}?category=event_work`} className="hover:text-teal-400 transition-colors">
                    Event Work
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 Flowrk.in. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to={createPageUrl('Safety')} className="hover:text-teal-400 transition-colors">
                Report Fake Job
              </Link>
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">Made with ❤️ in India</span>
              <span className="text-gray-500">Developed By: Tavqeer Hussain</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}