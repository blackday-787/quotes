import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../App';

export default function QuoteScreen({ latestQuote }) {
  const [quote, setQuote] = useState(latestQuote);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, sent: 0, remaining: 0 });

  useEffect(() => {
    checkConnection();
    loadStats();
  }, []);

  useEffect(() => {
    if (latestQuote) {
      setQuote(latestQuote);
    }
  }, [latestQuote]);

  async function checkConnection() {
    try {
      const response = await axios.get(`${API_URL}/health`);
      if (response.data.status === 'ok') {
        setIsConnected(true);
      }
    } catch (error) {
      setIsConnected(false);
    }
  }

  async function loadStats() {
    try {
      const response = await axios.get(`${API_URL}/api/queue/status`);
      setStats({
        total: response.data.totalQuotes,
        sent: response.data.sentThisCycle,
        remaining: response.data.remainingThisCycle,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  async function sendTestNotification() {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Connecting to server...');
      await checkConnection();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/test-notification`);
      if (response.data.success) {
        Alert.alert('Success', 'Check your notifications!');
        // The quote will be updated when notification is received
      } else {
        Alert.alert('Failed', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Make sure you have at least one quote added');
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await checkConnection();
    await loadStats();
    setRefreshing(false);
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Total</Text>
            <Text style={styles.statusValue}>{stats.total}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Sent</Text>
            <Text style={styles.statusValue}>{stats.sent}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Left</Text>
            <Text style={styles.statusValue}>{stats.remaining}</Text>
          </View>
        </View>
      </View>

      <View style={styles.quoteCard}>
        {quote ? (
          <>
            <Text style={styles.quoteLabel}>Latest Quote</Text>
            <Text style={styles.quoteText}>"{quote}"</Text>
          </>
        ) : (
          <>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>No quote yet today</Text>
            <Text style={styles.emptySubtext}>
              You'll receive your daily quote at a random time during your configured window
            </Text>
          </>
        )}
      </View>

      <View style={styles.actionCard}>
        <View style={[styles.badge, isConnected ? styles.badgeSuccess : styles.badgeWarning]}>
          <Text style={styles.badgeText}>
            {isConnected ? '✓ Connected' : '⚠ Not Connected'}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={sendTestNotification}
        >
          <Text style={styles.buttonText}>Send Test Quote Now</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>
          Tap to receive a random quote immediately. This helps you test that notifications are working correctly.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How It Works</Text>
        <Text style={styles.infoText}>
          • One quote sent daily at random time{'\n'}
          • Quotes won't repeat until you've seen them all{'\n'}
          • New quotes added go to the end of the queue{'\n'}
          • Pull down to refresh stats
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
  },
  quoteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    marginBottom: 16,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteLabel: {
    fontSize: 14,
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    fontWeight: '600',
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 32,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  badgeSuccess: {
    backgroundColor: '#d1fae5',
  },
  badgeWarning: {
    backgroundColor: '#fed7aa',
  },
  badgeText: {
    color: '#065f46',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

