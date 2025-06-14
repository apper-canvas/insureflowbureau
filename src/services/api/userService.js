import mockUsers from '../mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class UserService {
  constructor() {
    this.users = [...mockUsers]
    this.currentUser = this.users[0] // Simulate logged in user
  }

  async getAll() {
    await delay(200)
    return [...this.users]
  }

  async getById(id) {
    await delay(200)
    const user = this.users.find(u => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  }

  async getCurrent() {
    await delay(200)
    return { ...this.currentUser }
  }

  async create(userData) {
    await delay(300)
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      policies: []
    }
    this.users.push(newUser)
    return { ...newUser }
  }

  async update(id, updateData) {
    await delay(300)
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    this.users[index] = { ...this.users[index], ...updateData }
    
    if (id === this.currentUser.id) {
      this.currentUser = { ...this.users[index] }
    }
    
    return { ...this.users[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    this.users.splice(index, 1)
    return true
  }
}

export default new UserService()