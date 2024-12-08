import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import socket from '@/api/controllers/SocketController'; // Asegúrate de que la ruta sea correcta
import { User } from '@/types/User';

interface ChatProps {
  user1: User;
  user2: User;
}

interface Message {
  content: string;
  userId: string;
  timestamp: string;
}

const Chat = ({ user1, user2 }: ChatProps) => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const roomId = `${user1._id}-${user2._id}`;

  useEffect(() => {
    socket.emit('joinRoom', { roomId: roomId, participants: [user1._id, user2._id] });

    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.emit('leaveRoom', { roomId });
    };
  }, [roomId]);

  const sendMessage = () => {
    const newMessage = {
      content: message,
      userId: user1._id,
      timestamp: new Date().toISOString(),  
    };

    socket.emit('sendMessage', { roomId: roomId, message: newMessage });
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.sender}>{user1.firstName}</Text>
            <Text style={styles.message}>{item.content}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  sender: {
    fontWeight: 'bold',
  },
  message: {
    marginTop: 5,
  },
  timestamp: {
    marginTop: 5,
    fontSize: 10,
    color: 'gray',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Chat;