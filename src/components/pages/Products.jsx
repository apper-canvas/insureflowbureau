import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ProductCard from '@/components/molecules/ProductCard'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Products = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const insuranceProducts = [
    {
      id: 'health',
      type: 'health',
      name: 'Health Protection Plus',
      description: 'Comprehensive health coverage with cashless treatment at 10,000+ hospitals nationwide. Covers pre and post hospitalization expenses.',
      benefits: [
        'Cashless treatment at network hospitals',
        'Pre & post hospitalization coverage',
        'Day care procedures included',
        'Annual health check-up',
        'Ambulance charges covered'
      ],
      startingPrice: 8999,
      maxCoverage: 5000000
    },
    {
      id: 'auto',
      type: 'auto',
      name: 'Comprehensive Car Insurance',
      description: 'Complete protection for your vehicle with own damage cover, third party liability, and personal accident benefits.',
      benefits: [
        'Own damage coverage up to IDV',
        'Third party liability protection',
        'Personal accident cover for driver',
        'Zero depreciation add-on available',
        '24/7 roadside assistance'
      ],
      startingPrice: 12500,
      maxCoverage: 2000000
    },
    {
      id: 'travel',
      type: 'travel',
      name: 'Global Travel Protection',
      description: 'Travel worry-free with coverage for medical emergencies, trip cancellation, baggage loss, and flight delays.',
      benefits: [
        'Medical emergency coverage abroad',
        'Trip cancellation/interruption',
        'Baggage and personal effects',
        'Flight delay compensation',
        'Emergency evacuation'
      ],
      startingPrice: 999,
      maxCoverage: 1000000
    },
    {
      id: 'life',
      type: 'life',
      name: 'Term Life Protection',
      description: 'Secure your family\'s financial future with high coverage at affordable premiums. Pure term insurance with no maturity benefits.',
      benefits: [
        'High life coverage at low cost',
        'Accidental death benefit',
        'Terminal illness benefit',
        'Premium waiver on disability',
        'Tax benefits under 80C'
      ],
      startingPrice: 6999,
      maxCoverage: 10000000
    },
    {
      id: 'home',
      type: 'home',
      name: 'Home Shield Insurance',
      description: 'Protect your home and belongings against fire, theft, natural disasters, and other unforeseen events.',
      benefits: [
        'Structure and contents coverage',
        'Fire and allied perils',
        'Burglary and theft protection',
        'Natural disaster coverage',
        'Personal liability protection'
      ],
      startingPrice: 4999,
      maxCoverage: 5000000
    }
  ]

  const categories = [
    { id: 'all', label: 'All Products', icon: 'Grid3x3' },
    { id: 'health', label: 'Health', icon: 'Heart' },
    { id: 'auto', label: 'Auto', icon: 'Car' },
    { id: 'travel', label: 'Travel', icon: 'Plane' },
    { id: 'life', label: 'Life', icon: 'Shield' },
    { id: 'home', label: 'Home', icon: 'Home' }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? insuranceProducts 
    : insuranceProducts.filter(product => product.type === selectedCategory)

const handleGetStarted = () => {
    navigate('/quote')
  }

  const handleCompare = () => {
    navigate('/compare')
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold mb-6"
            >
              Insurance Made Simple
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl mb-8 opacity-90"
            >
              Choose from our comprehensive range of insurance products designed to protect what matters most to you.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                onClick={handleGetStarted}
                variant="accent" 
                size="lg"
              >
                Get Started
                <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
              </Button>
<Button 
                onClick={handleCompare}
                variant="secondary" 
                size="lg"
              >
                Compare Plans
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${selectedCategory === category.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-surface-600 hover:bg-surface-50 border border-surface-200'
                }
              `}
            >
              <ApperIcon name={category.icon} className="w-4 h-4" />
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard 
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="Search" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-900 mb-2">
              No products found
            </h3>
            <p className="text-surface-600">
              Try selecting a different category or browse all products.
            </p>
          </motion.div>
        )}
      </section>

      {/* Trust Indicators */}
      <section className="bg-white border-t border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-sm text-surface-600">Network Hospitals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-surface-600">Claim Settlement</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-surface-600">Customer Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">5M+</div>
              <div className="text-sm text-surface-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Products