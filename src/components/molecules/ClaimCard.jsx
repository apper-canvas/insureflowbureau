import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Card from '@/components/atoms/Card'

const ClaimCard = ({ claim, index }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'processing': return 'warning'
      case 'pending': return 'default'
      default: return 'default'
    }
  }

  const getIcon = (type) => {
    const iconMap = {
      medical: 'Heart',
      accident: 'AlertTriangle',
      baggage: 'Package',
      theft: 'Shield'
    }
    return iconMap[type] || 'FileText'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <ApperIcon name={getIcon(claim.type)} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 capitalize">
                {claim.type} Claim
              </h3>
              <p className="text-sm text-surface-500">
                Claim ID: {claim.id}
              </p>
            </div>
          </div>
          <Badge variant={getStatusVariant(claim.status)}>
            {claim.status}
          </Badge>
        </div>

        <p className="text-surface-600 text-sm mb-4 line-clamp-3">
          {claim.description}
        </p>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-surface-500">Claim Amount:</span>
            <span className="font-semibold text-surface-900">
              {formatCurrency(claim.amount)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-surface-500">Filed Date:</span>
            <span className="text-surface-900">
              {formatDate(claim.filedDate)}
            </span>
          </div>

          {claim.status === 'approved' && claim.settlementAmount && (
            <div className="flex justify-between">
              <span className="text-sm text-surface-500">Settlement Amount:</span>
              <span className="font-semibold text-success">
                {formatCurrency(claim.settlementAmount)}
              </span>
            </div>
          )}

          {claim.status === 'processing' && claim.estimatedSettlement && (
            <div className="flex justify-between">
              <span className="text-sm text-surface-500">Estimated Settlement:</span>
              <span className="font-semibold text-warning">
                {formatCurrency(claim.estimatedSettlement)}
              </span>
            </div>
          )}

          {claim.status === 'rejected' && claim.rejectionReason && (
            <div className="mt-3 p-3 bg-error/5 rounded-lg">
              <p className="text-sm text-error">
                <strong>Rejection Reason:</strong> {claim.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default ClaimCard