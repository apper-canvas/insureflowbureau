import mockPolicies from '../mockData/policies.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class PolicyService {
  constructor() {
    this.policies = [...mockPolicies]
  }

  async getAll() {
    await delay(300)
    return [...this.policies]
  }

  async getById(id) {
    await delay(250)
    const policy = this.policies.find(p => p.id === id)
    if (!policy) {
      throw new Error('Policy not found')
    }
    return { ...policy }
  }

  async create(policyData) {
    await delay(400)
    const newPolicy = {
      id: Date.now().toString(),
      ...policyData,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0]
    }
    this.policies.push(newPolicy)
    return { ...newPolicy }
  }

  async update(id, updateData) {
    await delay(350)
    const index = this.policies.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Policy not found')
    }
    this.policies[index] = { ...this.policies[index], ...updateData }
    return { ...this.policies[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.policies.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Policy not found')
    }
    this.policies.splice(index, 1)
    return true
  }

  async getByType(type) {
    await delay(250)
    return this.policies.filter(p => p.type === type)
  }
}

export default new PolicyService()