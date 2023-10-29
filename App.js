import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import Voice from 'react-native-voice';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    Voice.onSpeechPartialResults = (result) => {
      setRecognizedText(result[0]);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    const microphonePermission = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (microphonePermission === RESULTS.GRANTED) {
      try {
        await Voice.start('en-US');
        setIsListening(true);
      } catch (error) {
        console.error(error);
      }
    } else if (microphonePermission === RESULTS.DENIED) {
      const permissionRequestResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      if (permissionRequestResult === RESULTS.GRANTED) {
        startListening();
      }
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title={isListening ? 'Stop Listening' : 'Start Listening'} onPress={isListening ? stopListening : startListening} />
      <Text>Recognized Text: {recognizedText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
