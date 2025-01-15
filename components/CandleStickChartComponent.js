import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { WebView } from 'react-native-webview';

// Screen width for the WebView
const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [cryptoSymbol, setCryptoSymbol] = useState('BTCUSDT');
  const [loading, setLoading] = useState(false);

  // Function to fetch candlestick data from Flask API
  const fetchCandlestickData = async (symbol) => {
    setLoading(true);
    try {
      const url = `http://192.168.100.14:5000/api/candlestick?symbol=${symbol.split('USDT')[0]}&limit=100`;
      console.log("API URL:", url); // Log the API URL to confirm it's correct
  
      const response = await axios.get(url);
      const data = response.data;
  
      if (data && data.candle_data) {
        console.log('Candlestick Data:', data.candle_data);
      } else {
        console.error('Error: No candle data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data whenever the crypto symbol changes
  useEffect(() => {
    fetchCandlestickData(cryptoSymbol);
  }, [cryptoSymbol]);

  // TradingView Widget URL (Optional)
  const tradingViewWidgetUrl = `https://www.tradingview.com/chart/?symbol=BINANCE%3A${cryptoSymbol}`;

  return (
    <ScrollView style={styles.container}>
      <RNPickerSelect
        selectedValue={cryptoSymbol}
        onValueChange={(itemValue) => setCryptoSymbol(itemValue)}
        items={[
          { label: 'Bitcoin (BTC)', value: 'BTCUSDT' },
          { label: 'Ethereum (ETH)', value: 'ETHUSDT' },
          { label: 'Binance Coin (BNB)', value: 'BNBUSDT' },
          { label: 'Solana (SOL)', value: 'SOLUSDT' },
          // Add more cryptocurrencies as needed
        ]}
        style={{
          inputIOS: {
            height: 50,
            width: '100%',
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            color: 'black',
            paddingRight: 30, // to make space for the icon
          },
          inputAndroid: {
            height: 50,
            width: '100%',
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            color: 'black',
            paddingRight: 30, // to make space for the icon
          },
        }}
      />

      <Button title="Fetch Data" onPress={() => fetchCandlestickData(cryptoSymbol)} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.chartContainer}>
          {/* Use WebView to embed TradingView's candlestick chart */}
          <WebView
            source={{ uri: tradingViewWidgetUrl }}
            style={{ height: 1000, width: screenWidth - 10 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scrollEnabled={true}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
