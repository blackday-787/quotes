import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../App';

export default function AddQuoteScreen() {
  const [quote, setQuote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charCount = quote.length;
  const maxChars = 178;
  const isOverLimit = charCount > maxChars;
  const isWarning = charCount > 160 && charCount <= maxChars;

  async function handleSubmit() {
    if (!quote.trim()) {
      Alert.alert('Error', 'Please enter a quote');
      return;
    }

    if (isOverLimit) {
      Alert.alert('Too Long', 'Quote must be 178 characters or less for iOS notifications');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/api/quotes`, {
        text: quote.trim()
      });

      if (response.data.id) {
        Alert.alert('Success', 'Quote added successfully!');
        setQuote('');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add quote. Make sure the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function getCharCountColor() {
    if (isOverLimit) return '#ef4444';
    if (isWarning) return '#f59e0b';
    return '#666';
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Add a New Quote</Text>
          <Text style={styles.subtitle}>
            Your quote will be added to the end of the queue
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={quote}
              onChangeText={setQuote}
              placeholder="Enter your inspiring quote here..."
              multiline
              numberOfLines={6}
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, { color: getCharCountColor() }]}>
              {charCount} / {maxChars} characters
            </Text>
            {isWarning && (
              <Text style={styles.warningText}>
                ⚠ Getting close to the limit
              </Text>
            )}
            {isOverLimit && (
              <Text style={styles.errorText}>
                ❌ Too long! Must be {maxChars} characters or less
              </Text>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting || isOverLimit}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Adding...' : 'Add Quote'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <Text style={styles.tipsText}>
            • Keep it short and impactful{'\n'}
            • iOS shows ~178 characters max{'\n'}
            • New quotes go to end of queue{'\n'}
            • You'll see it when its turn comes{'\n'}
            • Manage all quotes via web interface
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Manage Your Quotes</Text>
          <Text style={styles.infoText}>
            To view, edit, or delete quotes, visit the web interface:
          </Text>
          <Text style={styles.urlText}>{API_URL}</Text>
          <Text style={styles.infoSubtext}>
            The web interface shows all your quotes, queue status, and settings.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 150,
    color: '#333',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#f59e0b',
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    textAlign: 'right',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 22,
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
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 8,
  },
  urlText: {
    fontSize: 12,
    color: '#667eea',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
  },
});

