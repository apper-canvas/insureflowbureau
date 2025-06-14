import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Cards from 'react-credit-cards-2'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import { paymentService } from '@/services'

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([])
  const [upcomingPayments, setUpcomingPayments] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('history')
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [showAddMethod, setShowAddMethod] = useState(false)

  useEffect(() => {
    loadPaymentData()
  }, [])

  const loadPaymentData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [history, upcoming, methods] = await Promise.all([
        paymentService.getPaymentHistory(),
        paymentService.getUpcomingPayments(),
        paymentService.getPaymentMethods()
      ])
      setPaymentHistory(history)
      setUpcomingPayments(upcoming)
      setPaymentMethods(methods)
    } catch (err) {
      setError(err.message || 'Failed to load payment data')
      toast.error('Failed to load payment data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMethod = async (methodId) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return
    
    try {
      await paymentService.deletePaymentMethod(methodId)
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId))
      toast.success('Payment method deleted successfully')
    } catch (err) {
      toast.error('Failed to delete payment method')
    }
  }

  const handleSetDefault = async (methodId) => {
    try {
      // Update all methods to not default, then set selected as default
      const updates = paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
      
      await Promise.all(
        updates.map(method => 
          paymentService.updatePaymentMethod(method.id, { isDefault: method.isDefault })
        )
      )
      
      setPaymentMethods(updates)
      toast.success('Default payment method updated')
    } catch (err) {
      toast.error('Failed to update default payment method')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'error'
      default: return 'default'
    }
  }

  const getCardIcon = (cardType) => {
    switch (cardType?.toLowerCase()) {
      case 'visa': return '💳'
      case 'mastercard': return '💳'
      case 'amex': return '💳'
      default: return '💳'
    }
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
            onRetry={loadPaymentData}
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
              Payment Management
            </h1>
            <p className="text-surface-600 mt-1">
              Manage your payment history and methods
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-surface-100 rounded-lg p-1">
          {[
            { key: 'history', label: 'Payment History', icon: 'History' },
            { key: 'upcoming', label: 'Upcoming Payments', icon: 'Calendar' },
            { key: 'methods', label: 'Payment Methods', icon: 'CreditCard' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200
                ${activeTab === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
                }
              `}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Payment History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {paymentHistory.length > 0 ? (
              <div className="bg-white rounded-lg shadow-card border border-surface-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-50 border-b border-surface-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Policy & Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Transaction ID
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-200">
                      {paymentHistory.map(payment => (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="hover:bg-surface-50"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-surface-900">
                                {payment.policyName}
                              </div>
                              <div className="text-sm text-surface-500">
                                {payment.policyNumber} • {format(new Date(payment.date), 'MMM dd, yyyy')}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-surface-900">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span>{payment.method}</span>
                              <span className="text-surface-500">({payment.methodDetails})</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-mono text-sm text-surface-500">
                            {payment.transactionId}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <EmptyState
                icon="History"
                title="No payment history"
                description="You haven't made any payments yet."
              />
            )}
          </div>
        )}

        {/* Upcoming Payments Tab */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            {upcomingPayments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingPayments.map(payment => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Calendar" className="w-5 h-5 text-warning" />
                          <Badge variant="warning" size="sm">
                            Due {format(new Date(payment.dueDate), 'MMM dd')}
                          </Badge>
                        </div>
                        {payment.reminderSent && (
                          <Badge variant="info" size="sm">
                            Reminder Sent
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-surface-900">
                            {payment.policyName}
                          </h3>
                          <p className="text-sm text-surface-500">
                            {payment.policyNumber}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-surface-600">Amount Due:</span>
                          <span className="font-bold text-lg text-surface-900">
                            {formatCurrency(payment.amount)}
                          </span>
                        </div>
                        
                        <Button className="w-full" size="sm">
                          Pay Now
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="Calendar"
                title="No upcoming payments"
                description="You don't have any upcoming premium payments."
              />
            )}
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-display font-bold text-surface-900">
                Saved Payment Methods
              </h2>
              <Button onClick={() => setShowAddMethod(true)}>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Method
              </Button>
            </div>

            {paymentMethods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentMethods.map(method => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="h-full">
                      {method.type === 'card' ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getCardIcon(method.cardType)}</span>
                              <span className="font-medium text-surface-900">
                                {method.cardType?.toUpperCase()}
                              </span>
                            </div>
                            {method.isDefault && (
                              <Badge variant="success" size="sm">
                                Default
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <div className="font-mono text-lg text-surface-900">
                              •••• •••• •••• {method.last4}
                            </div>
                            <div className="text-sm text-surface-500">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </div>
                            <div className="text-sm text-surface-600">
                              {method.cardholderName}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {!method.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefault(method.id)}
                                className="flex-1"
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMethod(method.id)}
                              className="text-error hover:bg-error hover:text-white"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ApperIcon name="Smartphone" className="w-5 h-5 text-primary" />
                              <span className="font-medium text-surface-900">
                                {method.provider}
                              </span>
                            </div>
                            {method.isDefault && (
                              <Badge variant="success" size="sm">
                                Default
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <div className="font-mono text-surface-900">
                              {method.upiId}
                            </div>
                            <div className="text-sm text-surface-500">
                              UPI ID
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {!method.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefault(method.id)}
                                className="flex-1"
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMethod(method.id)}
                              className="text-error hover:bg-error hover:text-white"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="CreditCard"
                title="No payment methods"
                description="Add a payment method to make payments easier."
                actionLabel="Add Payment Method"
                onAction={() => setShowAddMethod(true)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentHistory