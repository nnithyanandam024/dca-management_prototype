import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, AlertCircle, Users, Activity } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { mockCases, dcaList, mockRecoveryTrend } from '@/data/mockData'

export default function Dashboard() {
  const totalOutstanding = mockCases.reduce((sum, c) => sum + c.amount, 0)
  const avgAging = Math.round(mockCases.reduce((sum, c) => sum + c.aging, 0) / mockCases.length)
  const criticalCases = mockCases.filter(c => c.priority === 'critical').length
  const recoveryRate = mockCases.filter(c => c.status === 'resolved').length / mockCases.length

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">DCA Management Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2lg:grid-cols-4">
<Card>
<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
<CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
<DollarSign className="h-4 w-4 text-muted-foreground" />
</CardHeader>
<CardContent>
<div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
<p className="text-xs text-muted-foreground">Across {mockCases.length} cases</p>
</CardContent>
</Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Avg Aging</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{avgAging} days</div>
        <p className="text-xs text-muted-foreground">Average across portfolio</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
        <AlertCircle className="h-4 w-4 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-red-600">{criticalCases}</div>
        <p className="text-xs text-muted-foreground">Require immediate attention</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active DCAs</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{dcaList.length}</div>
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
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
            <Tooltip />
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
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