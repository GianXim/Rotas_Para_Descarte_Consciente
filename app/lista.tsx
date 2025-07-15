import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function App() {
    return (


        <View style={styles.container}>
            <View style={styles.containerBotoes}>
                <TouchableOpacity style={styles.botaomapa}>
                    <Ionicons name="map" size={24} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaomapa} onPress={() => {}}>
                    <Ionicons  name="list" color={'blue'} size={24}/>
                </TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'green',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    containerBotoes: {
        position: 'relative',
        top: '40%',
        bottom: '1%',
        width: '85%',
        height: '10%',
        backgroundColor: 'white',
        borderRadius: 100,
        alignItems: 'center',
        flexDirection: 'row',

    },
    botaomapa: {
        width: '50%',
        height: '50%',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconemapa: {
        
    },

});