'use client'

import { motion } from 'framer-motion'
import LogoutButton from '@/components/LogoutButton'
import DashboardCard from '@/components/DashboardCard'

type UserInfo = {
  name?: string | null
  email?: string | null
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function DashboardContent({ user }: { user: UserInfo }) {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
              Dashboard
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Xin chào, {user.name || user.email?.split('@')[0] || 'User'}
            </p>
          </div>
          <LogoutButton />
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={fadeInUp}>
            <DashboardCard
              title="Hero"
              description="Quản lý Hero Section (Name, Title, Description, Social Links)"
              link="/dashboard/hero"
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <DashboardCard
              title="Specializations"
              description="Quản lý Specializations (I specialize in - 3 cards)"
              link="/dashboard/specializations"
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <DashboardCard
              title="Projects"
              description="Quản lý Projects / Case Studies"
              link="/dashboard/projects"
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <DashboardCard
              title="Skills"
              description="Quản lý Skills, Tools, Certifications"
              link="/dashboard/skills"
            />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <DashboardCard
              title="Experience"
              description="Quản lý Experience / Timeline"
              link="/dashboard/experience"
            />
          </motion.div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Thông tin hệ thống</h3>
          <ul className="space-y-2 text-base text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Kết nối tới API Node.js + PostgreSQL
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Authentication với Supabase
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Protected routes và middleware
            </li>
          </ul>
        </motion.div>
      </div>
    </main>
  )
}

