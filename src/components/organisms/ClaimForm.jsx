import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import FormField from '@/components/molecules/FormField'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { claimService, policyService } from '@/services'

const ClaimForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    policyId: '',
    type: 'medical',
    description: '',
    amount: '',
    incidentDate: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [policies, setPolicies] = useState([])

  useState(() => {
    const loadPolicies = async () => {
      try {
        const allPolicies = await policyService.getAll()
        const activePolicies = allPolicies.filter(p => p.status === 'active')
        setPolicies(activePolicies)
      } catch (error) {
        console.error('Failed to load policies:', error)
      }
    }
    loadPolicies()
  }, [])

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.policyId) {
      newErrors.policyId = 'Please select a policy'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Please provide more details (minimum 20 characters)'
    }

    if (!formData.amount) {
      newErrors.amount = 'Claim amount is required'
    } else if (formData.amount <= 0) {
      newErrors.amount = 'Claim amount must be greater than 0'
    }

    if (!formData.incidentDate) {
      newErrors.incidentDate = 'Incident date is required'
    } else {
      const incidentDate = new Date(formData.incidentDate)
      const today = new Date()
      const maxPastDate = new Date()
      maxPastDate.setFullYear(today.getFullYear() - 1)
      
      if (incidentDate > today) {
        newErrors.incidentDate = 'Incident date cannot be in the future'
      } else if (incidentDate < maxPastDate) {
        newErrors.incidentDate = 'Incident date cannot be more than 1 year ago'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors and try again')
      return
    }

    setLoading(true)
    try {
      const claim = await claimService.create(formData)
      toast.success('Claim submitted successfully!')
      navigate('/claims')
    } catch (error) {
      toast.error('Failed to submit claim')
      console.error('Claim submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  const claimTypes = [
    { value: 'medical', label: 'Medical Expense', icon: 'Heart' },
    { value: 'accident', label: 'Accident Damage', icon: 'AlertTriangle' },
    { value: 'theft', label: 'Theft/Burglary', icon: 'Shield' },
    { value: 'baggage', label: 'Baggage Loss', icon: 'Package' },
    { value: 'other', label: 'Other', icon: 'FileText' }
  ]

  return (
    <Card>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <ApperIcon name="FileText" className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-surface-900">
            File New Claim
          </h2>
          <p className="text-sm text-surface-500">
            Submit your insurance claim details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Select Policy *
          </label>
          <select
            value={formData.policyId}
            onChange={(e) => handleInputChange('policyId', e.target.value)}
            className={`w-full h-12 px-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.policyId ? 'border-error' : 'border-surface-300 focus:border-primary'
            }`}
          >
            <option value="">Choose a policy</option>
            {policies.map(policy => (
              <option key={policy.id} value={policy.id}>
                {policy.name} ({policy.policyNumber})
              </option>
            ))}
          </select>
          {errors.policyId && (
            <p className="mt-1 text-sm text-error">{errors.policyId}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-3">
            Claim Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {claimTypes.map(type => (
              <motion.div
                key={type.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 border-2 rounded-lg cursor-pointer transition-all duration-200
                  ${formData.type === type.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-surface-200 hover:border-surface-300'
                  }
                `}
                onClick={() => handleInputChange('type', type.value)}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon 
                    name={type.icon} 
                    className={`w-4 h-4 ${
                      formData.type === type.value ? 'text-primary' : 'text-surface-500'
                    }`} 
                  />
                  <span className={`text-sm font-medium ${
                    formData.type === type.value ? 'text-primary' : 'text-surface-700'
                  }`}>
                    {type.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <FormField
          label="Incident Date"
          name="incidentDate"
          type="date"
          value={formData.incidentDate}
          onChange={handleInputChange}
          error={errors.incidentDate}
          required
          max={new Date().toISOString().split('T')[0]}
        />

        <FormField
          label="Claim Amount (₹)"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleInputChange}
          error={errors.amount}
          required
          min="1"
          step="100"
          placeholder="Enter the claim amount"
        />

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className={`w-full px-3 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
              errors.description ? 'border-error' : 'border-surface-300 focus:border-primary'
            }`}
            placeholder="Describe the incident in detail. Include relevant information about when, where, and how the incident occurred."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description && (
              <p className="text-sm text-error">{errors.description}</p>
            )}
            <p className="text-xs text-surface-500 ml-auto">
              {formData.description.length}/500
            </p>
          </div>
        </div>

        <div className="bg-info/5 border border-info/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ApperIcon name="Info" className="w-5 h-5 text-info mt-0.5" />
            <div>
              <h4 className="font-medium text-surface-900 mb-1">Required Documents</h4>
              <ul className="text-sm text-surface-600 space-y-1">
                <li>• Original bills and receipts</li>
                <li>• Medical reports (for health claims)</li>
                <li>• Police FIR (for theft/accident)</li>
                <li>• Photos of damage/incident</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/claims')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            Submit Claim
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ClaimForm