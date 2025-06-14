import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm",
    secondary: "bg-white text-primary border border-primary hover:bg-primary/5 focus:ring-primary",
    accent: "bg-accent text-white hover:bg-accent/90 focus:ring-accent shadow-sm",
    success: "bg-success text-white hover:bg-success/90 focus:ring-success shadow-sm",
    outline: "border border-surface-300 text-surface-700 hover:bg-surface-50 focus:ring-primary",
    ghost: "text-surface-700 hover:bg-surface-100 focus:ring-primary"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12"
  }

  const disabledClasses = "opacity-50 cursor-not-allowed"

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? disabledClasses : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </motion.button>
  )
}

export default Button