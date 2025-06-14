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
this.claims.splice(index, 1)
    return true
  }

  async getByPolicyId(policyId) {
    await delay(250)
    return this.claims.filter(c => c.policyId === policyId)
  }

  getStatusTimeline(claim) {
    const baseSteps = {
      medical: [
        { key: 'submitted', label: 'Claim Submitted', description: 'Your claim has been received and is being reviewed' },
        { key: 'documents', label: 'Document Review', description: 'Medical documents and bills are being verified' },
        { key: 'assessment', label: 'Medical Assessment', description: 'Our medical team is evaluating your claim' },
        { key: 'approval', label: 'Final Approval', description: 'Claim is being processed for settlement' },
        { key: 'settlement', label: 'Settlement', description: 'Payment has been processed to your account' }
      ],
      accident: [
        { key: 'submitted', label: 'Claim Submitted', description: 'Your accident claim has been logged' },
        { key: 'investigation', label: 'Investigation', description: 'Accident details and damages are being assessed' },
        { key: 'survey', label: 'Vehicle Survey', description: 'Professional surveyor is evaluating damages' },
        { key: 'approval', label: 'Settlement Approval', description: 'Claim amount is being finalized' },
        { key: 'settlement', label: 'Payment', description: 'Settlement amount is being transferred' }
      ],
      baggage: [
        { key: 'submitted', label: 'Claim Submitted', description: 'Lost baggage claim has been registered' },
        { key: 'verification', label: 'Document Verification', description: 'Airline reports and receipts are being verified' },
        { key: 'assessment', label: 'Loss Assessment', description: 'Baggage contents and value are being evaluated' },
        { key: 'approval', label: 'Claim Decision', description: 'Final decision on your claim is being made' },
        { key: 'settlement', label: 'Compensation', description: 'Approved amount is being processed' }
      ],
      theft: [
        { key: 'submitted', label: 'Claim Submitted', description: 'Theft claim has been received' },
        { key: 'police', label: 'Police Verification', description: 'FIR and police reports are being verified' },
        { key: 'investigation', label: 'Investigation', description: 'Theft incident is being investigated' },
        { key: 'approval', label: 'Final Review', description: 'Claim is under final review for approval' },
        { key: 'settlement', label: 'Settlement', description: 'Compensation is being processed' }
      ]
    }

    return baseSteps[claim.type] || baseSteps.medical
  }

  getCurrentStep(claim) {
    const steps = this.getStatusTimeline(claim)
    
    switch (claim.status) {
      case 'pending':
        return 0 // First step
      case 'processing':
        return Math.floor(steps.length * 0.6) // Around 60% complete
      case 'approved':
        return steps.length - 1 // Last step
      case 'rejected':
        return Math.floor(steps.length * 0.5) // Stopped midway
      default:
        return 0
    }
  }

  getEstimatedCompletion(claim) {
    const filedDate = new Date(claim.filedDate)
    const now = new Date()
    const daysPassed = Math.floor((now - filedDate) / (1000 * 60 * 60 * 24))
    
    // Typical processing times by claim type (in days)
    const processingTimes = {
      medical: 7,
      accident: 14,
      baggage: 10,
      theft: 21
    }
    
    const totalDays = processingTimes[claim.type] || 7
    const currentStep = this.getCurrentStep(claim)
    const totalSteps = this.getStatusTimeline(claim).length
    
    if (claim.status === 'approved') {
      return {
        completed: true,
        completedDate: claim.approvedDate || claim.filedDate,
        message: 'Claim has been settled successfully'
      }
    }
    
    if (claim.status === 'rejected') {
      return {
        completed: true,
        completedDate: claim.rejectedDate || claim.filedDate,
        message: 'Claim was not approved'
      }
    }
    
    const remainingSteps = totalSteps - currentStep - 1
    const remainingDays = Math.max(1, Math.ceil((remainingSteps / totalSteps) * totalDays))
    const estimatedDate = new Date(now.getTime() + (remainingDays * 24 * 60 * 60 * 1000))
    
    return {
      completed: false,
      estimatedDays: remainingDays,
      estimatedDate: estimatedDate.toISOString().split('T')[0],
      message: `Expected completion in ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`
    }
  }
}

export const claimService = new ClaimService()