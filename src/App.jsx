import { useState } from 'react'
import { LayoutDashboard, List, BarChart3, Building2, Users as UsersIcon, LogOut } from 'lucide-react'
import { Shield } from 'lucide-react'
import Dashboard from './components/Dashboard'
import CaseList from './components/CaseList'
import Analytics from './components/Analytics'
import DCAPortal from './components/DCAPortal'
import DCAManagement from './components/DCAManagement'
import SLADashboard from './components/SLADashboard'
import LoginPage from './components/LoginPage'
import ThemeToggle from './components/ThemeToggle'
import { Button } from './components/ui/button'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

function AppContent() {
  const { user, logout, hasPermission, loading } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  const allNavigation = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      roles: ['admin', 'viewer'],
      component: Dashboard
    },
    { 
      id: 'cases', 
      name: 'Case Management', 
      icon: List, 
      roles: ['admin'],
      component: CaseList
    },
    { 
      id: 'dca-management', 
      name: 'DCA Management', 
      icon: UsersIcon, 
      roles: ['admin'],
      component: DCAManagement
    },
     { 
      id: 'my-cases', 
      name: 'My Cases', 
      icon: Building2, 
      roles: ['dca'],
      component: DCAPortal
    },
    { 
    id: 'sla-monitoring',  
    name: 'SLA Monitoring', 
    icon: Shield, 
    roles: ['admin', 'dca'],
    component: SLADashboard
   },
   { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: BarChart3, 
      roles: ['admin', 'viewer'],
      component: Analytics
    },
  ]

  const navigation = allNavigation.filter(item => hasPermission(item.roles))

 
  const defaultView = user.role === 'dca' ? 'my-cases' : 'dashboard'
  if (currentView === 'dashboard' && user.role === 'dca') {
    setCurrentView(defaultView)
  }

  const CurrentComponent = navigation.find(nav => nav.id === currentView)?.component || Dashboard

  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Admin' },
      dca: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', label: 'DCA Agent' },
      viewer: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Viewer' }
    }
    return badges[role] || badges.viewer
  }

  const roleBadge = getRoleBadge(user.role)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DCA Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-1">FedEx Collections</p>
          </div>
          <ThemeToggle />
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

        {/* User Profile Card */}
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                {user.dcaName && (
                  <div className="text-xs text-muted-foreground truncate mt-0.5">{user.dcaName}</div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-7 px-2 text-xs"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        <CurrentComponent />
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App