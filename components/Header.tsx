import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '@/constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

interface User {
    firstName: string;
    profilePic: string;
  }
  

const Header = () => {
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
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:Colors.dark }} >
    <View style={{flexDirection:"row", justifyContent:"space-between", height:70, alignItems:"center", paddingHorizontal:20, }}>
        <View>
        {user && <Image source={{uri: user.profilePic}} style={{height:50, width:50, borderRadius:30}} />
        }
        <Text>Wellcome {user?.firstName}</Text>
        </View>

      
      
      <TouchableOpacity onPress={() => {}} style={{borderBlockColor:"#666", borderWidth:1, padding:8, borderRadius:8}}>
        <Text style={{ color:"white", fontSize:12 }}>
            Welcome to EsyGlass!
        </Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({})