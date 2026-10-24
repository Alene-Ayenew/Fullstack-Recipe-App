import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from "@clerk/expo";

import { Redirect, Stack } from 'expo-router';

const AuthRoutesLayout = () => {
    const {isSignedIn}=useAuth();
    if(isSignedIn) return <Redirect href={"/"}/>
  return <Stack screenOptions={{headerShown:false}}/>
}

export default AuthRoutesLayout