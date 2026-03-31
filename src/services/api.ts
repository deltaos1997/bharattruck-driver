import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const BASE_URL = 'https://bharattruck-backend-production.up.railway.app/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Before every request, read the token fresh from storage
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.log('Token read error:', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auth
export const registerUser = (data: {
  email: string
  phone: string
  full_name: string
  role: string
  password: string
}) => api.post('/auth/register', data)

export const loginUser = (data: { email?: string; phone?: string }) =>
  api.post('/auth/login', data)

export const getProfile = () => api.get('/auth/profile')

// Bookings
export const getAvailableBookings = () => api.get('/bookings/available')
export const getMyBookings = () => api.get('/bookings/mine')
export const acceptBooking = (id: string) => api.patch(`/bookings/${id}/accept`, {})
export const updateBookingStatus = (id: string, status: string) =>
  api.patch(`/bookings/${id}/status`, { status })

export default api