import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Bell, CheckCircle, Clock, Mail, Phone } from 'lucide-react'
import { formatCurrency, getStatusColor, formatDate } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { mockCases } from '@/data/mockData'

export default function DCAPortal() {
  const { user } = useAuth()
  const [selectedDCA] = useState('Alpha Collections')
  const assignedCases = mockCases.filter(c => c.dca === user.dcaName)
  const pendingCases = assignedCases.filter(c => c.status === 'assigned' || c.status === 'in-progress')

  const handleStatusUpdate = (caseId, newStatus) => {
    alert(`Status updated for ${caseId} to ${newStatus}`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">DCA Portal</h1>
          <p className="text-muted-foreground mt-1">Logged in as: {selectedDCA}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedCases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(assignedCases.reduce((sum, c) => sum + c.amount, 0))}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Aging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(assignedCases.reduce((sum, c) => sum + c.aging, 0) / assignedCases.length)} days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Cases */}
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Cases</CardTitle>
          <CardDescription>Cases requiring your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Aging</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedCases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-sm">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.customerName}</TableCell>
                  <TableCell>{formatCurrency(c.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className={c.aging > 90 ? 'text-red-600 font-semibold' : ''}>
                        {c.aging}d
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(c.status)}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {c.lastContact ? formatDate(c.lastContact) : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusUpdate(c.id, 'in-progress')}
                      >
                        Update
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleStatusUpdate(c.id, 'resolved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Button variant="outline" className="h-20">
            <div className="text-center">
              <Mail className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-semibold">Send Bulk Email</div>
            </div>
          </Button>
          <Button variant="outline" className="h-20">
            <div className="text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-semibold">Batch Update Status</div>
            </div>
          </Button>
          <Button variant="outline" className="h-20">
            <div className="text-center">
              <Bell className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-semibold">Request Escalation</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}