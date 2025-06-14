import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import FormField from '@/components/molecules/FormField'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { policyService } from '@/services'

const PurchaseFlow = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState(null)

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Nominee Information (for life insurance)
    nomineeName: '',
    nomineeRelation: '',
    nomineeDateOfBirth: '',
    
    // Payment Information
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (location.state?.quote) {
      setQuote(location.state.quote)
    } else {
      // Redirect back if no quote
      navigate('/products')
    }
  }, [location.state, navigate])

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Enter your basic details',
      icon: 'User'
    },
    {
      id: 'coverage',
      title: 'Coverage Details',
      description: 'Review your policy details',
      icon: 'Shield'
    },
    {
      id: 'nominee',
      title: 'Nominee Details',
      description: 'Add nominee information',
      icon: 'Users',
      condition: () => quote?.policyType === 'life'
    },
    {
      id: 'payment',
      title: 'Payment',
      description: 'Complete your purchase',
      icon: 'CreditCard'
    }
  ]

  const visibleSteps = steps.filter(step => !step.condition || step.condition())

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

  const validateStep = (stepId) => {
    const newErrors = {}

    switch (stepId) {
      case 'personal':
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email'
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
        if (!formData.address.trim()) newErrors.address = 'Address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
        break

      case 'nominee':
        if (quote?.policyType === 'life') {
          if (!formData.nomineeName.trim()) newErrors.nomineeName = 'Nominee name is required'
          if (!formData.nomineeRelation.trim()) newErrors.nomineeRelation = 'Relationship is required'
          if (!formData.nomineeDateOfBirth) newErrors.nomineeDateOfBirth = 'Nominee date of birth is required'
        }
        break

      case 'payment':
        if (!formData.nameOnCard.trim()) newErrors.nameOnCard = 'Name on card is required'
        if (!formData.cardNumber.trim()) {
          newErrors.cardNumber = 'Card number is required'
        } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
          newErrors.cardNumber = 'Please enter a valid card number'
        }
        if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required'
        if (!formData.cvv.trim()) {
          newErrors.cvv = 'CVV is required'
        } else if (formData.cvv.length < 3) {
          newErrors.cvv = 'Please enter a valid CVV'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    const currentStepData = visibleSteps[currentStep]
    if (validateStep(currentStepData.id)) {
      setCurrentStep(prev => Math.min(prev + 1, visibleSteps.length - 1))
    } else {
      toast.error('Please fix the errors and try again')
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handlePurchase = async () => {
    if (!validateStep('payment')) {
      toast.error('Please fix the payment details')
      return
    }

    setLoading(true)
    try {
      // Create policy
      const policyData = {
        type: quote.policyType,
        name: `${quote.policyType.charAt(0).toUpperCase()}${quote.policyType.slice(1)} Insurance Policy`,
        coverageAmount: quote.coverageAmount,
        premium: quote.premium,
        endDate: new Date(Date.now() + quote.duration * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }

      await policyService.create(policyData)
      
      toast.success('Policy purchased successfully!')
      navigate('/policies')
    } catch (error) {
      toast.error('Failed to complete purchase')
      console.error('Purchase error:', error)
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

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-surface-900 mb-2">
            No Quote Found
          </h2>
          <p className="text-surface-600 mb-4">
            Please get a quote first before proceeding to purchase.
          </p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {visibleSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium
                  ${index <= currentStep 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-200 text-surface-500'
                  }
                `}>
                  {index < currentStep ? (
                    <ApperIcon name="Check" className="w-5 h-5" />
                  ) : (
                    <ApperIcon name={step.icon} className="w-5 h-5" />
                  )}
                </div>
                {index < visibleSteps.length - 1 && (
                  <div className={`
                    w-16 h-1 mx-4
                    ${index < currentStep ? 'bg-primary' : 'bg-surface-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-display font-bold text-surface-900">
              {visibleSteps[currentStep].title}
            </h2>
            <p className="text-surface-600">
              {visibleSteps[currentStep].description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Personal Information Step */}
                  {visibleSteps[currentStep].id === 'personal' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          error={errors.firstName}
                          required
                        />
                        <FormField
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          error={errors.lastName}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          error={errors.email}
                          required
                        />
                        <FormField
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          error={errors.phone}
                          required
                        />
                      </div>

                      <FormField
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        error={errors.dateOfBirth}
                        required
                        max={new Date().toISOString().split('T')[0]}
                      />

                      <FormField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        error={errors.address}
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          error={errors.city}
                          required
                        />
                        <FormField
                          label="State"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          error={errors.state}
                          required
                        />
                        <FormField
                          label="Pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          error={errors.pincode}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Coverage Details Step */}
                  {visibleSteps[currentStep].id === 'coverage' && (
                    <div className="space-y-6">
                      <div className="bg-primary/5 rounded-lg p-6">
                        <h3 className="font-display font-semibold text-surface-900 mb-4">
                          Policy Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-surface-500">Policy Type</p>
                            <p className="font-medium capitalize">{quote.policyType} Insurance</p>
                          </div>
                          <div>
                            <p className="text-sm text-surface-500">Coverage Amount</p>
                            <p className="font-medium">{formatCurrency(quote.coverageAmount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-surface-500">Policy Duration</p>
                            <p className="font-medium">{quote.duration} months</p>
                          </div>
                          <div>
                            <p className="text-sm text-surface-500">Annual Premium</p>
                            <p className="font-bold text-primary">{formatCurrency(quote.premium)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-surface-900">Terms & Conditions</h4>
                        <div className="space-y-2 text-sm text-surface-600">
                          <label className="flex items-start space-x-3">
                            <input type="checkbox" className="mt-1" required />
                            <span>I agree to the terms and conditions of the insurance policy</span>
                          </label>
                          <label className="flex items-start space-x-3">
                            <input type="checkbox" className="mt-1" required />
                            <span>I acknowledge that I have read and understood the policy document</span>
                          </label>
                          <label className="flex items-start space-x-3">
                            <input type="checkbox" className="mt-1" required />
                            <span>I consent to the processing of my personal data for insurance purposes</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nominee Details Step */}
                  {visibleSteps[currentStep].id === 'nominee' && (
                    <div className="space-y-4">
                      <div className="bg-info/5 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Info" className="w-5 h-5 text-info" />
                          <p className="text-sm text-surface-700">
                            Nominee details are required for life insurance policies
                          </p>
                        </div>
                      </div>

                      <FormField
                        label="Nominee Name"
                        name="nomineeName"
                        value={formData.nomineeName}
                        onChange={handleInputChange}
                        error={errors.nomineeName}
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Relationship *
                          </label>
                          <select
                            value={formData.nomineeRelation}
                            onChange={(e) => handleInputChange('nomineeRelation', e.target.value)}
                            className={`w-full h-12 px-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                              errors.nomineeRelation ? 'border-error' : 'border-surface-300 focus:border-primary'
                            }`}
                          >
                            <option value="">Select relationship</option>
                            <option value="spouse">Spouse</option>
                            <option value="child">Child</option>
                            <option value="parent">Parent</option>
                            <option value="sibling">Sibling</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.nomineeRelation && (
                            <p className="mt-1 text-sm text-error">{errors.nomineeRelation}</p>
                          )}
                        </div>

                        <FormField
                          label="Nominee Date of Birth"
                          name="nomineeDateOfBirth"
                          type="date"
                          value={formData.nomineeDateOfBirth}
                          onChange={handleInputChange}
                          error={errors.nomineeDateOfBirth}
                          required
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Step */}
                  {visibleSteps[currentStep].id === 'payment' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-surface-900 mb-4">Payment Method</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'card', label: 'Credit/Debit Card', icon: 'CreditCard' },
                            { value: 'upi', label: 'UPI', icon: 'Smartphone' },
                            { value: 'netbanking', label: 'Net Banking', icon: 'Building' }
                          ].map(method => (
                            <button
                              key={method.value}
                              onClick={() => handleInputChange('paymentMethod', method.value)}
                              className={`p-3 border-2 rounded-lg text-center transition-all ${
                                formData.paymentMethod === method.value
                                  ? 'border-primary bg-primary/5'
                                  : 'border-surface-200 hover:border-surface-300'
                              }`}
                            >
                              <ApperIcon name={method.icon} className="w-6 h-6 mx-auto mb-2" />
                              <span className="text-sm font-medium">{method.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <FormField
                            label="Name on Card"
                            name="nameOnCard"
                            value={formData.nameOnCard}
                            onChange={handleInputChange}
                            error={errors.nameOnCard}
                            required
                          />

                          <FormField
                            label="Card Number"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={(name, value) => handleInputChange(name, formatCardNumber(value))}
                            error={errors.cardNumber}
                            required
                            maxLength="19"
                            placeholder="1234 5678 9012 3456"
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              label="Expiry Date"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              error={errors.expiryDate}
                              required
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                            <FormField
                              label="CVV"
                              name="cvv"
                              type="password"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              error={errors.cvv}
                              required
                              maxLength="4"
                            />
                          </div>
                        </div>
                      )}

                      <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Shield" className="w-5 h-5 text-success" />
                          <span className="text-sm text-success font-medium">
                            Your payment is secured with 256-bit SSL encryption
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-surface-200 mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep === visibleSteps.length - 1 ? (
                  <Button
                    onClick={handlePurchase}
                    loading={loading}
                    className="min-w-[120px]"
                  >
                    Complete Purchase
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <h3 className="font-display font-bold text-surface-900 mb-4">
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-surface-600">Policy Type:</span>
                  <span className="font-medium capitalize">{quote.policyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Coverage:</span>
                  <span className="font-medium">{formatCurrency(quote.coverageAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Duration:</span>
                  <span className="font-medium">{quote.duration} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Base Premium:</span>
                  <span className="font-medium">{formatCurrency(quote.premium)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-600">Service Tax:</span>
                  <span className="font-medium">{formatCurrency(quote.premium * 0.18)}</span>
                </div>
              </div>

              <div className="border-t border-surface-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-surface-900">Total Amount:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(quote.premium * 1.18)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-secondary/5 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Gift" className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium text-secondary">Special Offer</span>
                </div>
                <p className="text-xs text-surface-600">
                  Get 10% cashback on your first policy purchase. Cashback will be credited within 7 days.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseFlow