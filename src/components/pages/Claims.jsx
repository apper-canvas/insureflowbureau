import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ClaimCard from '@/components/molecules/ClaimCard'
import ClaimForm from '@/components/organisms/ClaimForm'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { claimService } from '@/services'

const Claims = () => {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadClaims()
  }, [])

  const loadClaims = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await claimService.getAll()
      setClaims(result)
    } catch (err) {
      setError(err.message || 'Failed to load claims')
      toast.error('Failed to load claims')
    } finally {
      setLoading(false)
    }
  }

  const filteredClaims = filterStatus === 'all' 
    ? claims 
    : claims.filter(claim => claim.status === filterStatus)

  const statusCounts = {
    all: claims.length,
    pending: claims.filter(c => c.status === 'pending').length,
    processing: claims.filter(c => c.status === 'processing').length,
    approved: claims.filter(c => c.status === 'approved').length,
    rejected: claims.filter(c => c.status === 'rejected').length
  }

  const handleNewClaim = () => {
    setShowClaimForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="h-8 bg-surface-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-64"></div>
          </div>
          <SkeletonLoader count={3} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState 
            message={error}
            onRetry={loadClaims}
          />
        </div>
      </div>
    )
  }

  if (showClaimForm) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setShowClaimForm(false)}
            className="mb-6"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Claims
          </Button>
          <ClaimForm />
        </div>
      </div>
    )
  }

  if (claims.length === 0) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon="FileText"
            title="No claims found"
            description="You haven't filed any insurance claims yet. If you need to make a claim, you can start the process here."
            actionLabel="File New Claim"
            onAction={handleNewClaim}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">
              My Claims
            </h1>
            <p className="text-surface-600 mt-1">
              Track and manage your insurance claims
            </p>
          </div>
          <Button 
            onClick={handleNewClaim}
            className="mt-4 sm:mt-0"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            File New Claim
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'all', label: 'All Claims', variant: 'default' },
            { key: 'pending', label: 'Pending', variant: 'warning' },
            { key: 'processing', label: 'Processing', variant: 'primary' },
            { key: 'approved', label: 'Approved', variant: 'success' },
            { key: 'rejected', label: 'Rejected', variant: 'error' }
          ].map(filter => (
            <motion.button
              key={filter.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(filter.key)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${filterStatus === filter.key
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-surface-600 hover:bg-surface-50 border border-surface-200'
                }
              `}
            >
              <span>{filter.label}</span>
              <Badge 
                variant={filterStatus === filter.key ? 'default' : filter.variant}
                size="sm"
                className={filterStatus === filter.key ? 'bg-white/20 text-white' : ''}
              >
                {statusCounts[filter.key]}
              </Badge>
            </motion.button>
          ))}
        </div>

        {/* Claims Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-card border border-surface-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-500 mb-1">Total Claims</p>
                <p className="text-2xl font-bold text-surface-900">{claims.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="FileText" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-surface-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-500 mb-1">Approved</p>
                <p className="text-2xl font-bold text-success">{statusCounts.approved}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-surface-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-500 mb-1">Processing</p>
                <p className="text-2xl font-bold text-warning">{statusCounts.processing}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card border border-surface-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-surface-500 mb-1">Settlement Rate</p>
                <p className="text-2xl font-bold text-primary">
                  {claims.length > 0 ? Math.round((statusCounts.approved / claims.length) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Claims Grid */}
        {filteredClaims.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClaims.map((claim, index) => (
              <ClaimCard 
                key={claim.id}
                claim={claim}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="Filter"
            title={`No ${filterStatus} claims`}
            description={`You don't have any ${filterStatus === 'all' ? '' : filterStatus} claims at the moment.`}
            actionLabel="View All Claims"
            onAction={() => setFilterStatus('all')}
          />
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/10">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ApperIcon name="HelpCircle" className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-surface-900 mb-2">
                Need Help with Your Claim?
              </h3>
              <p className="text-surface-600 mb-4">
                Our dedicated claims team is here to assist you throughout the process. 
                Get real-time updates and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" size="sm">
                  <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" size="sm">
                  <ApperIcon name="MessageCircle" className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Claims