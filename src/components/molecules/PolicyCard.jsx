import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Card from '@/components/atoms/Card'

const PolicyCard = ({ policy, index }) => {
  const navigate = useNavigate()

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'expired': return 'error'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  const getIcon = (type) => {
    const iconMap = {
      health: 'Heart',
      auto: 'Car',
      travel: 'Plane', 
      life: 'Shield',
      home: 'Home'
    }
    return iconMap[type] || 'Shield'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'dd MMM yyyy')
  }

  const handleViewDetails = () => {
    navigate(`/policy/${policy.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              ${policy.type === 'health' ? 'bg-error/10 text-error' : ''}
              ${policy.type === 'auto' ? 'bg-primary/10 text-primary' : ''}
              ${policy.type === 'travel' ? 'bg-secondary/10 text-secondary' : ''}
              ${policy.type === 'life' ? 'bg-accent/10 text-accent' : ''}
              ${policy.type === 'home' ? 'bg-warning/10 text-warning' : ''}
            `}>
              <ApperIcon name={getIcon(policy.type)} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-surface-900">
                {policy.name}
              </h3>
              <p className="text-sm text-surface-500">
                {policy.policyNumber}
              </p>
            </div>
          </div>
          <Badge variant={getStatusVariant(policy.status)}>
            {policy.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-surface-500">Coverage Amount</p>
            <p className="font-semibold text-surface-900">
              {formatCurrency(policy.coverageAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-surface-500">Annual Premium</p>
            <p className="font-semibold text-surface-900">
              {formatCurrency(policy.premium)}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-surface-500">Start Date:</span>
            <span className="text-surface-900">{formatDate(policy.startDate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-surface-500">End Date:</span>
            <span className="text-surface-900">{formatDate(policy.endDate)}</span>
          </div>
          {policy.nextPremiumDate && (
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Next Premium:</span>
              <span className="text-surface-900">{formatDate(policy.nextPremiumDate)}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" size="sm" className="flex-1">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleViewDetails} size="sm" className="flex-1">
            View Details
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default PolicyCard