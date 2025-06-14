import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorState = ({ 
  title = 'Something went wrong',
  message,
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">
        {message || 'We encountered an error while loading your data. Please try again.'}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState