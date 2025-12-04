"use client";

import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section */}
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-blue-300 to-purple-300 p-2 rounded-xl shadow"
            >
              <Heart className="w-6 h-6 text-white fill-white" />
            </motion.div>

            <span className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              HealthCare Plus
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {["Services", "About", "Doctors", "Contact"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.08 }}
                className="text-gray-700 hover:text-blue-500 transition relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">

            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2.5 text-gray-700 hover:text-blue-500 transition"
            >
              Log In
            </motion.a>

            <motion.a
              href="/signup"
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow hover:shadow-lg transition"
            >
              Sign Up
            </motion.a>

          </div>

          {/* Mobile Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 text-gray-600 hover:text-blue-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>

        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-gray-200">
                <nav className="flex flex-col gap-4">

                  {["Services", "About", "Doctors", "Contact"].map((item, index) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="text-gray-700 hover:text-blue-500 py-2"
                    >
                      {item}
                    </motion.a>
                  ))}

                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">

                    <motion.a
                      href="/login"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:border-blue-400 hover:text-blue-500 transition"
                    >
                      Log In
                    </motion.a>

                    <motion.a
                      href="/signup"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow hover:shadow-lg transition"
                    >
                      Sign Up
                    </motion.a>

                  </div>

                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
}
