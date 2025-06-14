import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import FormField from '@/components/molecules/FormField'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Support = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (name, value) => {
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!contactForm.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!contactForm.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!contactForm.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!contactForm.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (contactForm.message.length < 10) {
      newErrors.message = 'Please provide more details (minimum 10 characters)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors and try again')
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Your message has been sent successfully! We\'ll get back to you soon.')
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const supportCategories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'policy', label: 'Policy Questions' },
    { value: 'claims', label: 'Claims Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'technical', label: 'Technical Issues' }
  ]

  const contactMethods = [
    {
      icon: 'Phone',
      title: 'Phone Support',
      description: 'Speak with our experts',
      contact: '1800-123-4567',
      hours: 'Mon-Fri: 9 AM - 6 PM',
      color: 'primary'
    },
    {
      icon: 'Mail',
      title: 'Email Support',
      description: 'Send us your questions',
      contact: 'support@insureflow.com',
      hours: 'Response within 24 hours',
      color: 'secondary'
    },
    {
      icon: 'MessageCircle',
      title: 'Live Chat',
      description: 'Instant assistance',
      contact: 'Chat Now',
      hours: 'Available 24/7',
      color: 'accent'
    }
  ]

  const faqs = [
    {
      question: 'How do I file a claim?',
      answer: 'You can file a claim through our Claims section. Simply provide the incident details, upload required documents, and submit. Our team will review and process your claim within 3-5 business days.'
    },
    {
      question: 'How can I update my policy details?',
      answer: 'You can update most policy details through your account dashboard. For major changes like coverage amount or beneficiary updates, please contact our support team.'
    },
    {
      question: 'What documents do I need for a health insurance claim?',
      answer: 'For health insurance claims, you typically need original medical bills, discharge summary, doctor\'s prescription, diagnostic reports, and your policy documents.'
    },
    {
      question: 'How long does claim settlement take?',
      answer: 'Most claims are processed within 7-10 business days after receiving all required documents. Complex cases may take up to 30 days. You\'ll receive regular updates throughout the process.'
    },
    {
      question: 'Can I cancel my policy?',
      answer: 'Yes, you can cancel your policy. However, cancellation terms vary by policy type. Please contact our support team to understand the process and any applicable charges.'
    }
  ]

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-surface-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-surface-600 max-w-2xl mx-auto">
            We're here to support you every step of the way. Get in touch with our expert team.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="text-center h-full">
                <div className={`
                  w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4
                  ${method.color === 'primary' ? 'bg-primary/10 text-primary' : ''}
                  ${method.color === 'secondary' ? 'bg-secondary/10 text-secondary' : ''}
                  ${method.color === 'accent' ? 'bg-accent/10 text-accent' : ''}
                `}>
                  <ApperIcon name={method.icon} className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-semibold text-surface-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-surface-600 mb-3">
                  {method.description}
                </p>
                <p className="font-semibold text-surface-900 mb-1">
                  {method.contact}
                </p>
                <p className="text-sm text-surface-500">
                  {method.hours}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Send" className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-surface-900">
                    Send us a Message
                  </h2>
                  <p className="text-sm text-surface-500">
                    We'll get back to you within 24 hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    required
                  />
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={contactForm.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                  />
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Category
                    </label>
                    <select
                      value={contactForm.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full h-12 px-3 bg-white border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      {supportCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <FormField
                  label="Subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  error={errors.subject}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
                      errors.message ? 'border-error' : 'border-surface-300 focus:border-primary'
                    }`}
                    placeholder="Please describe your question or issue in detail..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message && (
                      <p className="text-sm text-error">{errors.message}</p>
                    )}
                    <p className="text-xs text-surface-500 ml-auto">
                      {contactForm.message.length}/500
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* FAQ Section */}
          <div>
            <Card>
              <h2 className="text-xl font-display font-bold text-surface-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-surface-200 pb-4 last:border-b-0"
                  >
                    <h3 className="font-semibold text-surface-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-surface-600 text-sm">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card className="mt-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="AlertCircle" className="w-6 h-6 text-error" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-surface-900 mb-2">
                    Emergency Claims Support
                  </h3>
                  <p className="text-surface-600 text-sm mb-3">
                    For urgent claim assistance or emergencies, contact our 24/7 helpline.
                  </p>
                  <Button variant="error" size="sm">
                    <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                    Call Emergency: 1800-EMERGENCY
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support