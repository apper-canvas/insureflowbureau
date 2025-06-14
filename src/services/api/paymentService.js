import paymentsData from '@/services/mockData/payments.json'

let payments = [...paymentsData.paymentHistory]
let paymentMethods = [...paymentsData.paymentMethods]

export const paymentService = {
  // Get payment history for a user
  async getPaymentHistory(userId = 'user1') {
    await new Promise(resolve => setTimeout(resolve, 300))
    const userPayments = payments.filter(payment => payment.userId === userId)
    return userPayments.sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  // Get payment methods for a user
  async getPaymentMethods(userId = 'user1') {
    await new Promise(resolve => setTimeout(resolve, 300))
    return paymentMethods.filter(method => method.userId === userId)
  },

  // Add new payment method
  async addPaymentMethod(userId, methodData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newMethod = {
      id: `pm_${Date.now()}`,
      userId,
      ...methodData,
      createdAt: new Date().toISOString()
    }
    paymentMethods.push(newMethod)
    return { ...newMethod }
  },

  // Update payment method
  async updatePaymentMethod(methodId, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = paymentMethods.findIndex(method => method.id === methodId)
    if (index === -1) throw new Error('Payment method not found')
    
    paymentMethods[index] = { ...paymentMethods[index], ...updates }
    return { ...paymentMethods[index] }
  },

  // Delete payment method
  async deletePaymentMethod(methodId) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = paymentMethods.findIndex(method => method.id === methodId)
    if (index === -1) throw new Error('Payment method not found')
    
    paymentMethods.splice(index, 1)
    return true
  },

  // Process payment
  async processPayment(paymentData) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newPayment = {
      id: `pay_${Date.now()}`,
      ...paymentData,
      date: new Date().toISOString(),
      status: 'completed'
    }
    
    payments.push(newPayment)
    return { ...newPayment }
  },

  // Get upcoming payment reminders
  async getUpcomingPayments(userId = 'user1') {
    await new Promise(resolve => setTimeout(resolve, 300))
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
    
    return paymentsData.upcomingPayments
      .filter(payment => payment.userId === userId)
      .filter(payment => {
        const dueDate = new Date(payment.dueDate)
        return dueDate >= now && dueDate <= thirtyDaysFromNow
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }
}