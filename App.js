import { BarCodeScanner } from 'expo-barcode-scanner';

import { StatusBar } from 'expo-status-bar';

import { useEffect, useState } from 'react';

import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Audio } from 'expo-av';

import songNotification from '././assets/audio/notification.wav';

export default function App() {
  const [hasPermission, SetHasPermission] = useState(false);
  const [scanData, setScanData] = useState(null);

  const [sound, setSound] = useState();
  const soundObj = new Audio.Sound();

  useEffect(() => {
    (async () => { //cria o metodo e já faz a chamada do mesmo
      await Audio.requestPermissionsAsync();
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      SetHasPermission(status === "granted"); //permissão liberada
    
      setSound(soundObj);
      
    })();
  }, []);

  if(!hasPermission) {
    return(
      <View style={styles.container}>
        <Text>Para usar o leitor QRCODE aceite a permissão da Camera.</Text>
      </View>  
    );
  }

  const audioOff = async () => {
    await sound.unloadAsync();
  }

  const scannerCode = async ({type, data}) => { //quando escaneado recebe os valores por desestruturação o type e o data
   setScanData(data);
   console.log(`Data: ${data}`);
   console.log(`Type: ${type}`);

   try {
    await sound.loadAsync(songNotification);
    await sound.playAsync();
   } catch (err) {
     console.log(err);
   }

   Alert.alert("Resultado do Codigo escaneado:", `Data: ${data} -  Type: ${type}`,[
     {
      text: "Ok",
      onPress: async () => {
        console.log("Neste ponto pode fazer alguma tratativa");
        console.log("para fechar o LEITOR, ou outra ação com o codigo escaneado"); 
             
        await audioOff();
      }, 
     }
   ]);
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner 
       style={StyleSheet.absoluteFillObject}
       onBarCodeScanned={scanData ? undefined : scannerCode}
      />
      { scanData && 
      <TouchableOpacity style={styles.buttonAddTasksNeon} onPress={() => setScanData(undefined)}>
        <Text style={styles.textForm}>Escanear</Text>
      </TouchableOpacity> }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAddTasksNeon: { //largo
    width: "90%",
    height: 60,
    borderWidth: 3,
    borderColor: '#0EFFF7',
    backgroundColor: '#100F12',
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#0EFFF7',
    borderRadius: 12,
    alignItems:'center',
    position:"absolute",
    bottom: 60,
  },
  textForm: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: '700',
  }
});
