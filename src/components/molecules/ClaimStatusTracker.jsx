import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { claimService } from '@/services'

const ClaimStatusTracker = ({ claim }) => {
  const steps = claimService.getStatusTimeline(claim)
  const currentStep = claimService.getCurrentStep(claim)
  const timeline = claimService.getEstimatedCompletion(claim)

  const getStepStatus = (stepIndex) => {
    if (claim.status === 'rejected' && stepIndex > currentStep) {
      return 'cancelled'
    }
    if (stepIndex < currentStep) {
      return 'completed'
    }
    if (stepIndex === currentStep) {
      return 'current'
    }
    return 'pending'
  }

  const getStepIcon = (stepIndex, status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle'
      case 'current':
        return 'Clock'
      case 'cancelled':
        return 'XCircle'
      default:
        return 'Circle'
    }
  }

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10'
      case 'current':
        return 'text-warning bg-warning/10'
      case 'cancelled':
        return 'text-error bg-error/10'
      default:
        return 'text-surface-300 bg-surface-100'
    }
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy')
  }

  const getProgressPercentage = () => {
    if (claim.status === 'approved') return 100
    if (claim.status === 'rejected') return (currentStep / steps.length) * 100
    return ((currentStep + 1) / steps.length) * 100
  }

  return (
    <div className="mt-4 p-4 bg-surface-50 rounded-lg border border-surface-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-surface-900 flex items-center">
          <ApperIcon name="Activity" className="w-4 h-4 mr-2" />
          Claim Progress
        </h4>
        <Badge 
          variant={
            claim.status === 'approved' ? 'success' : 
            claim.status === 'rejected' ? 'error' : 'warning'
          }
          size="sm"
        >
          {Math.round(getProgressPercentage())}% Complete
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-surface-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${
              claim.status === 'rejected' ? 'bg-error' : 
              claim.status === 'approved' ? 'bg-success' : 'bg-warning'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isLast = index === steps.length - 1
          
          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start"
            >
              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-6 bg-surface-200" />
              )}
              
              {/* Step Icon */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10
                ${getStepColor(status)}
              `}>
                <ApperIcon 
                  name={getStepIcon(index, status)} 
                  className="w-5 h-5" 
                />
              </div>

              {/* Step Content */}
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className={`
                    font-medium 
                    ${status === 'completed' ? 'text-success' : 
                      status === 'current' ? 'text-warning' : 
                      status === 'cancelled' ? 'text-error' : 'text-surface-400'}
                  `}>
                    {step.label}
                  </h5>
                  {status === 'current' && (
                    <span className="text-xs text-warning font-medium">
                      In Progress
                    </span>
                  )}
                  {status === 'completed' && (
                    <span className="text-xs text-success font-medium">
                      Completed
                    </span>
                  )}
                </div>
                <p className={`
                  text-sm mt-1 
                  ${status === 'cancelled' ? 'text-surface-400 line-through' : 'text-surface-600'}
                `}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Timeline Information */}
      <div className="mt-6 pt-4 border-t border-surface-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-surface-600">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
            Filed: {formatDate(claim.filedDate)}
          </div>
          <div className="flex items-center">
            {timeline.completed ? (
              <span className={`
                font-medium 
                ${claim.status === 'approved' ? 'text-success' : 'text-error'}
              `}>
                {timeline.message}
              </span>
            ) : (
              <div className="text-right">
                <div className="text-surface-600">
                  Est. completion: {formatDate(timeline.estimatedDate)}
                </div>
                <div className="text-warning font-medium">
                  ~{timeline.estimatedDays} days remaining
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Text */}
      {claim.status === 'pending' && (
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-sm text-primary">
            <ApperIcon name="Info" className="w-4 h-4 inline mr-1" />
            Your claim is being reviewed. You'll receive updates at each step.
          </p>
        </div>
      )}

      {claim.status === 'processing' && (
        <div className="mt-4 p-3 bg-warning/5 rounded-lg border border-warning/10">
          <p className="text-sm text-warning">
            <ApperIcon name="Clock" className="w-4 h-4 inline mr-1" />
            Processing is underway. We'll notify you once the next step is completed.
          </p>
        </div>
      )}
    </div>
  )
}

export default ClaimStatusTracker