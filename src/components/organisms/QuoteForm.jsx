import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import FormField from '@/components/molecules/FormField'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { quoteService } from '@/services'

const QuoteForm = ({ policyType, onQuoteCalculated }) => {
  const [formData, setFormData] = useState({
    policyType: policyType || 'health',
    age: '',
    coverageAmount: '',
    duration: '12',
    smoker: false,
    vehicleAge: '',
    destination: '',
    travelers: '1'
  })
  const [loading, setLoading] = useState(false)
  const [premium, setPremium] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (policyType) {
      setFormData(prev => ({ ...prev, policyType }))
    }
  }, [policyType])

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.coverageAmount) {
      newErrors.coverageAmount = 'Coverage amount is required'
    } else if (formData.coverageAmount < 100000) {
      newErrors.coverageAmount = 'Minimum coverage amount is ₹1,00,000'
    }

    if (formData.policyType === 'health' || formData.policyType === 'life') {
      if (!formData.age) {
        newErrors.age = 'Age is required'
      } else if (formData.age < 18 || formData.age > 80) {
        newErrors.age = 'Age must be between 18 and 80'
      }
    }

    if (formData.policyType === 'auto' && !formData.vehicleAge) {
      newErrors.vehicleAge = 'Vehicle age is required'
    }

    if (formData.policyType === 'travel') {
      if (!formData.destination) {
        newErrors.destination = 'Destination is required'
      }
      if (!formData.travelers || formData.travelers < 1) {
        newErrors.travelers = 'Number of travelers is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculatePremium = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors and try again')
      return
    }

    setLoading(true)
    try {
      const calculatedPremium = await quoteService.calculatePremium(formData)
      setPremium(calculatedPremium)
      
      // Save quote
      const quote = await quoteService.create({
        ...formData,
        premium: calculatedPremium
      })
      
      if (onQuoteCalculated) {
        onQuoteCalculated(quote)
      }
      
      toast.success('Quote calculated successfully!')
    } catch (error) {
      toast.error('Failed to calculate premium')
      console.error('Quote calculation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const renderPolicySpecificFields = () => {
    switch (formData.policyType) {
      case 'health':
      case 'life':
        return (
          <>
            <FormField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              error={errors.age}
              required
              min="18"
              max="80"
            />
            {formData.policyType === 'health' && (
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="smoker"
                  checked={formData.smoker}
                  onChange={(e) => handleInputChange('smoker', e.target.checked)}
                  className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
                />
                <label htmlFor="smoker" className="text-sm text-surface-700">
                  I am a smoker
                </label>
              </div>
            )}
          </>
        )
      
      case 'auto':
        return (
          <FormField
            label="Vehicle Age (Years)"
            name="vehicleAge"
            type="number"
            value={formData.vehicleAge}
            onChange={handleInputChange}
            error={errors.vehicleAge}
            required
            min="0"
            max="20"
          />
        )
      
      case 'travel':
        return (
          <>
            <FormField
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              error={errors.destination}
              required
              placeholder="e.g., Europe, Asia, Domestic"
            />
            <FormField
              label="Number of Travelers"
              name="travelers"
              type="number"
              value={formData.travelers}
              onChange={handleInputChange}
              error={errors.travelers}
              required
              min="1"
              max="10"
            />
          </>
        )
      
      default:
        return null
    }
  }

  return (
    <Card className="sticky top-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <ApperIcon name="Calculator" className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-surface-900">
            Get Quote
          </h2>
          <p className="text-sm text-surface-500 capitalize">
            {formData.policyType} Insurance
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Policy Type
          </label>
          <select
            value={formData.policyType}
            onChange={(e) => handleInputChange('policyType', e.target.value)}
            className="w-full h-12 px-3 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="health">Health Insurance</option>
            <option value="auto">Auto Insurance</option>
            <option value="travel">Travel Insurance</option>
            <option value="life">Life Insurance</option>
            <option value="home">Home Insurance</option>
          </select>
        </div>

        <FormField
          label="Coverage Amount (₹)"
          name="coverageAmount"
          type="number"
          value={formData.coverageAmount}
          onChange={handleInputChange}
          error={errors.coverageAmount}
          required
          min="100000"
          step="50000"
          placeholder="e.g., 500000"
        />

        {renderPolicySpecificFields()}

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Policy Duration
          </label>
          <select
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="w-full h-12 px-3 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="6">6 Months</option>
            <option value="12">1 Year</option>
            <option value="24">2 Years</option>
            <option value="36">3 Years</option>
          </select>
        </div>

        <Button
          onClick={calculatePremium}
          loading={loading}
          className="w-full"
        >
          Calculate Premium
        </Button>

        {premium && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/5 rounded-lg p-4 border border-primary/20"
          >
            <div className="text-center">
              <p className="text-sm text-surface-600 mb-2">
                Estimated Annual Premium
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(premium)}
              </p>
              <div className="mt-4 pt-4 border-t border-primary/20">
                <Button variant="accent" size="sm" className="w-full">
                  Proceed to Buy
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  )
}

export default QuoteForm