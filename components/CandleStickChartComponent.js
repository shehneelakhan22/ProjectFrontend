import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';

// Screen width for the WebView
const screenWidth = Dimensions.get('window').width;

const CandleStickChartComponent = ({ coin }) => {
  const [loading, setLoading] = useState(false);

  // Function to fetch candlestick data from Flask API
  const fetchCandlestickData = async (symbol) => {
    if (!symbol) return;

    setLoading(true);
    try {
      const url = `http://192.168.100.14:5000/api/candlestick?symbol=${symbol}&limit=100`;
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

  // Fetch data whenever the selected coin changes
  useEffect(() => {
    fetchCandlestickData(coin);
  }, [coin]);

  // TradingView Widget URL
  const tradingViewWidgetUrl = `https://www.tradingview.com/chart/?symbol=BINANCE%3A${coin}USDT`;

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Candlestick Chart for {coin}/USDT</Text> */}

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: 'center',
  },
});

export default CandleStickChartComponent;
