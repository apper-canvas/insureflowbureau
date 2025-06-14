import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import comparisonService from '@/services/api/comparisonService'

const ComparisonTable = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [allProducts, setAllProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    // Pre-select product if passed from Products page
    if (location.state?.preSelectedProduct) {
      const preSelected = location.state.preSelectedProduct
      setSelectedProducts([preSelected])
      toast.info(`${preSelected.name} added to comparison`)
    }
  }, [location.state])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const products = await comparisonService.getComparableProducts()
      setAllProducts(products)
    } catch (err) {
      setError('Failed to load products')
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleProductToggle = async (product) => {
    const isSelected = selectedProducts.some(p => p.id === product.id)
    
    if (isSelected) {
      try {
        await comparisonService.removeFromComparison(product.id)
        setSelectedProducts(prev => prev.filter(p => p.id !== product.id))
        toast.success(`${product.name} removed from comparison`)
      } catch (err) {
        toast.error('Failed to remove product from comparison')
      }
    } else {
      if (selectedProducts.length >= 3) {
        toast.warning('You can compare up to 3 products at a time')
        return
      }
      
      try {
        await comparisonService.addToComparison(product)
        setSelectedProducts(prev => [...prev, product])
        toast.success(`${product.name} added to comparison`)
      } catch (err) {
        toast.error('Failed to add product to comparison')
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
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

  const getTypeColor = (type) => {
    const colorMap = {
      health: 'bg-error/10 text-error',
      auto: 'bg-primary/10 text-primary',
      travel: 'bg-secondary/10 text-secondary',
      life: 'bg-accent/10 text-accent',
      home: 'bg-warning/10 text-warning'
    }
    return colorMap[type] || 'bg-surface/10 text-surface-600'
  }

  const handleGetQuote = (productType) => {
    navigate(`/quote/${productType}`)
  }

  const clearAll = () => {
    setSelectedProducts([])
    toast.info('Comparison cleared')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-surface-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Error Loading Products</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={loadProducts}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <section className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
                Compare Insurance Plans
              </h1>
              <p className="text-surface-600">
                Select up to 3 products to compare features and pricing side by side
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/products')}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to Products</span>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Selection */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-surface-900">
                Select Products to Compare
              </h2>
              {selectedProducts.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All ({selectedProducts.length})
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProducts.map((product) => {
                const isSelected = selectedProducts.some(p => p.id === product.id)
                const isDisabled = !isSelected && selectedProducts.length >= 3
                
                return (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                    className={`
                      relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'border-primary bg-primary/5' 
                        : isDisabled 
                        ? 'border-surface-200 bg-surface-100 opacity-50' 
                        : 'border-surface-200 hover:border-surface-300'
                      }
                    `}
                    onClick={() => !isDisabled && handleProductToggle(product)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(product.type)}`}>
                          <ApperIcon name={getIcon(product.type)} className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-surface-900">{product.name}</h3>
                          <p className="text-sm text-surface-500 capitalize">{product.type} Insurance</p>
                        </div>
                      </div>
                      
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center
                        ${isSelected 
                          ? 'bg-primary border-primary' 
                          : 'border-surface-300'
                        }
                      `}>
                        {isSelected && (
                          <ApperIcon name="Check" className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="text-lg font-bold text-surface-900">
                      {formatCurrency(product.startingPrice)}
                      <span className="text-sm font-normal text-surface-500">/year</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Comparison Table */}
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-surface-900 mb-6">
                  Comparison Details
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-200">
                        <th className="text-left py-4 pr-6 font-medium text-surface-900 w-48">
                          Features
                        </th>
                        {selectedProducts.map((product) => (
                          <th key={product.id} className="text-center py-4 px-4 min-w-64">
                            <div className="flex flex-col items-center space-y-2">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(product.type)}`}>
                                <ApperIcon name={getIcon(product.type)} className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-surface-900">{product.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {product.type}
                                </Badge>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    
                    <tbody>
                      {/* Starting Price */}
                      <tr className="border-b border-surface-100">
                        <td className="py-4 pr-6 font-medium text-surface-900">
                          Starting Price (per year)
                        </td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="text-center py-4 px-4">
                            <div className="text-lg font-bold text-primary">
                              {formatCurrency(product.startingPrice)}
                            </div>
                          </td>
                        ))}
                      </tr>
                      
                      {/* Max Coverage */}
                      <tr className="border-b border-surface-100">
                        <td className="py-4 pr-6 font-medium text-surface-900">
                          Maximum Coverage
                        </td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="text-center py-4 px-4">
                            <div className="font-semibold text-surface-900">
                              {formatCurrency(product.maxCoverage)}
                            </div>
                          </td>
                        ))}
                      </tr>
                      
                      {/* Benefits */}
                      <tr className="border-b border-surface-100">
                        <td className="py-4 pr-6 font-medium text-surface-900">
                          Key Benefits
                        </td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="py-4 px-4">
                            <ul className="space-y-2 text-sm">
                              {product.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-start space-x-2">
                                  <ApperIcon name="Check" className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                  <span className="text-surface-600">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        ))}
                      </tr>
                      
                      {/* Actions */}
                      <tr>
                        <td className="py-6 pr-6 font-medium text-surface-900">
                          Get Quote
                        </td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="text-center py-6 px-4">
                            <Button 
                              onClick={() => handleGetQuote(product.type)}
                              size="sm"
                              className="w-full"
                            >
                              Get Quote
                            </Button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {selectedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="Scale" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-900 mb-2">
              No Products Selected
            </h3>
            <p className="text-surface-600 mb-6">
              Select products from above to see a detailed comparison
            </p>
            <Button onClick={() => navigate('/products')} variant="outline">
              Browse All Products
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ComparisonTable