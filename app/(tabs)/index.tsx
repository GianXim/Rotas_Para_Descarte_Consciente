import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// A biblioteca para mapas no Expo agora é a 'expo-maps'
// Se você estiver usando a versão mais recente do Expo, considere usar 'expo-maps'
// Se 'react-native-maps' funciona para você, pode mantê-la.
import MapView from 'react-native-maps';

export default function App() {
    // 1. Crie um estado para armazenar o objeto de localização inteiro. Inicie como null.
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        // Função assíncrona para pedir permissão e obter a localização
        async function requestLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('A permissão para acessar a localização foi negada');
                return;
            }

            // 2. Obtenha a localização e atualize o estado
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        }

        requestLocation();
    }, []); // O array vazio [] garante que isso rode apenas uma vez
    const [activeButton, setActiveButton] = useState('map');

    // 3. Renderize um indicador de carregamento enquanto a localização é buscada
    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#7B2CBF" />
                <Text style={{ color: 'white', marginTop: 10 }}>Obtendo localização...</Text>
            </View>
        );
    }

    // O resto do seu código para os botões permanece o mesmo

    const activeColor = 'gray';
    const inactiveColor = 'gray';

    return (
        <View style={styles.container}>
            {/* 4. Use as coordenadas do estado 'location' no MapView */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.002,
                    longitudeDelta: 0.002,
                }}
            />

            {/* O resto da sua UI (botões, etc.) */}
            <View style={styles.containerBotoes}>
                <TouchableOpacity
                    style={[styles.botaomapa]}
                    onPress={() => setActiveButton('map')}
                >
                    {activeButton === 'map' ? (
                        <LinearGradient
                            colors={['#ffffff', '#c1f5f6']}
                            locations={[0.5, 1]}
                            style={{ width: '50%', height: '60%', borderRadius: 45, alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Ionicons
                                name="map"
                                size={24}
                                color={activeColor}
                            />
                        </LinearGradient>
                    ) : (
                        <Ionicons
                            name="map-outline"
                            size={24}
                            color={inactiveColor}
                        />
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.botaolista]}
                    onPress={() => setActiveButton('list')}
                >
                    {activeButton === 'list' ? (
                        <LinearGradient
                            colors={['#ffffff', '#c1f5f6']}
                            locations={[0.5, 1]}
                            style={{ width: '50%', height: '60%', borderRadius: 45, alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Ionicons
                                name="list"
                                size={24}
                                color={activeColor}
                            />
                        </LinearGradient>
                    ) : (

                        <Ionicons
                            name="list-outline"
                            size={24}
                            color={inactiveColor}
                        />
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.containerpontomapa}>
                <TouchableOpacity>
                    <Ionicons name="locate" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
    container: {
        flex: 1, // Use flex: 1 para garantir que o container ocupe toda a tela
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    containerBotoes: {
        position: 'absolute',
        bottom: 40,
        width: '85%',
        height: 70,
        backgroundColor: 'white',
        borderRadius: 35,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    botaomapa: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',


        borderRadius: 45,
    },
    botaolista: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 45,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    containerpontomapa: {
        bottom: '15%',
        width: '16%',
        height: '8%',
        position: 'absolute',
        right: 40,
        backgroundColor: 'white',
        borderRadius: 80, 
        alignItems: 'center',
        justifyContent: 'center',
    }
});