import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { collectionGroup, DocumentData, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Interface para o formato de dados que o NOSSO APP usa
export interface Point {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image: string;
  wasteTypes: string[];
}

// Interface para o formato de dados COMO ELE VEM DO FIREBASE
// Agora usamos 'any' para flexibilidade com os nomes dos campos
interface FirestorePointData {
  nome: string;
  localização: any; // MUDANÇA: Agora é 'any' para aceitar o objeto GeoPoint
  responsavel?: any;
  description?: string;
  image?: string;
  Imagem?: string; // Adicionado para cobrir a variação do nome
  wasteTypes?: string[];
}

export default function App(): React.JSX.Element {
  // Estados com tipagem explícita do TypeScript
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapViewRef = useRef<MapView>(null);
  const [activeButton, setActiveButton] = useState<'map' | 'list'>('map');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [collectionPoints, setCollectionPoints] = useState<Point[]>([]);
  const [isLoadingPoints, setIsLoadingPoints] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPoints, setFilteredPoints] = useState<Point[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  useEffect(() => {
    const fetchCollectionPoints = async () => {
      try {
        const querySnapshot = await getDocs(collectionGroup(db, 'pontos'));

        const pointsData: Point[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>): Point => {
          const data = doc.data() as FirestorePointData;

          let latitude = 0;
          let longitude = 0;

          // --- INÍCIO DA CORREÇÃO DEFINITIVA ---
          // 1. Usamos o nome correto do campo: "localização" (com ç e ã)
          // 2. Verificamos se o campo existe e se é um objeto com latitude e longitude
          if (data.localização && typeof data.localização.latitude === 'number' && typeof data.localização.longitude === 'number') {
            // 3. Pegamos os valores diretamente do objeto GeoPoint!
            latitude = data.localização.latitude;
            longitude = data.localização.longitude;
          }
          // --- FIM DA CORREÇÃO DEFINITIVA ---

          // Bônus: Corrigindo a formatação da descrição
          let descriptionText = data.description || 'Sem descrição.';
          if (data.responsavel) {
             // Se for uma string, use-a. Se for um objeto de referência, mostre o caminho.
            if (typeof data.responsavel === 'string') {
              descriptionText = `Responsável: ${data.responsavel}`;
            } else if (data.responsavel.referencePath) {
              descriptionText = `Responsável: ${data.responsavel.referencePath}`;
            }
          }
          
          return {
            id: doc.id,
            name: data.nome || 'Nome não informado',
            latitude: latitude,
            longitude: longitude,
            description: descriptionText,
            // Bônus: Aceita tanto "image" quanto "Imagem" como nome do campo
            image: data.image || data.Imagem || 'https://images.unsplash.com/photo-1582408921715-18e7806367c2?q=80&w=2070&auto=format&fit=crop',
            wasteTypes: data.wasteTypes || ['Lixo Eletrônico'],
          };
        });

        setCollectionPoints(pointsData);
      } catch (error) {
        console.error('Erro ao buscar pontos de coleta: ', error);
        setErrorMsg('Não foi possível carregar os pontos de coleta.');
      } finally {
        setIsLoadingPoints(false);
      }
    };

    fetchCollectionPoints();
  }, []);

  // O restante do código permanece o mesmo
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    const startWatching = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('A permissão para acessar a localização foi negada');
        return;
      }
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
        newLocation => {
          setLocation(newLocation);
        },
      );
    };
    startWatching();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (isSearchFocused && searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      const results = collectionPoints.filter(
        (point: Point) =>
          point.name.toLowerCase().includes(lowercasedQuery) ||
          point.description.toLowerCase().includes(lowercasedQuery) ||
          point.wasteTypes.some((type: string) => type.toLowerCase().includes(lowercasedQuery)),
      );
      setFilteredPoints(results);
    } else {
      setFilteredPoints([]);
    }
  }, [searchQuery, isSearchFocused, collectionPoints]);

  const handleShowRoute = (destination: Point): void => {
    if (!location) {
      Alert.alert('Erro', 'Não foi possível obter sua localização atual.');
      return;
    }

    Keyboard.dismiss();
    setSearchQuery('');
    setIsSearchFocused(false);
    setModalVisible(false);

    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    const dest = `${destination.latitude},${destination.longitude}`;
    const url = ``;

    Linking.openURL(url).catch(err => {
      console.error('Não foi possível abrir o mapa', err);
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.');
    });
  };

  const recentralizarMapa = (): void => {
    if (location && mapViewRef.current) {
      mapViewRef.current.animateCamera(
        {
          center: { latitude: location.coords.latitude, longitude: location.coords.longitude },
          zoom: 17,
        },
        { duration: 1200 },
      );
    }
  };

  const handleMapPress = (): void => {
    if (isSearchFocused) {
      Keyboard.dismiss();
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.textInfo}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location || isLoadingPoints) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B2CBF" />
        <Text style={styles.textInfo}>{isLoadingPoints ? 'Carregando pontos de coleta...' : 'Aguardando sinal de GPS...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={location.coords}>
          <Ionicons name="location" size={32} color="#7B2CBF" />
        </Marker>
        {collectionPoints.map((point: Point) => (
          // Apenas renderiza o marcador se a latitude não for 0
          point.latitude !== 0 && (
            <Marker
              key={point.id}
              coordinate={{ latitude: point.latitude, longitude: point.longitude }}
              title={point.name}
              description={point.description}
            >
              <Ionicons name="pin" size={30} color="#1E90FF" />
            </Marker>
          )
        ))}
      </MapView>

      <View style={styles.containerBotoes}>
        <TouchableOpacity style={styles.botaoAba} onPress={() => { setActiveButton('map'); setModalVisible(false); }}>
          {activeButton === 'map' ? (
            <LinearGradient colors={['#ffffff', '#c1f5f6']} locations={[0.5, 1]} style={styles.gradient}>
              <Ionicons name="map" size={24} color="gray" />
            </LinearGradient>
          ) : (
            <Ionicons name="map-outline" size={24} color="gray" />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoAba} onPress={() => { setModalVisible(true); setActiveButton('list'); }}>
          {activeButton === 'list' ? (
            <LinearGradient colors={['#ffffff', '#c1f5f6']} locations={[0.5, 1]} style={styles.gradient}>
              <Ionicons name="list" size={24} color="gray" />
            </LinearGradient>
          ) : (
            <Ionicons name="list-outline" size={24} color="gray" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={recentralizarMapa} style={styles.botaoLocalizacao}>
        <Ionicons name="locate" size={24} color="gray" />
      </TouchableOpacity>

      <TextInput
        style={styles.textInputPesquisa}
        placeholder="Pesquisar ponto de coleta..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setIsSearchFocused(true)}
      />

      {isSearchFocused && searchQuery.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredPoints.length > 0 ? (
              filteredPoints.map((point: Point) => (
                <TouchableOpacity key={point.id} style={styles.resultCard} onPress={() => handleShowRoute(point)}>
                  <Text style={styles.resultCardTitle}>{point.name}</Text>
                  <Text style={styles.resultCardDescription}>{point.description}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noResultsText}>Nenhum ponto encontrado.</Text>
            )}
          </ScrollView>
        </View>
      )}

      <View style={styles.botaomenuWrapper}>
        <TouchableOpacity style={styles.botaomenuContent}>
          <Ionicons name="menu" size={24} color="grey" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setActiveButton('map');
        }}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => { setModalVisible(false); setActiveButton('map'); }}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pontos próximos</Text>
            <ScrollView contentContainerStyle={{ paddingVertical: 10, width: '100%' }}>
              {collectionPoints.map((point: Point) => (
                <TouchableOpacity key={point.id} style={styles.locationCard} onPress={() => handleShowRoute(point)}>
                  <Image source={{ uri: point.image }} style={styles.cardImage} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{point.name}</Text>
                    <Text style={styles.cardDescription}>{point.description}</Text>
                    <View style={styles.wasteTypesContainer}>
                      {point.wasteTypes.map((type: string) => (
                        <View key={type} style={styles.wasteTypeBadge}>
                          <Text style={styles.wasteTypeText}>{type}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// Os estilos permanecem os mesmos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  textInfo: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  containerBotoes: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '10%',
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  botaoAba: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    width: '50%',
    height: '60%',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoLocalizacao: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  textInputPesquisa: {
    position: 'absolute',
    top: '5%',
    width: '80%',
    height: '6%',
    right: '2%',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    paddingLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  botaomenuWrapper: {
    position: 'absolute',
    width: '16%',
    height: '6%',
    top: '5%',
    left: '1%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderRadius: 15,
  },
  botaomenuContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '100%',
    height: '80%',
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  locationCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: 'center',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardInfo: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  wasteTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  wasteTypeBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  wasteTypeText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },

  searchResultsContainer: {
    position: 'absolute',
    top: '12%',
    left: '5%',
    right: '5%',
    maxHeight: '45%',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  resultCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultCardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  noResultsText: {
    padding: 15,
    textAlign: 'center',
    color: '#666',
  },
});
