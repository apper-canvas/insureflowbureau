import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate()

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

  const handleGetQuote = () => {
    navigate(`/quote/${product.type}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${product.type === 'health' ? 'bg-error/10 text-error' : ''}
              ${product.type === 'auto' ? 'bg-primary/10 text-primary' : ''}
              ${product.type === 'travel' ? 'bg-secondary/10 text-secondary' : ''}
              ${product.type === 'life' ? 'bg-accent/10 text-accent' : ''}
              ${product.type === 'home' ? 'bg-warning/10 text-warning' : ''}
            `}>
              <ApperIcon name={getIcon(product.type)} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-surface-900">
                {product.name}
              </h3>
              <p className="text-sm text-surface-500 capitalize">{product.type} Insurance</p>
            </div>
          </div>
        </div>

        <p className="text-surface-600 mb-6 flex-1">
          {product.description}
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-surface-900">Key Benefits:</h4>
            <ul className="space-y-1">
              {product.benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-surface-600">
                  <ApperIcon name="Check" className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-surface-200">
            <div>
              <span className="text-sm text-surface-500">Starting from</span>
              <div className="text-xl font-bold text-surface-900">
                {formatCurrency(product.startingPrice)}
                <span className="text-sm font-normal text-surface-500">/year</span>
              </div>
            </div>
            <Button onClick={handleGetQuote}>
              Get Quote
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ProductCard