"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Zap, ArrowDown } from "lucide-react"

interface BackgroundCirclesProps {
  onSignInClick: () => void
}

export function BackgroundCircles({ onSignInClick }: BackgroundCirclesProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Animated Background Circles */}
      <div className="absolute inset-0">
        {/* Large background circles */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/4 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.2, 0.4],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Smaller floating circles */}
        <motion.div
          className="absolute top-1/3 left-1/3 w-32 h-32 bg-emerald-400/30 rounded-full blur-2xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-teal-400/40 rounded-full blur-xl"
          animate={{
            y: [0, 25, 0],
            x: [0, -20, 0],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-3xl blur-xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent"
          >
            Welcome to
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Instasphere
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Connect, chat, and share in real-time. Experience the next generation of social communication.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-sm text-slate-200">Real-time messaging</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <span className="text-sm text-slate-200">Community channels</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-sm text-slate-200">Social feeds</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Button
              onClick={onSignInClick}
              size="lg"
              className="relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25"
            >
              <motion.span
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Get Started
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur-xl opacity-50"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center gap-2 text-slate-400"
          >
            <span className="text-sm">Scroll to explore</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30 pointer-events-none" />
    </div>
  )
}
