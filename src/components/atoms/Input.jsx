import { useState } from 'react'
import { motion } from 'framer-motion'

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  required = false,
  value,
  onChange,
  ...props 
}) => {
  const [focused, setFocused] = useState(false)
  const hasValue = value && value.toString().length > 0

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full h-12 px-3 pt-6 pb-2 text-surface-900 bg-white border rounded-lg
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20
            ${error ? 'border-error' : 'border-surface-300 focus:border-primary'}
            ${hasValue || focused ? 'pt-6 pb-2' : 'pt-4 pb-4'}
          `}
          {...props}
        />
        
        {label && (
          <motion.label
            initial={false}
            animate={{
              y: hasValue || focused ? -8 : 0,
              scale: hasValue || focused ? 0.85 : 1,
              transformOrigin: 'left center'
            }}
            className={`
              absolute left-3 pointer-events-none transition-colors duration-200
              ${hasValue || focused ? 'text-xs text-surface-500' : 'text-sm text-surface-600'}
              ${error ? 'text-error' : focused ? 'text-primary' : ''}
            `}
            style={{
              top: hasValue || focused ? '0.75rem' : '50%',
              marginTop: hasValue || focused ? '0' : '-0.5rem'
            }}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </motion.label>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input