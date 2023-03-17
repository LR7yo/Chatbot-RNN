import React, { useState } from 'react';
import { useFonts } from '@expo-google-fonts/montserrat';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import CheckBox from 'react-native-check-box';

export default function About({ navigation }) {
  const [isChecked, setIsChecked] = useState(false);

    const [fontsLoaded] = useFonts({
      'Montserrat-Regular': require('../frontend/assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-Bold': require('../frontend/assets/fonts/Montserrat-Bold.ttf'),
      'Montserrat-SemiBold': require('../frontend/assets/fonts/Montserrat-SemiBold.ttf'),
    });

    if (!fontsLoaded) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Image style={styles.title} source={require('../frontend/assets/name.png')} />
        <Image style={styles.about} source={require('../frontend/assets/about.png')} />
        <Text style={styles.abouttext}>
          The chatbot you will be talking to is an artificial intelligence bot that runs on a Recurrent Neural Network
          model (RNN) which is based on a seq2seq architecture. Through this machine learning model it is able to assess
          and interpret language to execute intent specific messages as responses.
        </Text>
        <Image style={styles.purpose} source={require('../frontend/assets/purpose.png')} />
        <Text style={styles.purposetext}>
          The purpose of this chatbot is not to be used as a primary therapist but instead to be used as an early onset
          remedy to minor workplace mental problems.
        </Text>
        <Image style={styles.limitations} source={require('../frontend/assets/limitations.png')} />
        <Text style={styles.limitationstext}>
          The model won’t be able to analyse all types of complex language combinations so there is a chance that an
          effective resolution wouldn’t be provided. This advisory content isn’t supervised or professional. User
          discretion is advised.
        </Text>

        <CheckBox
          style={styles.checkbox}
          isChecked={isChecked} 
          onClick={() => setIsChecked(!isChecked)}
          checkedCheckBoxColor='green'
          uncheckedCheckBoxColor='red'
        />
        
        <Text style={styles.checkboxtext}>I accept the User Discretion</Text>

        <Pressable
          onPress={() => {
            if (isChecked) {
              navigation.navigate('Chat');
            }
          }}
          style={[styles.button, !isChecked && styles.buttonDisabled]}
          disabled={!isChecked}
        >
          <Text style={styles.buttontext}>Get Started</Text>
        </Pressable>
      </View>
    );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#08082F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    position: 'absolute',
    top: 45,
  },

  about: {
    position: 'absolute',
    top: 140,
  },

  abouttext: {
    width: 345,
    textAlign: 'center',
    position: 'absolute',
    top: 200,
    color: 'white',
    fontFamily: 'Montserrat-Regular'
  },

  purpose: {
    position: 'absolute',
    top: 340,
  },

  purposetext: {
    width: 345,
    textAlign: 'center',
    position: 'absolute',
    top: 395,
    color: 'white',
    fontFamily: 'Montserrat-Regular'
  },

  limitations: {
    position: 'absolute',
    top: 490,
  },

  limitationstext: {
    width: 345,
    textAlign: 'center',
    position: 'absolute',
    top: 550,
    color: 'white',
    fontFamily: 'Montserrat-Regular'
  },

  button: {
    position: 'absolute',
    top: 735,
    width: 284,
    height: 60,
    backgroundColor: '#3D62AE',
    borderRadius: 20
  },

  buttontext: {
    textAlign: 'center',
    top: 7,
    fontSize: 32,
    color: 'white',
    fontFamily: 'Montserrat-SemiBold'
  },
  checkboxcontainer: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
    top: 670,
  },
  checkbox: {
    position: 'absolute',
    top: 670.5,
    left: 75,
  },
  checkboxtext: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    position: 'absolute',
    top: 671,
    left: 113,
  },
});