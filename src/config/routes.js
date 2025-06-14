import Products from '@/components/pages/Products'
import QuoteCalculator from '@/components/pages/QuoteCalculator'
import MyPolicies from '@/components/pages/MyPolicies'
import Claims from '@/components/pages/Claims'
import Support from '@/components/pages/Support'
import PolicyDetails from '@/components/pages/PolicyDetails'
import PurchaseFlow from '@/components/pages/PurchaseFlow'
import ComparisonTable from '@/components/pages/ComparisonTable'

export const routes = {
  products: {
    id: 'products',
    label: 'Products',
    path: '/products',
    icon: 'Shield',
    component: Products
  },
  quote: {
    id: 'quote',
    label: 'Get Quote',
    path: '/quote/:type?',
    icon: 'Calculator',
    component: QuoteCalculator,
    hideFromNav: true
  },
  policies: {
    id: 'policies',
    label: 'My Policies',
    path: '/policies',
    icon: 'FileText',
    component: MyPolicies
  },
  claims: {
    id: 'claims',
    label: 'Claims',
    path: '/claims',
    icon: 'AlertCircle',
    component: Claims
  },
  support: {
    id: 'support',
    label: 'Support',
    path: '/support',
    icon: 'HelpCircle',
    component: Support
  },
  policyDetails: {
    id: 'policyDetails',
    label: 'Policy Details',
    path: '/policy/:id',
    component: PolicyDetails,
    hideFromNav: true
  },
  purchase: {
    id: 'purchase',
    label: 'Purchase',
    path: '/purchase',
component: PurchaseFlow,
    hideFromNav: true
  },
  compare: {
    id: 'compare',
    label: 'Compare Plans',
    path: '/compare',
    component: ComparisonTable,
    hideFromNav: true
  }
}

export const routeArray = Object.values(routes)
export const navRoutes = routeArray.filter(route => !route.hideFromNav)