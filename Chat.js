import React, { useState, useRef } from 'react';
import { useFonts } from '@expo-google-fonts/montserrat';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function Chat() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const flatListRef = useRef(null);

  const handlePredict = async () => {
    if (!input.trim()) {
      return;
    }
    console.log('input:', input);
    const newMessage = { input };
    setConversation([...conversation, newMessage]);
    setInput('');
  
    try {
      const response = await fetch('https://8097-122-162-145-166.in.ngrok.io/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ input_text: input }),
      });
      const result = await response.json();
      console.log('result:', result);
      const updatedMessage = { ...newMessage, output: result.response };
      setConversation(prevConversation => {
        const index = prevConversation.length - 1;
        return [
          ...prevConversation.slice(0, index),
          updatedMessage,
          ...prevConversation.slice(index + 1)
        ];
      });
      

      flatListRef.current.scrollToOffset({ offset: 0 });
    } catch {}
  };

  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../frontend/assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../frontend/assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('../frontend/assets/fonts/Montserrat-SemiBold.ttf'),
  });

  const renderItem = ({ item }) => (
    <View style={styles.conversationPair}>
        <Text style={styles.input}>{item.input}</Text>
        <Text style={styles.output}>{item.output}</Text>
    </View>
  )

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image style={styles.title} source={require('../frontend/assets/name.png')} />
      <Image style={styles.user} source={require('../frontend/assets/inputimage.png')} />
      <Image style={styles.bot} source={require('../frontend/assets/outputimage.png')} />
      <FlatList
        ref={flatListRef}
        data={conversation}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
        <View style={styles.inputContainer}>
          <TextInput placeholder='Type your message...' placeholderTextColor={"#5685FF"} value={input} onChangeText={setInput} style={styles.inputbox} />
          <View style={styles.emptybox} />
          <TouchableOpacity onPress={handlePredict} style={styles.sendcontainer}>
            <Image style={styles.send} source={require('../frontend/assets/send.png')} onPress={handlePredict} />
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  title: {
    position: 'absolute',
    top: 45,
    left: 30,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#08082F'
  },
  conversationPair: {
    marginVertical: 10,
  },
  list: {
    position: 'relative',
    top: 160,
    left: 30,
    width: 350,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  inputbox: {
    width: 300,
    height: 50,
    borderRadius: 50,
    bottom: 20,
    left: 20,
    paddingLeft: 25,
    paddingRight: 25,
    color: 'white',
    fontSize: 17,
    fontFamily: 'Montserrat-SemiBold',
  },
  send: {
    position: 'absolute',
    right: 15,
    bottom: 3,
  },
  emptybox: {
    backgroundColor: '#2E2E77',
    position: 'absolute',
    width: 300,
    height: 50,
    borderRadius: 50,
    zIndex: -1,
    bottom: 20,
    left: 20,
  },
  input: {
    color: '#7CA7FF',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    textAlign: 'right',
    paddingRight: 15,
  },
  output: {
    color: '#AD7DD2',
    paddingTop: 15,
    paddingRight: 15, 
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
  },
  sendcontainer: {
    position: 'absolute',
    right: 0,
    bottom: 25,
  },
  user: {
    position: 'absolute',
    width: 55,
    height: 55,
    top: 113,
    left: 322,
    borderRadius: 50,
  },
  bot: {
    position: 'absolute',
    width: 62,
    height: 62,
    top: 110,
    left: 33,
  }
});