import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Search, Filter, Sparkles, Download } from 'lucide-react'
import { formatCurrency, getPriorityColor, getStatusColor } from '@/lib/utils'
import { mockCases } from '@/data/mockData'
import { prioritizeCases } from '@/lib/ai'
import * as XLSX from 'xlsx'


export default function CaseList() {
  const [cases, setCases] = useState(mockCases)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleAIPrioritization = async () => {
    setLoading(true)
    try {
      const aiResults = await prioritizeCases(cases)
      
      if (aiResults && aiResults.analysis) {
        const updatedCases = cases.map(c => {
          const aiCase = aiResults.analysis.find(a => a.caseId === c.id)
          if (aiCase) {
            return {
              ...c,
              aiPriorityScore: aiCase.priorityScore,
              aiRecoveryProb: aiCase.recoveryProbability,
              aiRecommendation: aiCase.recommendedAction,
              aiReasoning: aiCase.reasoning
            }
          }
          return c
        })
        
        updatedCases.sort((a, b) => (b.aiPriorityScore || 0) - (a.aiPriorityScore || 0))
        setCases(updatedCases)
      }
    } catch (error) {
      console.error('AI prioritization failed:', error)
      alert('AI prioritization failed. Using default sorting.')
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = () => {
  const exportData = filteredCases.map(c => ({
    "Case ID": c.id,
    "Customer Name": c.customerName,
    "Amount": c.amount,
    "Aging (Days)": c.aging,
    "Priority": c.priority,
    "Status": c.status,
    "DCA": c.dca || "Unassigned",
    "AI Priority Score": c.aiPriorityScore ?? "",
    "AI Recovery Probability": c.aiRecoveryProb ?? "",
    "AI Recommendation": c.aiRecommendation ?? ""
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cases")

  XLSX.writeFile(workbook, "DCA_Cases_Export.xlsx")
}


  const filteredCases = cases.filter(c => {
    const matchesSearch = c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Case Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={handleAIPrioritization} 
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? 'Analyzing...' : 'AI Prioritize'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by customer name or case ID..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cases ({filteredCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Aging</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>DCA</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-sm">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.customerName}</TableCell>
                  <TableCell>{formatCurrency(c.amount)}</TableCell>
                  <TableCell>
                    <span className={c.aging > 90 ? 'text-red-600 font-semibold' : ''}>
                      {c.aging} days
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(c.priority)}>
                      {c.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(c.status)}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.dca || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    {c.aiPriorityScore ? (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                            style={{ width: `${c.aiPriorityScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{c.aiPriorityScore}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}