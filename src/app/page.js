"use client";
import { Header } from "@/app/dashboard/components/Header";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Video, FileText, Clock, Shield, Stethoscope } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Easy Appointments",
    description: "Book appointments with top doctors in just a few clicks. Choose your preferred time slot.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Video,
    title: "Video Consultations",
    description: "Connect with doctors through secure video calls from anywhere, anytime.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: FileText,
    title: "Digital Records",
    description: "Access all your medical records, prescriptions, and test results in one place.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock medical assistance for emergencies and queries.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your health data is encrypted and protected with industry-leading security.",
    gradient: "from-red-500 to-rose-500"
  },
  {
    icon: Stethoscope,
    title: "Expert Doctors",
    description: "Certified and experienced healthcare professionals across all specialties.",
    gradient: "from-teal-500 to-cyan-500"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <section className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-4 px-6 mx-auto">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Your Health,  
              </span>{" "}
              <span className="text-gray-800">Our Responsibility.</span>
            </h1>

            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              A modern healthcare platform to track medicine schedules, maintain streaks, 
              monitor reports, and stay closer to your doctor—anytime, anywhere.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl text-white text-lg font-semibold 
                bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition"
              >
                Get Started
              </motion.a>

              <motion.a
                href="/login"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl text-gray-700 border border-gray-300 text-lg font-semibold
                hover:border-blue-500 hover:text-blue-500 transition"
              >
                Log In
              </motion.a>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center relative"
          >
            <div className="absolute inset-0 bg-purple-400 blur-3xl opacity-20 rounded-full"></div>
            <Image
              src="/doctori.png"
              alt="Healthcare Illustration"
              width={450}
              height={450}
              className="relative z-10 drop-shadow-xl"
            />
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />

          <div className="max-w-7xl mx-auto px-6 relative">

            {/* Section Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-20"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full mb-6 shadow-lg"
              >
                Why Choose Us
              </motion.span>

              <h2 className="text-gray-900 mb-6">
                Everything You Need for{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Better Health
                </span>
              </h2>

              <p className="text-gray-600">
                Comprehensive healthcare solutions designed to make your life easier and healthier.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ y: -10 }}
                    className="group relative p-8 rounded-3xl bg-white border border-gray-200 hover:shadow-2xl hover:border-transparent transition-all"
                  >
                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl`}
                    />

                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>

                    <h3 className="text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      Learn more →
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
