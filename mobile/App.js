import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import QuoteScreen from './screens/QuoteScreen';
import AddQuoteScreen from './screens/AddQuoteScreen';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// IMPORTANT: Update this with your Render deployment URL after deployment
export const API_URL = 'https://quotes-07du.onrender.com';

const Tab = createBottomTabNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [latestQuote, setLatestQuote] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigationRef = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        registerPushToken(token);
      }
    });

    // Listen for notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setLatestQuote(notification.request.content.body);
    });

    // When notification is tapped, navigate to quote screen
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const quote = response.notification.request.content.body;
      setLatestQuote(quote);
      navigationRef.current?.navigate('Quote');
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId || 'your-project-id'
      })).data;
    }

    return token;
  }

  async function registerPushToken(token) {
    try {
      const axios = require('axios');
      await axios.post(`${API_URL}/api/push-token`, { token });
      console.log('Push token registered successfully');
    } catch (error) {
      console.error('Failed to register push token:', error.message);
    }
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#667eea',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              paddingTop: 5,
              paddingBottom: 5,
              height: 60,
            },
            headerStyle: {
              backgroundColor: '#667eea',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
          }}
        >
          <Tab.Screen 
            name="Quote" 
            options={{
              tabBarLabel: 'Today\'s Quote',
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 24, color }}>💬</Text>
              ),
              title: 'Daily Quote',
            }}
          >
            {props => <QuoteScreen {...props} latestQuote={latestQuote} />}
          </Tab.Screen>
          <Tab.Screen 
            name="Add" 
            component={AddQuoteScreen}
            options={{
              tabBarLabel: 'Add Quote',
              tabBarIcon: ({ color }) => (
                <Text style={{ fontSize: 24, color }}>➕</Text>
              ),
              title: 'Add New Quote',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

