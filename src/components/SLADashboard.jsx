import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Shield, Bell } from 'lucide-react'
import { mockCases } from '@/data/mockData'
import { calculateSLA, getSLAStatusColor, getSLAAlerts } from '@/lib/slaRules'
import { formatCurrency } from '@/lib/utils'

export default function SLADashboard() {
  const casesWithSLA = mockCases.map(c => ({
    ...c,
    sla: calculateSLA(c)
  }))

  const compliantCases = casesWithSLA.filter(c => c.sla && c.sla.compliant)
  const atRiskCases = casesWithSLA.filter(c => c.sla && c.sla.atRisk)
  const breachedCases = casesWithSLA.filter(c => c.sla && c.sla.breached)
  const alerts = getSLAAlerts(mockCases)

  const complianceRate = ((compliantCases.length / casesWithSLA.length) * 100).toFixed(1)

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SLA Monitoring</h1>
          <p className="text-muted-foreground mt-1">Track service level compliance and alerts</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Bell className="h-4 w-4 mr-2" />
          Configure Alerts
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{complianceRate}%</div>
            <p className="text-xs text-muted-foreground">{compliantCases.length} of {casesWithSLA.length} cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{atRiskCases.length}</div>
            <p className="text-xs text-muted-foreground">Within 1 day of breach</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Breached</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{breachedCases.length}</div>
            <p className="text-xs text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{compliantCases.length}</div>
            <p className="text-xs text-muted-foreground">On track</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Active SLA Alerts
                </CardTitle>
                <CardDescription>Cases requiring immediate attention</CardDescription>
              </div>
              <Badge className="bg-red-600 text-white">{alerts.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.caseId} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{alert.caseId}</span>
                      <Badge className={getSLAStatusColor(alert.sla)}>
                        {alert.sla.breached ? 'BREACHED' : 'AT RISK'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.customerName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.sla.description}</p>
                  </div>
                  <div className="text-right mr-4">
                    <div className={`text-lg font-bold ${alert.sla.breached ? 'text-red-600' : 'text-yellow-600'}`}>
                      {alert.sla.breached ? `+${Math.abs(alert.sla.daysRemaining)}` : alert.sla.daysRemaining} days
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {alert.sla.breached ? 'overdue' : 'remaining'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">View Case</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SLA Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Cases - SLA Status</CardTitle>
          <CardDescription>Complete overview of SLA compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {casesWithSLA.map(caseData => {
              const sla = caseData.sla
              if (!sla) return null

              return (
                <div key={caseData.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-foreground">{caseData.id}</span>
                      <Badge className={getSLAStatusColor(sla)}>
                        {sla.breached ? 'BREACHED' : sla.atRisk ? 'AT RISK' : 'COMPLIANT'}
                      </Badge>
                      <Badge variant="outline" className="capitalize">{caseData.status}</Badge>
                    </div>
                    <p className="text-sm text-foreground mt-1">{caseData.customerName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{sla.description}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Days Since Assignment</div>
                      <div className="text-lg font-bold text-foreground">{sla.daysSince}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">SLA Progress</div>
                      <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            sla.breached ? 'bg-red-600' : 
                            sla.atRisk ? 'bg-yellow-600' : 
                            'bg-green-600'
                          }`}
                          style={{ width: `${Math.min(sla.percentUsed, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs font-semibold mt-1 text-foreground">
                        {sla.percentUsed.toFixed(0)}%
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        {sla.breached ? 'Overdue By' : 'Time Remaining'}
                      </div>
                      <div className={`text-lg font-bold ${
                        sla.breached ? 'text-red-600' : 
                        sla.atRisk ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {sla.breached ? `+${Math.abs(sla.daysRemaining)}` : sla.daysRemaining} days
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Amount</div>
                      <div className="font-semibold text-foreground">{formatCurrency(caseData.amount)}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* SLA Rules Reference */}
      <Card>
        <CardHeader>
          <CardTitle>SLA Rules & Guidelines</CardTitle>
          <CardDescription>Service level agreements for each case status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">New Cases</h3>
                  <p className="text-xs text-muted-foreground">2 days SLA</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Must be assigned to a DCA within 2 business days of case creation.</p>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Assigned Cases</h3>
                  <p className="text-xs text-muted-foreground">3 days SLA</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">DCA must make first contact attempt within 3 business days of assignment.</p>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">In Progress</h3>
                  <p className="text-xs text-muted-foreground">30 days SLA</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Case must show meaningful recovery progress within 30 days.</p>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Escalated</h3>
                  <p className="text-xs text-muted-foreground">7 days SLA</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Management intervention and resolution plan required within 7 days.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}