// Simulation delay for realistic API behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data for comparable products (matches Products.jsx data structure)
const mockProducts = [
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

// In-memory comparison state
let comparisonList = []

const comparisonService = {
  // Get all products available for comparison
  async getComparableProducts() {
    await delay(300)
    return [...mockProducts]
  },

  // Add product to comparison list
  async addToComparison(product) {
    await delay(200)
    if (comparisonList.length >= 3) {
      throw new Error('Maximum 3 products can be compared')
    }
    if (!comparisonList.find(p => p.id === product.id)) {
      comparisonList.push({...product})
    }
    return [...comparisonList]
  },

  // Remove product from comparison list
  async removeFromComparison(productId) {
    await delay(200)
    comparisonList = comparisonList.filter(p => p.id !== productId)
    return [...comparisonList]
  },

  // Get current comparison list
  async getComparisonList() {
    await delay(100)
    return [...comparisonList]
  },

  // Clear all products from comparison
  async clearComparison() {
    await delay(100)
    comparisonList = []
    return []
  }
}

export default comparisonService