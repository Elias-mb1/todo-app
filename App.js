import * as React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, FlatList, TouchableOpacity, Button, TextInput, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [todos, setTodos] = useState([
    { id: '1', title: 'Todo 1', done: false },
    { id: '2', title: 'Todo 2', done: false },
  ]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Detail', {
          item,
          updateTodo: (updatedItem) => {
            setTodos((prevTodos) =>
              prevTodos.map((todo) =>
                todo.id === updatedItem.id ? updatedItem : todo
              )
            );
          },
          deleteTodo: (id) => {
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
          },
        })
      }
    >
      <Text style={styles.item}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Add', { addTodo: (newTodo) => setTodos([...todos, newTodo]) })}
      >
        <Text style={styles.addButtonText}>Add Todo</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailScreen({ route, navigation }) {
  const { item, updateTodo, deleteTodo } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.item}>Title: {item.title}</Text>
      <Button
        title={item.done ? "Mark as Undone" : "Mark as Done"}
        onPress={() => {
          const updatedItem = { ...item, done: !item.done };
          updateTodo(updatedItem);
          navigation.goBack();
        }}
      />
      <Button
        title="Delete"
        onPress={() => {
          deleteTodo(item.id);
          navigation.goBack();
        }}
      />
    </View>
  );
}

function AddScreen({ route, navigation }) {
  const [title, setTitle] = useState('');
  const { addTodo } = route.params;

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Todo Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Button
        title="Add Todo"
        onPress={() => {
          const newTodo = { id: Date.now().toString(), title, done: false };
          addTodo(newTodo);
          navigation.goBack();
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Add" component={AddScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    padding: 20,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
  },
  input: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
  },
  addButton: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'purple',
  },
});
