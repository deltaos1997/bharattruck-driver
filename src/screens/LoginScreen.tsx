import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      await login(email.trim())
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.error || 'Something went wrong. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>

        <View style={styles.logoArea}>
          <Text style={styles.logo}>🚛</Text>
          <Text style={styles.appName}>BharatTruck</Text>
          <Text style={styles.tagline}>Driver Portal</Text>
          <View style={styles.driverBadge}>
            <Text style={styles.driverBadgeText}>FOR DRIVERS</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerText}>
              New driver?{' '}
              <Text style={styles.registerTextBold}>Register here</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b2a'
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 48
  },
  logo: {
    fontSize: 64,
    marginBottom: 12
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  tagline: {
    fontSize: 16,
    color: '#adb5bd',
    marginBottom: 12
  },
  driverBadge: {
    backgroundColor: '#f4a261',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20
  },
  driverBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  form: {
    backgroundColor: '#1a2d3d',
    borderRadius: 16,
    padding: 24
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#2d4a5e',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    backgroundColor: '#0d1b2a'
  },
  button: {
    backgroundColor: '#f4a261',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16
  },
  buttonDisabled: {
    backgroundColor: '#6c757d'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  registerLink: {
    alignItems: 'center'
  },
  registerText: {
    fontSize: 14,
    color: '#adb5bd'
  },
  registerTextBold: {
    color: '#f4a261',
    fontWeight: '600'
  }
})