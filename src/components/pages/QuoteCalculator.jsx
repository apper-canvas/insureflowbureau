import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import QuoteForm from '@/components/organisms/QuoteForm'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const QuoteCalculator = () => {
  const { type } = useParams()
  const navigate = useNavigate()
  const [currentQuote, setCurrentQuote] = useState(null)

  const policyTypes = {
    health: {
      name: 'Health Insurance',
      icon: 'Heart',
      color: 'error',
      description: 'Comprehensive health coverage for you and your family'
    },
    auto: {
      name: 'Auto Insurance',
      icon: 'Car',
      color: 'primary',
      description: 'Complete protection for your vehicle'
    },
    travel: {
      name: 'Travel Insurance',
      icon: 'Plane',
      color: 'secondary',
      description: 'Travel worry-free with comprehensive coverage'
    },
    life: {
      name: 'Life Insurance',
      icon: 'Shield',
      color: 'accent',
      description: 'Secure your family\'s financial future'
    },
    home: {
      name: 'Home Insurance',
      icon: 'Home',
      color: 'warning',
      description: 'Protect your home and belongings'
    }
  }

  const currentType = type && policyTypes[type] ? policyTypes[type] : policyTypes.health

  const handleQuoteCalculated = (quote) => {
    setCurrentQuote(quote)
  }

  const handleProceedToPurchase = () => {
    if (currentQuote) {
      navigate('/purchase', { state: { quote: currentQuote } })
    }
  }

  const benefits = {
    health: [
      'Cashless treatment at 10,000+ hospitals',
      'Pre & post hospitalization coverage',
      'Day care procedures included',
      'Annual health check-up',
      'Emergency ambulance services'
    ],
    auto: [
      'Own damage coverage up to IDV',
      'Third party liability protection',
      'Personal accident cover',
      'Zero depreciation available',
      '24/7 roadside assistance'
    ],
    travel: [
      'Medical emergency coverage abroad',
      'Trip cancellation protection',
      'Baggage and personal effects',
      'Flight delay compensation',
      'Emergency evacuation services'
    ],
    life: [
      'High life coverage at low cost',
      'Accidental death benefit',
      'Terminal illness benefit',
      'Premium waiver on disability',
      'Tax benefits under Section 80C'
    ],
    home: [
      'Structure and contents coverage',
      'Fire and allied perils',
      'Burglary and theft protection',
      'Natural disaster coverage',
      'Personal liability protection'
    ]
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/products')}
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className={`
              w-16 h-16 rounded-lg flex items-center justify-center
              ${currentType.color === 'error' ? 'bg-error/10 text-error' : ''}
              ${currentType.color === 'primary' ? 'bg-primary/10 text-primary' : ''}
              ${currentType.color === 'secondary' ? 'bg-secondary/10 text-secondary' : ''}
              ${currentType.color === 'accent' ? 'bg-accent/10 text-accent' : ''}
              ${currentType.color === 'warning' ? 'bg-warning/10 text-warning' : ''}
            `}>
              <ApperIcon name={currentType.icon} className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-surface-900">
                {currentType.name}
              </h1>
              <p className="text-surface-600">
                {currentType.description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits & Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-display font-bold text-surface-900 mb-4">
                Key Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits[type] && benefits[type].map((benefit, index) => (
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

            {/* Policy Type Selector */}
            <Card>
              <h3 className="font-display font-semibold text-surface-900 mb-4">
                Explore Other Insurance Products
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(policyTypes).map(([key, policy]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/quote/${key}`)}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 text-center
                      ${type === key 
                        ? 'border-primary bg-primary/5' 
                        : 'border-surface-200 hover:border-surface-300'
                      }
                    `}
                  >
                    <ApperIcon 
                      name={policy.icon} 
                      className={`w-6 h-6 mx-auto mb-2 ${
                        type === key ? 'text-primary' : 'text-surface-500'
                      }`} 
                    />
                    <span className={`text-sm font-medium ${
                      type === key ? 'text-primary' : 'text-surface-700'
                    }`}>
                      {policy.name.split(' ')[0]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* FAQ Section */}
            <Card>
              <h3 className="font-display font-semibold text-surface-900 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div className="border-b border-surface-200 pb-3">
                  <h4 className="font-medium text-surface-900 mb-2">
                    How is the premium calculated?
                  </h4>
                  <p className="text-sm text-surface-600">
                    Premium is calculated based on various factors including age, coverage amount, 
                    policy type, and risk factors. Our algorithm ensures competitive pricing.
                  </p>
                </div>
                <div className="border-b border-surface-200 pb-3">
                  <h4 className="font-medium text-surface-900 mb-2">
                    What documents are required?
                  </h4>
                  <p className="text-sm text-surface-600">
                    You'll need identity proof, address proof, and specific documents based on 
                    the insurance type (medical reports for health, vehicle documents for auto, etc.).
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-surface-900 mb-2">
                    How quickly can I get coverage?
                  </h4>
                  <p className="text-sm text-surface-600">
                    Most policies become active within 24-48 hours of payment and document verification.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quote Form */}
          <div>
            <QuoteForm 
              policyType={type} 
              onQuoteCalculated={handleQuoteCalculated}
            />
            
            {currentQuote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card>
                  <div className="text-center">
                    <ApperIcon name="CheckCircle" className="w-12 h-12 text-success mx-auto mb-4" />
                    <h3 className="font-display font-bold text-surface-900 mb-2">
                      Quote Ready!
                    </h3>
                    <p className="text-surface-600 mb-4">
                      Your personalized quote has been calculated
                    </p>
                    <Button 
                      onClick={handleProceedToPurchase}
                      variant="accent"
                      className="w-full"
                    >
                      Proceed to Purchase
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuoteCalculator