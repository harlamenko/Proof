import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function QRScanner(props) {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    props.qrScanned(data);
  };

  const getViewData = () => {
    if (hasPermission === null) {
      return <ActivityIndicator testID="loader" />;
    }

    if (hasPermission === false) {
      return <Text>Нет доступа к камере</Text>;
    }

    return (
      <>
        <Text
          style={{
            fontSize: 22,
            position: 'absolute',
            top: 0,
          }}
        >
          Сканируйте QR-код
        </Text>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {getViewData()}
    </View>
  );
}
