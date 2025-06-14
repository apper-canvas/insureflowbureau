import mockQuotes from '../mockData/quotes.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class QuoteService {
  constructor() {
    this.quotes = [...mockQuotes]
  }

  async getAll() {
    await delay(200)
    return [...this.quotes]
  }

  async getById(id) {
    await delay(200)
    const quote = this.quotes.find(q => q.id === id)
    if (!quote) {
      throw new Error('Quote not found')
    }
    return { ...quote }
  }

  async create(quoteData) {
    await delay(300)
    const newQuote = {
      id: Date.now().toString(),
      ...quoteData,
      timestamp: new Date().toISOString()
    }
    this.quotes.push(newQuote)
    return { ...newQuote }
  }

  async calculatePremium(quoteData) {
    await delay(500)
    
    const basePremiums = {
      health: 5000,
      auto: 3000,
      travel: 500,
      life: 8000,
      home: 4000
    }

    const base = basePremiums[quoteData.policyType] || 3000
    let premium = base

    // Age factor
    if (quoteData.age) {
      if (quoteData.age > 50) premium *= 1.5
      else if (quoteData.age > 30) premium *= 1.2
    }

    // Coverage amount factor
    if (quoteData.coverageAmount) {
      premium = (premium * quoteData.coverageAmount) / 100000
    }

    // Duration factor
    if (quoteData.duration) {
      premium = premium * (quoteData.duration / 12)
    }

    return Math.round(premium)
  }

  async update(id, updateData) {
    await delay(250)
    const index = this.quotes.findIndex(q => q.id === id)
    if (index === -1) {
      throw new Error('Quote not found')
    }
    this.quotes[index] = { ...this.quotes[index], ...updateData }
    return { ...this.quotes[index] }
  }

  async delete(id) {
    await delay(200)
    const index = this.quotes.findIndex(q => q.id === id)
    if (index === -1) {
      throw new Error('Quote not found')
    }
    this.quotes.splice(index, 1)
    return true
  }
}

export default new QuoteService()