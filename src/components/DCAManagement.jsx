import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Award,
  AlertCircle,
  Mail,
  Phone,
  DollarSign,
  Users,
  CheckCircle,
  Clock
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { dcaList, mockCases } from '@/data/mockData'

export default function DCAManagement() {
  const [dcas, setDcas] = useState(dcaList)
  const [showAddModal, setShowAddModal] = useState(false)

  // Calculate aggregate metrics
  const totalActiveCases = dcas.reduce((sum, dca) => sum + dca.activeCases, 0)
  const avgRecoveryRate = (dcas.reduce((sum, dca) => sum + dca.recoveryRate, 0) / dcas.length * 100).toFixed(1)
  const totalRecovered = dcas.reduce((sum, dca) => sum + dca.totalRecovered, 0)
  const topPerformer = dcas.reduce((max, dca) => dca.performanceScore > max.performanceScore ? dca : max)

  const getPerformanceBadge = (score) => {
    if (score >= 85) return { color: 'bg-green-100 text-green-800 border-green-200', label: 'Excellent' }
    if (score >= 70) return { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Good' }
    if (score >= 50) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Average' }
    return { color: 'bg-red-100 text-red-800 border-red-200', label: 'Needs Improvement' }
  }

  const handleAssignCases = (dcaId) => {
    alert(`Opening case assignment for DCA: ${dcaId}`)
  }

  const handleEditDCA = (dcaId) => {
    alert(`Edit DCA: ${dcaId}`)
  }

  const handleRemoveDCA = (dcaId) => {
    if (confirm('Are you sure you want to remove this DCA?')) {
      setDcas(dcas.filter(d => d.id !== dcaId))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">DCA Management</h1>
          <p className="text-gray-600 mt-1">Manage collection agencies and monitor performance</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New DCA
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active DCAs</CardTitle>
            <Building2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dcas.length}</div>
            <p className="text-xs text-gray-500 mt-1">Collection agencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Cases</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveCases}</div>
            <p className="text-xs text-gray-500 mt-1">Across all DCAs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Recovery Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgRecoveryRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Network average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recovered</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalRecovered)}</div>
            <p className="text-xs text-gray-500 mt-1">Year to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performer Highlight */}
      <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Top Performer</div>
                <div className="text-2xl font-bold text-gray-900">{topPerformer.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Performance Score: <span className="font-semibold text-orange-600">{topPerformer.performanceScore}/100</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Recovery Rate</div>
              <div className="text-3xl font-bold text-green-600">{(topPerformer.recoveryRate * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mt-1">
                {formatCurrency(topPerformer.totalRecovered)} recovered
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DCA List Table */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Agencies</CardTitle>
          <CardDescription>Manage and monitor your DCA network</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency Name</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Active Cases</TableHead>
                <TableHead>Recovery Rate</TableHead>
                <TableHead>Avg Resolution</TableHead>
                <TableHead>Total Recovered</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dcas.map((dca) => {
                const performanceBadge = getPerformanceBadge(dca.performanceScore)
                return (
                  <TableRow key={dca.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {dca.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold">{dca.name}</div>
                          <div className="text-xs text-gray-500">{dca.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold">{dca.performanceScore}</div>
                          <div className="text-xs text-gray-500">/100</div>
                        </div>
                        <Badge className={performanceBadge.color}>
                          {performanceBadge.label}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold">{dca.activeCases}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {dca.recoveryRate >= 0.7 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`font-semibold ${dca.recoveryRate >= 0.7 ? 'text-green-600' : 'text-red-600'}`}>
                          {(dca.recoveryRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{dca.avgResolutionDays} days</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-semibold text-blue-600">
                        {formatCurrency(dca.totalRecovered)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">{dca.contactEmail}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAssignCases(dca.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditDCA(dca.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveDCA(dca.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Comparison */}
      <div className="grid gap-4 md:grid-cols-3">
        {dcas.map((dca) => (
          <Card key={dca.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{dca.name.split(' ')[0]}</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {dca.performanceScore}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Cases</span>
                <span className="font-semibold">{dca.activeCases}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recovery Rate</span>
                <span className="font-semibold text-green-600">
                  {(dca.recoveryRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Resolution</span>
                <span className="font-semibold">{dca.avgResolutionDays}d</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Recovered</span>
                <span className="font-semibold text-blue-600">
                  {formatCurrency(dca.totalRecovered)}
                </span>
              </div>
              <div className="pt-2 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add DCA Modal (placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Add New DCA</CardTitle>
              <CardDescription>Register a new collection agency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Agency Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Enter agency name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded-lg" placeholder="contact@agency.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input type="tel" className="w-full px-3 py-2 border rounded-lg" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowAddModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                  Add DCA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}