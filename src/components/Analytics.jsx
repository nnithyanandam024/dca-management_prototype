import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Target, Clock, Award } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { mockCases, dcaList, mockRecoveryTrend } from '@/data/mockData'

export default function Analytics() {
  const agingBuckets = [
    { range: '0-30', count: mockCases.filter(c => c.aging <= 30).length, amount: mockCases.filter(c => c.aging <= 30).reduce((sum, c) => sum + c.amount, 0) },
    { range: '31-60', count: mockCases.filter(c => c.aging > 30 && c.aging <= 60).length, amount: mockCases.filter(c => c.aging > 30 && c.aging <= 60).reduce((sum, c) => sum + c.amount, 0) },
    { range: '61-90', count: mockCases.filter(c => c.aging > 60 && c.aging <= 90).length, amount: mockCases.filter(c => c.aging > 60 && c.aging <= 90).reduce((sum, c) => sum + c.amount, 0) },
    { range: '90+', count: mockCases.filter(c => c.aging > 90).length, amount: mockCases.filter(c => c.aging > 90).reduce((sum, c) => sum + c.amount, 0) }
  ]

  const dcaComparison = dcaList.map(dca => ({
    name: dca.name.split(' ')[0],
    performance: dca.performanceScore,
    recoveryRate: (dca.recoveryRate * 100).toFixed(1),
    avgDays: dca.avgResolutionDays
  }))

  const totalRecovered = dcaList.reduce((sum, dca) => sum + dca.totalRecovered, 0)
  const avgRecoveryRate = dcaList.reduce((sum, dca) => sum + dca.recoveryRate, 0) / dcaList.length
  const avgResolutionTime = Math.round(dcaList.reduce((sum, dca) => sum + dca.avgResolutionDays, 0) / dcaList.length)
  const topPerformer = dcaList.reduce((max, dca) => dca.performanceScore > max.performanceScore ? dca : max)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics & Insights</h1>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recovered</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRecovered)}</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Recovery Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{(avgRecoveryRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all DCAs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{avgResolutionTime} days</div>
            <p className="text-xs text-muted-foreground">From assignment to closure</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{topPerformer.name.split(' ')[0]}</div>
            <p className="text-xs text-muted-foreground">Score: {topPerformer.performanceScore}/100</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aging Analysis</CardTitle>
            <CardDescription>Cases and amounts by aging bucket</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agingBuckets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'amount') return formatCurrency(value)
                    return value
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Case Count" />
                <Bar yAxisId="right" dataKey="amount" fill="#10b981" name="Total Amount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DCA Performance Comparison</CardTitle>
            <CardDescription>Performance score and recovery rate</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dcaComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="performance" fill="#8b5cf6" name="Performance Score" />
                <Bar dataKey="recoveryRate" fill="#10b981" name="Recovery Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recovery Trend */}
      <Card>
        <CardHeader>
          <CardTitle>6-Month Recovery Trend</CardTitle>
          <CardDescription>Monthly recovered amounts and case volume</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mockRecoveryTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'Recovered Amount') return formatCurrency(value)
                  return value
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={3} name="Recovered Amount" />
              <Line yAxisId="right" type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={2} name="Cases Closed" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}