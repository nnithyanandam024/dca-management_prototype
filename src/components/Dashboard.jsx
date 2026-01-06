import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, AlertCircle, Users } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { mockCases, dcaList, mockRecoveryTrend } from '@/data/mockData'
import { useTheme } from '@/contexts/ThemeContext'

export default function Dashboard() {
  const { theme } = useTheme()
  const totalOutstanding = mockCases.reduce((sum, c) => sum + c.amount, 0)
  const avgAging = Math.round(mockCases.reduce((sum, c) => sum + c.aging, 0) / mockCases.length)
  const criticalCases = mockCases.filter(c => c.priority === 'critical').length

  const statusData = [
    { name: 'New', value: mockCases.filter(c => c.status === 'new').length, color: '#3b82f6' },
    { name: 'Assigned', value: mockCases.filter(c => c.status === 'assigned').length, color: '#8b5cf6' },
    { name: 'In Progress', value: mockCases.filter(c => c.status === 'in-progress').length, color: '#eab308' },
    { name: 'Resolved', value: mockCases.filter(c => c.status === 'resolved').length, color: '#10b981' },
    { name: 'Escalated', value: mockCases.filter(c => c.status === 'escalated').length, color: '#ef4444' }
  ]

  const dcaPerformance = dcaList.map(dca => ({
    name: dca.name,
    recoveryRate: (dca.recoveryRate * 100).toFixed(1),
    activeCases: dca.activeCases
  }))

  // Chart colors based on theme
  const chartColors = {
    grid: theme === 'dark' ? '#374151' : '#e5e7eb',
    text: theme === 'dark' ? '#9ca3af' : '#6b7280',
  }

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">DCA Management Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">Across {mockCases.length} cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Aging</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgAging} days</div>
            <p className="text-xs text-muted-foreground">Average across portfolio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalCases}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active DCAs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{dcaList.length}</div>
            <p className="text-xs text-muted-foreground">Managing collections</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recovery Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockRecoveryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="month" stroke={chartColors.text} />
                <YAxis stroke={chartColors.text} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${chartColors.grid}`,
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="recovered" stroke="#3b82f6" strokeWidth={2} name="Recovered Amount" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cases by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    border: `1px solid ${chartColors.grid}`,
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* DCA Performance */}
      <Card>
        <CardHeader>
          <CardTitle>DCA Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dcaPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis yAxisId="left" stroke={chartColors.text} />
              <YAxis yAxisId="right" orientation="right" stroke={chartColors.text} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: `1px solid ${chartColors.grid}`,
                  borderRadius: '8px',
                  color: theme === 'dark' ? '#f3f4f6' : '#111827'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="recoveryRate" fill="#10b981" name="Recovery Rate %" />
              <Bar yAxisId="right" dataKey="activeCases" fill="#3b82f6" name="Active Cases" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}