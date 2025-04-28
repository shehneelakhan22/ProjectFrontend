import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { BACKEND_API_URL } from './configUrl';
import { colors } from './constantcolors';


const CandleStickChartComponent = ({ coin }) => {
  const [loading, setLoading] = useState(false);

  // Function to fetch candlestick data from Flask API
  const fetchCandlestickData = async (symbol) => {
    if (!symbol) return;

    setLoading(true);
    try {
      const url = `${BACKEND_API_URL}/api/candlestick?symbol=${symbol}&limit=100`;
      console.log('API URL:', url);

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

  // TradingView Embedded Widget URL (Lightweight)  (No ad)
  const tradingViewWidgetUrl = `https://s.tradingview.com/widgetembed/?symbol=BINANCE%3A${coin}USDT&interval=1&hidesidetoolbar=1&hideideas=1&theme=light&style=1&locale=en&toolbarbg=f1f3f6`;

  // TradingView Widget URL (Containing Ad)
  // const tradingViewWidgetUrl = `https://www.tradingview.com/chart/?symbol=BINANCE%3A${coin}USDT`;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.chartContainer}>
          <WebView
            source={{ uri: tradingViewWidgetUrl }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

// Screen dimensions
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  chartContainer: {
    width: screenWidth,
    height: screenHeight * 0.6,
  },
  webView: {
    width: '100%',
    height: '100%',
  },
});

export default CandleStickChartComponent;
