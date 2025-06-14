import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'md',
  ...props 
}) => {
  const paddingSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <motion.div
      whileHover={hover ? { 
        y: -2,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
      } : {}}
      className={`
        bg-white rounded-lg shadow-card border border-surface-200
        transition-all duration-200 max-w-full overflow-hidden
        ${paddingSizes[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card