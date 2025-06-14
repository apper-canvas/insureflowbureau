import mockClaims from '../mockData/claims.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ClaimService {
  constructor() {
    this.claims = [...mockClaims]
  }

  async getAll() {
    await delay(300)
    return [...this.claims]
  }

  async getById(id) {
    await delay(250)
    const claim = this.claims.find(c => c.id === id)
    if (!claim) {
      throw new Error('Claim not found')
    }
    return { ...claim }
  }

  async create(claimData) {
    await delay(400)
    const newClaim = {
      id: Date.now().toString(),
      ...claimData,
      status: 'pending',
      filedDate: new Date().toISOString().split('T')[0]
    }
    this.claims.push(newClaim)
    return { ...newClaim }
  }

  async update(id, updateData) {
    await delay(350)
    const index = this.claims.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Claim not found')
    }
    this.claims[index] = { ...this.claims[index], ...updateData }
    return { ...this.claims[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.claims.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Claim not found')
    }
    this.claims.splice(index, 1)
    return true
  }

  async getByPolicyId(policyId) {
    await delay(250)
    return this.claims.filter(c => c.policyId === policyId)
  }
}

export default new ClaimService()