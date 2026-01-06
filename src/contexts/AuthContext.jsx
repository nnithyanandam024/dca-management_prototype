import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Mock users database
const mockUsers = {
  'admin@fedex.com': {
    password: 'admin123',
    name: 'John Doe',
    role: 'admin',
    dcaName: null,
    avatar: 'JD'
  },
  'dca@alpha.com': {
    password: 'dca123',
    name: 'Sarah Williams',
    role: 'dca',
    dcaName: 'Alpha Collections',
    avatar: 'SW'
  },
  'viewer@fedex.com': {
    password: 'viewer123',
    name: 'Mike Chen',
    role: 'viewer',
    dcaName: null,
    avatar: 'MC'
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('dca_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const foundUser = mockUsers[email]
    
    if (!foundUser) {
      throw new Error('User not found')
    }
    
    if (foundUser.password !== password) {
      throw new Error('Invalid password')
    }

    const userData = {
      email,
      name: foundUser.name,
      role: foundUser.role,
      dcaName: foundUser.dcaName,
      avatar: foundUser.avatar
    }

    setUser(userData)
    localStorage.setItem('dca_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('dca_user')
  }

  const hasPermission = (requiredRoles) => {
    if (!user) return false
    return requiredRoles.includes(user.role)
  }

  const value = {
    user,
    login,
    logout,
    hasPermission,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}