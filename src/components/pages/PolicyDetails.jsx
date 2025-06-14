import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { policyService, claimService } from '@/services'

const PolicyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [policy, setPolicy] = useState(null)
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPolicyDetails()
  }, [id])

  const loadPolicyDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const [policyData, claimsData] = await Promise.all([
        policyService.getById(id),
        claimService.getByPolicyId(id)
      ])
      setPolicy(policyData)
      setClaims(claimsData)
    } catch (err) {
      setError(err.message || 'Failed to load policy details')
      toast.error('Failed to load policy details')
    } finally {
      setLoading(false)
    }
  }

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

  const calculateDaysUntilRenewal = () => {
    if (!policy?.endDate) return null
    const endDate = new Date(policy.endDate)
    const today = new Date()
    const diffTime = endDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleDownloadPolicy = () => {
    toast.success('Policy document download started')
  }

  const handleFileClaim = () => {
    navigate('/claims')
  }

  const handleRenewPolicy = () => {
    toast.info('Renewal process will be available 30 days before expiry')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-6 bg-surface-200 rounded w-32 mb-6"></div>
          <SkeletonLoader count={1} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState 
            message={error}
            onRetry={loadPolicyDetails}
          />
        </div>
      </div>
    )
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState 
            title="Policy not found"
            message="The requested policy could not be found."
            onRetry={() => navigate('/policies')}
          />
        </div>
      </div>
    )
  }

  const daysUntilRenewal = calculateDaysUntilRenewal()

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/policies')}
          className="mb-6"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Policies
        </Button>

        {/* Policy Overview */}
        <Card className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className={`
                w-16 h-16 rounded-lg flex items-center justify-center
                ${policy.type === 'health' ? 'bg-error/10 text-error' : ''}
                ${policy.type === 'auto' ? 'bg-primary/10 text-primary' : ''}
                ${policy.type === 'travel' ? 'bg-secondary/10 text-secondary' : ''}
                ${policy.type === 'life' ? 'bg-accent/10 text-accent' : ''}
                ${policy.type === 'home' ? 'bg-warning/10 text-warning' : ''}
              `}>
                <ApperIcon name={getIcon(policy.type)} className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-surface-900">
                  {policy.name}
                </h1>
                <p className="text-surface-500">
                  Policy No: {policy.policyNumber}
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge variant={getStatusVariant(policy.status)}>
                    {policy.status}
                  </Badge>
                  <span className="text-sm text-surface-500 capitalize">
                    {policy.type} Insurance
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleDownloadPolicy}
                variant="outline"
              >
                <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleFileClaim}>
                <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                File Claim
              </Button>
            </div>
          </div>

          {/* Renewal Alert */}
          {daysUntilRenewal !== null && daysUntilRenewal <= 30 && daysUntilRenewal > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center space-x-3">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-warning" />
                <div className="flex-1">
                  <h3 className="font-medium text-surface-900">
                    Policy Renewal Due
                  </h3>
                  <p className="text-sm text-surface-600">
                    Your policy expires in {daysUntilRenewal} days. Renew now to avoid coverage gaps.
                  </p>
                </div>
                <Button 
                  onClick={handleRenewPolicy}
                  variant="warning" 
                  size="sm"
                >
                  Renew Now
                </Button>
              </div>
            </motion.div>
          )}

          {/* Policy Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-surface-500 mb-1">Coverage Amount</p>
              <p className="text-xl font-bold text-surface-900">
                {formatCurrency(policy.coverageAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-surface-500 mb-1">Annual Premium</p>
              <p className="text-xl font-bold text-surface-900">
                {formatCurrency(policy.premium)}
              </p>
            </div>
            <div>
              <p className="text-sm text-surface-500 mb-1">Start Date</p>
              <p className="text-lg font-semibold text-surface-900">
                {formatDate(policy.startDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-surface-500 mb-1">End Date</p>
              <p className="text-lg font-semibold text-surface-900">
                {formatDate(policy.endDate)}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Benefits */}
          <Card>
            <h2 className="text-xl font-display font-bold text-surface-900 mb-4">
              Policy Benefits
            </h2>
            <div className="space-y-3">
              {policy.benefits?.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <ApperIcon name="Check" className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-surface-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Documents */}
          <Card>
            <h2 className="text-xl font-display font-bold text-surface-900 mb-4">
              Policy Documents
            </h2>
            <div className="space-y-3">
              {policy.documents?.map((document, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-surface rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <ApperIcon name="FileText" className="w-5 h-5 text-surface-500" />
                    <span className="text-surface-700">{document}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toast.success(`Downloading ${document}`)}
                  >
                    <ApperIcon name="Download" className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Claims History */}
        {claims.length > 0 && (
          <Card className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-surface-900">
                Claims History
              </h2>
              <Button 
                onClick={handleFileClaim}
                variant="outline" 
                size="sm"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                New Claim
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">
                      Claim ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-surface-500">
                      Filed Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim, index) => (
                    <motion.tr
                      key={claim.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-surface-100 hover:bg-surface-50"
                    >
                      <td className="py-3 px-4 text-sm text-surface-900">
                        {claim.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-surface-700 capitalize">
                        {claim.type}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-surface-900">
                        {formatCurrency(claim.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusVariant(claim.status)} size="sm">
                          {claim.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-surface-700">
                        {formatDate(claim.filedDate)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Payment History */}
        <Card className="mt-8">
          <h2 className="text-xl font-display font-bold text-surface-900 mb-6">
            Payment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-surface-900 mb-3">
                Next Premium Due
              </h3>
              {policy.nextPremiumDate ? (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">
                      {formatDate(policy.nextPremiumDate)}
                    </p>
                    <p className="text-sm text-surface-500">
                      Amount: {formatCurrency(policy.premium)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-surface-500">No upcoming payments</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 mb-3">
                Payment Method
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CreditCard" className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-surface-900">Auto-debit</p>
                  <p className="text-sm text-surface-500">
                    Ends with ****4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PolicyDetails