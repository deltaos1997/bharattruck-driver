import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { useAuth } from '../context/AuthContext'

const TRUCK_TYPES = [
  'Mini Truck',
  'Light Truck',
  'Medium Truck',
  'Heavy Truck',
  'Trailer'
]

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [truckType, setTruckType] = useState('')
  const [truckNumber, setTruckNumber] = useState('')
  const [truckCapacity, setTruckCapacity] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || 
        !password.trim() || !truckType || !truckNumber.trim() || 
        !truckCapacity.trim() || !licenseNumber.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10 digit phone number')
      return
    }

    setIsLoading(true)
    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
        role: 'driver'
      })
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
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
      <ScrollView contentContainerStyle={styles.inner}>

        <View style={styles.header}>
          <Text style={styles.title}>Driver Registration</Text>
          <Text style={styles.subtitle}>Join BharatTruck as a Driver</Text>
        </View>

        <View style={styles.form}>

          <Text style={styles.sectionTitle}>Personal Details</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#6c757d"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#6c757d"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="10 digit mobile number"
            placeholderTextColor="#6c757d"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#6c757d"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.sectionTitle}>Truck Details</Text>

          <Text style={styles.label}>Truck Type</Text>
          <View style={styles.optionsGrid}>
            {TRUCK_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionBtn,
                  truckType === type && styles.optionBtnSelected
                ]}
                onPress={() => setTruckType(type)}
              >
                <Text style={[
                  styles.optionText,
                  truckType === type && styles.optionTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Truck Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. MH 12 AB 1234"
            placeholderTextColor="#6c757d"
            value={truckNumber}
            onChangeText={setTruckNumber}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Truck Capacity (tons)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 5"
            placeholderTextColor="#6c757d"
            value={truckCapacity}
            onChangeText={setTruckCapacity}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Driving License Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter license number"
            placeholderTextColor="#6c757d"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            autoCapitalize="characters"
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Driver Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Login here</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b2a'
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40
  },
  header: {
    marginBottom: 32,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#adb5bd'
  },
  form: {
    backgroundColor: '#1a2d3d',
    borderRadius: 16,
    padding: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f4a261',
    marginBottom: 16,
    marginTop: 8
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: '#2d4a5e',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#0d1b2a'
  },
  optionBtnSelected: {
    borderColor: '#f4a261',
    backgroundColor: '#f4a261'
  },
  optionText: {
    fontSize: 13,
    color: '#adb5bd'
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600'
  },
  button: {
    backgroundColor: '#f4a261',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8
  },
  buttonDisabled: {
    backgroundColor: '#6c757d'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loginLink: {
    alignItems: 'center'
  },
  loginText: {
    fontSize: 14,
    color: '#adb5bd'
  },
  loginTextBold: {
    color: '#f4a261',
    fontWeight: '600'
  }
})