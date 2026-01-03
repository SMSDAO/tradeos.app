import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar'

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>📱 TradeOS Mobile</Text>
        <Text style={styles.subtitle}>
          Production-ready Expo app with Supabase
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔐 Authentication</Text>
        <Text style={styles.cardText}>
          Connect to Supabase for email and OAuth login
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚡ Realtime Sync</Text>
        <Text style={styles.cardText}>
          Subscribe to database changes with Supabase Realtime
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💬 Chat Module</Text>
        <Text style={styles.cardText}>
          Send and receive messages with file attachments
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Projects & Tasks</Text>
        <Text style={styles.cardText}>
          Manage projects and tasks with real-time updates
        </Text>
      </View>

      <View style={styles.warning}>
        <Text style={styles.warningTitle}>🔒 Security Notice</Text>
        <Text style={styles.warningText}>
          Configure .env.local with your Supabase credentials
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 24,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  warning: {
    backgroundColor: '#FEF3C7',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#78350F',
  },
})
