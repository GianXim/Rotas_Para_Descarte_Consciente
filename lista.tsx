// lista.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './app/(tabs)/App';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

export default function ListScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tela de Lista</Text>
            
            <View style={styles.containerBotoes}>
                <TouchableOpacity style={styles.botaoNav} onPress={() => navigation.navigate('Map')}>
                    <Ionicons name="map-outline" size={24} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoNav}>
                    <Ionicons name="list" color={'#007AFF'} size={24}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        top: 100,
    },
    containerBotoes: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 80,
        backgroundColor: 'white',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    botaoNav: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});