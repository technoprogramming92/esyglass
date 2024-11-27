import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack, useRouter } from 'expo-router';
import Header from '@/components/Header';

interface User {
    firstName: string;
    profilePic: string;
  }

const Page: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadUserData = async () => {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
              setUser(JSON.parse(userData));
            } 
        }
        loadUserData();
    }, [])

    const options = [
        { id: 1, title: 'Production Entry', icon: 'barcode', route: 'piRegister' }, // FontAwesome icon
        { id: 2, title: 'PI Register', icon: 'th-list', route: 'piRegister' }, // FontAwesome icon
        { id: 3, title: 'Invoice Register', icon: 'edit', route: 'invoiceRegister' }, // FontAwesome icon
        { id: 4, title: 'Production Register [TUF]', icon: 'dropbox', route: 'productionRegister' }, // FontAwesome icon
        { id: 5, title: 'Finish Goods Register', icon: 'archive', route: 'finishGoodsRegister' }, // FontAwesome icon
        { id: 6, title: 'Stock Register [Glass Type wise]', icon: 'cubes', route: 'stockRegisterGlassType' }, // FontAwesome icon
        { id: 7, title: 'Stock Register [Glass name-wise]', icon: 'codepen', route: 'stockRegisterGlassName' }, // FontAwesome icon
        { id: 8, title: 'Outstanding', icon: 'rupee', route: 'outStandingPgae' }, // FontAwesome icon
        { id: 9, title: 'Order Status', icon: 'calendar-check-o', route: 'orderStatusPage' }, // FontAwesome icon
      ];

  return (
   
    
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{
      header: () => <Header />
      }}/>
      
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search For..." />
      </View>
      <View style={styles.gridContainer}>
        {options.map(option => (
            <TouchableOpacity key={option.id} style={styles.card} onPress={() => router.push(option.route)}>
            {/* Render different icons based on the icon property */}
            <FontAwesome name={option.icon} size={40} color="#4F8EF7" /> 
            <Text style={styles.cardText}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#f3f4f6',
      alignItems: 'center',
      paddingTop: 20,
    },
    header: {
        width: '100%',
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 20,
        position: 'relative',
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 10,
      },
      userName: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
      },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    subtitle: {
      fontSize: 16,
      color: '#e0e0e0',
    },
    searchContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 25,
      padding: 10,
      alignItems: 'center',
      marginVertical: 20,
      width: '90%',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    searchIcon: {
      marginHorizontal: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    card: {
      backgroundColor: '#e0e7ff',
      width: '40%',
      padding: 20,
      borderRadius: 15,
      alignItems: 'center',
      margin: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    cardText: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#333',
    },
  });
export default Page;
