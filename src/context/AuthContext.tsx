import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { getProfile, loginUser, registerUser } from '../services/api'

type User = {
  id: string
  email: string
  phone: string
  full_name: string
  role: string
  is_verified: boolean
}

type AuthContextType = {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkStoredToken()
  }, [])

  const checkStoredToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token')
      if (storedToken) {
        setToken(storedToken)
        try {
          const response = await getProfile()
          setUser(response.data.user)
        } catch (profileError) {
          await AsyncStorage.removeItem('token')
          setToken(null)
        }
      }
    } catch (error) {
      console.log('Token check error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string) => {
    const response = await loginUser({ email })
    const { token: newToken, user: newUser } = response.data
    await AsyncStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const register = async (data: any) => {
    const response = await registerUser(data)
    const { token: newToken, user: newUser } = response.data
    await AsyncStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
    } catch (error) {
      console.log('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)