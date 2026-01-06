// SLA Rules Configuration
export const slaRules = {
  'new': {
    maxDays: 2,
    description: 'Must be assigned to DCA within 2 days',
    severity: 'high'
  },
  'assigned': {
    maxDays: 3,
    description: 'DCA must make first contact within 3 days',
    severity: 'high'
  },
  'in-progress': {
    maxDays: 30,
    description: 'Must show recovery progress within 30 days',
    severity: 'medium'
  },
  'escalated': {
    maxDays: 7,
    description: 'Management intervention required within 7 days',
    severity: 'critical'
  }
}

// Calculate SLA status for a case
export function calculateSLA(caseData) {
  const rule = slaRules[caseData.status]
  if (!rule) return null

  const referenceDate = caseData.assignedDate || caseData.createdDate || new Date()
  const daysSince = Math.floor(
    (new Date() - new Date(referenceDate)) / (1000 * 60 * 60 * 24)
  )

  const daysRemaining = rule.maxDays - daysSince
  const percentUsed = (daysSince / rule.maxDays) * 100

  return {
    compliant: daysSince <= rule.maxDays,
    daysRemaining,
    daysSince,
    percentUsed: Math.min(percentUsed, 100),
    breached: daysSince > rule.maxDays,
    atRisk: daysRemaining <= 1 && daysRemaining >= 0,
    severity: rule.severity,
    description: rule.description,
    maxDays: rule.maxDays
  }
}

// Get SLA status color
export function getSLAStatusColor(sla) {
  if (!sla) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  
  if (sla.breached) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  if (sla.atRisk) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

// Get all SLA alerts
export function getSLAAlerts(cases) {
  const alerts = []
  
  cases.forEach(caseData => {
    const sla = calculateSLA(caseData)
    if (sla && (sla.breached || sla.atRisk)) {
      alerts.push({
        caseId: caseData.id,
        customerName: caseData.customerName,
        status: caseData.status,
        sla,
        priority: sla.breached ? 'critical' : 'warning'
      })
    }
  })

  return alerts.sort((a, b) => {
    if (a.priority === 'critical' && b.priority !== 'critical') return -1
    if (a.priority !== 'critical' && b.priority === 'critical') return 1
    return a.sla.daysRemaining - b.sla.daysRemaining
  })
}