import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { useAuth } from '../context/AuthContext'
import { acceptBooking, getAvailableBookings, getMyBookings, updateBookingStatus } from '../services/api'

const STATUS_COLORS: any = {
  pending: '#f4a261',
  accepted: '#2a9d8f',
  in_progress: '#457b9d',
  completed: '#2d6a4f',
  cancelled: '#e63946'
}

const STATUS_LABELS: any = {
  pending: 'Available',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Delivered',
  cancelled: 'Cancelled'
}

export default function HomeScreen() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'available' | 'myjobs'>('available')
  const [availableBookings, setAvailableBookings] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [availableRes, myJobsRes] = await Promise.all([
        getAvailableBookings(),
        getMyBookings()
      ])
      setAvailableBookings(availableRes.data.bookings)
      setMyBookings(myJobsRes.data.bookings)
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookings')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchData()
  }

  const handleAccept = async (bookingId: string) => {
    Alert.alert(
      'Accept Job',
      'Are you sure you want to accept this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await acceptBooking(bookingId)
              Alert.alert('Success', 'Booking accepted! Check My Jobs tab.')
              fetchData()
              setActiveTab('myjobs')
            } catch (error: any) {
              Alert.alert('Failed', error.response?.data?.error || 'Could not accept booking')
            }
          }
        }
      ]
    )
  }

  const handleUpdateStatus = async (bookingId: string, currentStatus: string) => {
    let newStatus = ''
    let actionLabel = ''

    if (currentStatus === 'accepted') {
      newStatus = 'in_progress'
      actionLabel = 'Start Trip'
    } else if (currentStatus === 'in_progress') {
      newStatus = 'completed'
      actionLabel = 'Mark Delivered'
    } else {
      return
    }

    Alert.alert(
      actionLabel,
      `Are you sure you want to ${actionLabel.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionLabel,
          onPress: async () => {
            try {
              await updateBookingStatus(bookingId, newStatus)
              Alert.alert('Updated', `Booking marked as ${newStatus.replace('_', ' ')}`)
              fetchData()
            } catch (error: any) {
              Alert.alert('Failed', error.response?.data?.error || 'Could not update status')
            }
          }
        }
      ]
    )
  }

  const renderAvailableBooking = ({ item }: any) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={[styles.statusBadge, { backgroundColor: '#f4a261' }]}>
          <Text style={styles.statusText}>Available Job</Text>
        </View>
        <Text style={styles.bookingDate}>
          {new Date(item.created_at).toLocaleDateString('en-IN')}
        </Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeRow}>
          <Text style={styles.routeDot}>🟢</Text>
          <Text style={styles.routeText} numberOfLines={1}>{item.pickup_address}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeRow}>
          <Text style={styles.routeDot}>🔴</Text>
          <Text style={styles.routeText} numberOfLines={1}>{item.drop_address}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Cargo</Text>
          <Text style={styles.detailValue}>{item.cargo_type}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Weight</Text>
          <Text style={styles.detailValue}>{item.cargo_weight_tons} tons</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Truck</Text>
          <Text style={styles.detailValue}>{item.truck_type_needed}</Text>
        </View>
      </View>

      {item.shipper && (
        <View style={styles.shipperInfo}>
          <Text style={styles.shipperText}>
            📦 {item.shipper.full_name} • {item.shipper.phone}
          </Text>
        </View>
      )}

      {item.notes ? (
        <Text style={styles.notes}>📝 {item.notes}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.acceptBtn}
        onPress={() => handleAccept(item.id)}
      >
        <Text style={styles.acceptBtnText}>Accept This Job</Text>
      </TouchableOpacity>
    </View>
  )

  const renderMyBooking = ({ item }: any) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
          <Text style={styles.statusText}>{STATUS_LABELS[item.status]}</Text>
        </View>
        <Text style={styles.bookingDate}>
          {new Date(item.created_at).toLocaleDateString('en-IN')}
        </Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeRow}>
          <Text style={styles.routeDot}>🟢</Text>
          <Text style={styles.routeText} numberOfLines={1}>{item.pickup_address}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeRow}>
          <Text style={styles.routeDot}>🔴</Text>
          <Text style={styles.routeText} numberOfLines={1}>{item.drop_address}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Cargo</Text>
          <Text style={styles.detailValue}>{item.cargo_type}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Weight</Text>
          <Text style={styles.detailValue}>{item.cargo_weight_tons} tons</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Truck</Text>
          <Text style={styles.detailValue}>{item.truck_type_needed}</Text>
        </View>
      </View>

      {item.shipper && (
        <View style={styles.shipperInfo}>
          <Text style={styles.shipperText}>
            📦 Shipper: {item.shipper.full_name} • {item.shipper.phone}
          </Text>
        </View>
      )}

      {(item.status === 'accepted' || item.status === 'in_progress') && (
        <TouchableOpacity
          style={[
            styles.statusBtn,
            item.status === 'in_progress' && styles.statusBtnGreen
          ]}
          onPress={() => handleUpdateStatus(item.id, item.status)}
        >
          <Text style={styles.statusBtnText}>
            {item.status === 'accepted' ? '🚛 Start Trip' : '✅ Mark Delivered'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4a261" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.full_name?.split(' ')[0]} 👋</Text>
          <Text style={styles.subGreeting}>Find your next job</Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            if (typeof window !== 'undefined') {
              await logout()
            } else {
              Alert.alert('Logout', 'Are you sure?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: logout }
              ])
            }
          }}
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.tabActive]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.tabTextActive]}>
            Available ({availableBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'myjobs' && styles.tabActive]}
          onPress={() => setActiveTab('myjobs')}
        >
          <Text style={[styles.tabText, activeTab === 'myjobs' && styles.tabTextActive]}>
            My Jobs ({myBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'available' ? (
        <FlatList
          data={availableBookings}
          keyExtractor={(item: any) => item.id}
          renderItem={renderAvailableBooking}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No jobs available</Text>
              <Text style={styles.emptySubText}>Pull down to refresh</Text>
            </View>
          }
          contentContainerStyle={availableBookings.length === 0 ? styles.emptyContainer : null}
        />
      ) : (
        <FlatList
          data={myBookings}
          keyExtractor={(item: any) => item.id}
          renderItem={renderMyBooking}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No jobs yet</Text>
              <Text style={styles.emptySubText}>Accept a job from the Available tab</Text>
            </View>
          }
          contentContainerStyle={myBookings.length === 0 ? styles.emptyContainer : null}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b2a'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1b2a'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a2d3d',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  subGreeting: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 2
  },
  logoutBtn: {
    backgroundColor: '#f4a261',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },
  logoutText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600'
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1a2d3d',
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8
  },
  tabActive: {
    backgroundColor: '#f4a261'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#adb5bd'
  },
  tabTextActive: {
    color: '#fff'
  },
  bookingCard: {
    backgroundColor: '#1a2d3d',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 16
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  bookingDate: {
    fontSize: 12,
    color: '#6c757d'
  },
  routeContainer: {
    marginBottom: 12
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2
  },
  routeDot: {
    fontSize: 12,
    marginRight: 8
  },
  routeText: {
    fontSize: 14,
    color: '#fff',
    flex: 1
  },
  routeLine: {
    width: 2,
    height: 12,
    backgroundColor: '#2d4a5e',
    marginLeft: 6,
    marginVertical: 2
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0d1b2a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  detailItem: {
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 4
  },
  detailValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600'
  },
  shipperInfo: {
    marginBottom: 12
  },
  shipperText: {
    fontSize: 13,
    color: '#adb5bd'
  },
  notes: {
    fontSize: 13,
    color: '#adb5bd',
    marginBottom: 12,
    fontStyle: 'italic'
  },
  acceptBtn: {
    backgroundColor: '#f4a261',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center'
  },
  acceptBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  statusBtn: {
    backgroundColor: '#457b9d',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center'
  },
  statusBtnGreen: {
    backgroundColor: '#2d6a4f'
  },
  statusBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  emptyContainer: {
    flexGrow: 1
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  emptySubText: {
    fontSize: 14,
    color: '#6c757d'
  }
})