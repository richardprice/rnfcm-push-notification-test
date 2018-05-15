import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView } from 'react-native';

import firebase from 'react-native-firebase';

import type { Notification } from 'react-native-firebase';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    console.log("Component Mounted");

    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);

    firebase.messaging().getToken().then((token) => {
      console.log("TOKEN RECEIVED: " + token);
    });

    firebase.messaging().onTokenRefresh((token) => {
      console.log("TOKEN REFRESHED: " + token);
    });

    firebase.messaging().onMessage((message) => { 
      console.log("MESSAGE RECEIVED: " + JSON.stringify(message));
      console.log(message.data.message);
      this.setState(previousState => {
        return { messages: [...previousState.messages, message.data.message] };
      });
    });

    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
        } else {
          // user doesn't have permission
          firebase.messaging().requestPermission()
            .then(() => {
              // User has authorised  
            })
            .catch(error => {
              // User has rejected permissions  
            });
        } 
      });
    
    firebase.notifications().onNotification((notification) => {
      // Process your notification as required
      console.log("NOTIFICATION RECEIVED: " + notification.body);
    });

    firebase.notifications().onNotificationDisplayed((notification) => {
      // Process your notification as required
      console.log("NOTIFICATION DISPLAYED: " + notification.body);
    });
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
        <Image source={require('./assets/Mighway.png')} style={[styles.logo]} />
        <Text style={styles.welcome}>
          Welcome to the ABE{'\n'}Push Notification Demo
        </Text>
        { 
          this.state.messages.map((item, key)=>(
            <Text key={key}>{'\n'}{'\n'}{key}. {item}</Text>)
          )
        }
        </View>    
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 80,
    marginBottom: 16,
    marginTop: 32,
    width: 80,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  modules: {
    margin: 20,
  },
  modulesHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  module: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  }
});
