import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import PolicyCard from '@/components/molecules/PolicyCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { policyService } from '@/services'

const MyPolicies = () => {
  const navigate = useNavigate()
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadPolicies()
  }, [])

  const loadPolicies = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await policyService.getAll()
      setPolicies(result)
    } catch (err) {
      setError(err.message || 'Failed to load policies')
      toast.error('Failed to load policies')
    } finally {
      setLoading(false)
    }
  }

  const filteredPolicies = filterStatus === 'all' 
    ? policies 
    : policies.filter(policy => policy.status === filterStatus)

  const statusCounts = {
    all: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    expired: policies.filter(p => p.status === 'expired').length,
    pending: policies.filter(p => p.status === 'pending').length
  }

  const handleCreatePolicy = () => {
    navigate('/products')
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
            onRetry={loadPolicies}
          />
        </div>
      </div>
    )
  }

  if (policies.length === 0) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon="Shield"
            title="No policies found"
            description="You haven't purchased any insurance policies yet. Explore our products to get started."
            actionLabel="Browse Insurance Products"
            onAction={handleCreatePolicy}
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
              My Policies
            </h1>
            <p className="text-surface-600 mt-1">
              Manage your insurance policies and coverage
            </p>
          </div>
          <Button 
            onClick={handleCreatePolicy}
            className="mt-4 sm:mt-0"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Get New Policy
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { key: 'all', label: 'All Policies', variant: 'default' },
            { key: 'active', label: 'Active', variant: 'success' },
            { key: 'expired', label: 'Expired', variant: 'error' },
            { key: 'pending', label: 'Pending', variant: 'warning' }
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

        {/* Policies Grid */}
        {filteredPolicies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy, index) => (
              <PolicyCard 
                key={policy.id}
                policy={policy}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="Filter"
            title={`No ${filterStatus} policies`}
            description={`You don't have any ${filterStatus === 'all' ? '' : filterStatus} policies at the moment.`}
            actionLabel="View All Policies"
            onAction={() => setFilterStatus('all')}
          />
        )}

        {/* Quick Actions */}
<div className="mt-12 bg-white rounded-lg shadow-card border border-surface-200 p-6">
          <h2 className="text-xl font-display font-bold text-surface-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/claims')}
              className="flex items-center justify-center space-x-2 h-12"
            >
              <ApperIcon name="FileText" className="w-5 h-5" />
              <span>File a Claim</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/payments')}
              className="flex items-center justify-center space-x-2 h-12"
            >
              <ApperIcon name="CreditCard" className="w-5 h-5" />
              <span>Payment History</span>
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/support')}
              className="flex items-center justify-center space-x-2 h-12"
            >
              <ApperIcon name="HelpCircle" className="w-5 h-5" />
              <span>Contact Support</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleCreatePolicy}
              className="flex items-center justify-center space-x-2 h-12"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              <span>Add Coverage</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPolicies