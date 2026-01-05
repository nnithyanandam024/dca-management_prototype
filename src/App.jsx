import { useState } from 'react'
import { LayoutDashboard, List, BarChart3, Building2 } from 'lucide-react'
import Dashboard from './components/Dashboard'
import CaseList from './components/CaseList'
import Analytics from './components/Analytics'
import DCAPortal from './components/DCAPortal'
import { Button } from './components/ui/button'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', name: 'Cases', icon: List },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'dca', name: 'DCA Portal', icon: Building2 },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
<div className="w-64 bg-white border-r border-gray-200 flex flex-col">
  <div className="p-6">
    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      DCA Manager
    </h1>
    <p className="text-sm text-gray-500 mt-1">FedEx Collections</p>
  </div>
  
  <nav className="px-4 space-y-1 flex-1">
    {navigation.map((item) => {
      const Icon = item.icon
      return (
        <Button
          key={item.id}
          variant={currentView === item.id ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => setCurrentView(item.id)}
        >
          <Icon className="h-5 w-5 mr-3" />
          {item.name}
        </Button>
      )
    })}
  </nav>

  {/* User Profile Card - Fixed at bottom */}
  <div className="p-4">
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-100">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
          JD
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold truncate">John Doe</div>
          <div className="text-xs text-gray-500 truncate">Admin</div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'cases' && <CaseList />}
        {currentView === 'analytics' && <Analytics />}
        {currentView === 'dca' && <DCAPortal />}
</div>
</div>
)
}
export default App