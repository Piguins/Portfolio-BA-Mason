import { motion } from 'framer-motion'

interface ErrorAlertProps {
  error: string | null
  className?: string
}

export default function ErrorAlert({ error, className = '' }: ErrorAlertProps) {
  if (!error) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`error-alert ${className}`}
    >
      {error}
    </motion.div>
  )
}

