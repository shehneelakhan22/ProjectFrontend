import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput, FlatList, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { RadioButton } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit'; // Import the charting library
import { Dimensions } from 'react-native';
import axios from 'axios';
import CandleStickChartComponent from './CandleStickChartComponent';
import { BACKEND_API_URL } from './configUrl';

const HomeScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('CryptoSignals');
  const [selectedValue, setSelectedValue] = useState(null);
  const [livePrice, setLivePrice] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [indicatorData, setIndicatorData] = useState({});
  const [isCoinSelected, setIsCoinSelected] = useState(false); // Track if a coin is selected
  const [selectionMessage, setSelectionMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [predictionError, setPredictionError] = useState('');


  const getFormattedDateLabels = () => {
    const today = new Date();
    return predictions.map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return i % 9 === 0 ? date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '';
    });
  };
  
  const fetchPredictions = async (coinSymbol) => {
    const coin = coinSymbol?.toLowerCase();

    if (!coin) {
      setPredictionError('Please select a coin.');
      return;
    }

    setLoading(true);
    setPredictionError('');
    setPredictions([]);

    try {
      const response = await axios.get(`${BACKEND_API_URL}/predict?coin=${coin}`);

      if (response.data && response.data.predicted_prices) {
        setPredictions(response.data.predicted_prices);
        setPredictionError('');
      } else {
        setPredictionError('No prediction data available.');
      }
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setPredictionError(err.response?.data?.error || 'Error fetching predictions.');
    } finally {
      setLoading(false);
    }
  };

  const startBot = () => {
    if (selectedTimeframe && selectedTicker && investmentAmount) {
      console.log(`Bot started with timeframe: ${selectedTimeframe} minutes`);
      // Add logic to start the bot with the selected timeframe
    } else {
      alert('Please select all fields before starting the bot.');
    }
  };
  
  useEffect(() => {
    if (!isCoinSelected) {
      setSelectionMessage(
        <Text>
      Please select a coin.
    </Text>
      );
    } else {
      setSelectionMessage('');
    }
  }, [isCoinSelected]);
  
  
  useEffect(() => {
    let priceInterval;
  
    const fetchPrice = async (coin) => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/get_live_price?coin=${coin}`);
        const data = await response.json();
        if (response.ok) {
          setLivePrice(data.price); // Update livePrice state with fetched price
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };
  
    if (selectedValue) {
      fetchPrice(selectedValue);
      setIsCoinSelected(true); // Mark coin as selected
      priceInterval = setInterval(() => fetchPrice(selectedValue), 5000);
    } else {
      setIsCoinSelected(false); // Mark coin as not selected
    }
  
    return () => clearInterval(priceInterval);
  }, [selectedValue]);
  

  useEffect(() => {
    let indicatorInterval;

    const fetchIndicatorData = async (coin, interval) => {
      try {
        let url = '';
        if (selectedIndicator === 'BollingerBands') {
          url = `${BACKEND_API_URL}/get_bbands?symbol=${coin}/USDT&interval=${interval}`;
        } else if (selectedIndicator === 'RSI') {
          url = `${BACKEND_API_URL}/get_rsi?coin=${coin}&interval=${interval}`;
        }
        if (url) {
          const response = await fetch(url);
          const data = await response.json();
          if (response.ok) {
            console.log('Fetched Indicator Data:', data); // Debug: Log the fetched data
            setIndicatorData(data);
          } else {
            console.error(data.error);
          }
        }
      } catch (error) {
        console.error('Error fetching indicator data:', error);
      }
    };

    if (selectedIndicator && selectedValue) {
      fetchIndicatorData(selectedValue, '1m'); // Initial fetch
      if (selectedIndicator === 'RSI') {
        indicatorInterval = setInterval(() => fetchIndicatorData(selectedValue, '1m'), 1000); // Fetch RSI every second
      } else if (selectedIndicator === 'BollingerBands') {
        indicatorInterval = setInterval(() => fetchIndicatorData(selectedValue, '1m'), 60000); // Fetch Bollinger Bands every minute
      }
    }

    return () => clearInterval(indicatorInterval);
  }, [selectedIndicator, selectedValue]);
  

  const renderContent = () => {
    switch (selectedTab) {
      case 'CryptoSignals':
        return (
          <>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <Text style={styles.StartTradeText}>Start Crypto Trade</Text>
          <View style={styles.CryptoInputContainer}>
          <Text style={styles.labelStyling}>Select Cryptocurrency:</Text>
          <View style={{alignItems:'center'}}>
          <View style={styles.coinsDropDownInCryptoSignals}>
              <RNPickerSelect 
                onValueChange={(value) => setSelectedTicker(value)}
                items={[
                  { label: 'Bitcoin (BTC)', value: 'BTC' },
                  { label: 'Ethereum (ETH)', value: 'ETH' },
                  { label: 'Binance Coin (BNB)', value: 'BNB'},
                ]}
                style={pickerSelectStyles.inputAndroid}
                placeholder={{
                  label: 'Select a coin....',
                  value: null,
                }}
              />
            </View>
            </View>
            </View>

       <View style={styles.TimeframeInputContainer}>    
        <Text style={styles.labelStyling}>Select Timeframe:</Text>
         <View style={{alignItems:'center'}}>
           <RadioButton.Group
                onValueChange={value => {
                  setSelectedTimeframe(value);
                  setError(''); // Clear error when an option is selected
                }}
                value={selectedTimeframe}
              >
                <View style={{flexDirection: 'row', justifyContent:'space-evenly', width:'100%'}}>
                <View style={styles.radioItemContainer}>
                <RadioButton.Item
                  value="1m"
                  status={selectedTimeframe === '1m' ? 'checked' : 'unchecked'}
                  color="#b29705"
                />
                <Text style={styles.radioLabel}>1 minute</Text>
                </View>

                <View style={styles.radioItemContainer}>
                <RadioButton.Item
                  value="5m"
                  status={selectedTimeframe === '5m' ? 'checked' : 'unchecked'}
                  color="#b29705"
                />
                <Text style={styles.radioLabel}>5 minutes</Text>
                </View>

                <View style={styles.radioItemContainer}>
                <RadioButton.Item
                  value="15m"
                  status={selectedTimeframe === '15m' ? 'checked' : 'unchecked'}
                  color="#b29705"
                />
                <Text style={styles.radioLabel}>15 minute</Text>
                </View>
                </View>
              </RadioButton.Group>
              </View>
               </View>
               
         <View style={styles.inputContainer}>
            <Text style={styles.labelStyling}>Add Amount:</Text>
            <View style={styles.InputContainerStyling}>
              <TextInput 
              style={[ 
                styles.textInputinputStyling,
                { color: investmentAmount === '0$' ? 'gray' : 'white' }, // Change text color based on input
                ]}
                keyboardType="numeric"
                placeholder="0$"
                placeholderTextColor="gray"
                value={investmentAmount}
                onChangeText={(text) => {
                  // Remove non-numeric characters except the dollar sign
                let numericValue = text.replace(/[^0-9]/g, '');

                 // Ensure 0 is removed when user starts typing
                 if (numericValue.startsWith('0') && numericValue.length > 1) {
                   numericValue = numericValue.slice(1);
                  }

                // Update state with formatted value
                setInvestmentAmount(numericValue ? `${numericValue}$` : '0$');
              }}
              />
              </View>
               </View>
               <View style={styles.buttonView}>
                <TouchableOpacity style={styles.startButton} onPress={startBot}>
                  <Text style={styles.startButtonText}>Start</Text>
                  </TouchableOpacity>
                   </View>
                   </ScrollView>
          </>
        );
        
        case 'PricePrediction':
          return (
            <View style={styles.predictionContainer}>
              <Text style={styles.titleText}>Crypto Price Prediction</Text>
              <View style={styles.dropDownForPricePrediction}>
                <RNPickerSelect
                  onValueChange={(value) => {
                    setSelectedCoin(value);
                    fetchPredictions(value);
                  }}
                  items={[
                    { label: 'BTC/USDT', value: 'bitcoin' },
                    { label: 'ETH/USDT', value: 'ethereum' },
                    { label: 'BNB/USDT', value: 'binancecoin' },
                  ]}
                  style={{
                      color: 'black',
                      paddingHorizontal: 10
                  }}
                  placeholder={{ label: 'Select a coin', value: null }}
                />
              </View>
    
              {loading && <ActivityIndicator size="large" style={styles.loading} />}
    
              {predictionError ? (
                <Text style={styles.error}>{predictionError}</Text>
              ) : predictions.length > 0 ? (
                <View style={styles.chartContainer}>
                 <LineChart
                 data={{
                  // labels: predictions.map((_, i) => (i % 9 === 0 ? `Day ${i + 1}` : '')),
                  labels: getFormattedDateLabels(),

                  datasets: [
                    {
                      data: predictions, // Predicted price values
                      strokeWidth: 2, // Line thickness
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Line color is black
                      withDots: false,  // Ensures no dots are shown
                      },
                    ],
                  }}
                  width={Dimensions.get('window').width - 10} // Adjust width based on screen
                  height={350} // Set the height of the chart
                  chartConfig={{
                    backgroundColor: '#FFFFFF', // White background for the chart
                    backgroundGradientFrom: '#FFFFFF', // Keep background solid white
                    backgroundGradientTo: '#FFFFFF',
                    decimalPlaces: 2, // Show two decimal places
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Axis and grid line color (black)
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color (black) for both x and y axes
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '0', // This will remove dots from the chart
                    },
                  }}
                  style={{ marginVertical: 8 }}
                  />

                </View>
              ) : (
                <FlatList
                  data={predictions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <Text style={styles.prediction}>Day {index + 1}: ${item}</Text>
                  )}
                />
              )}
            </View>
          );

  case 'LivePrices':
  return (
    <>
      <View style={styles.coinAndIndicatorsSelectionContainer}>
        <View style={styles.coinsDropDown}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedValue(value)}
            items={[
              { label: 'BTC/USDT', value: 'BTC' },
              { label: 'ETH/USDT', value: 'ETH' },
              { label: 'BNB/USDT', value: 'BNB' },
            ]}
            style={pickerSelectStyles.inputAndroid}
            placeholder={{
              label: 'Select a coin',
              value: null,
            }}
          />
        </View>

        {selectedValue && (
          <View style={styles.indicatorsDropDown}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedIndicator(value)}
              items={[
                { label: 'Bollinger Bands', value: 'BollingerBands' },
                { label: 'Relative Strength Index', value: 'RSI' },
              ]}
              style={pickerSelectStyles.inputAndroid}
              placeholder={{
                label: 'Select an indicator...',
                value: null,
                color: 'gray',
              }}
            />
          </View>
        )}
      </View>

      <View style={styles.coinAndIndicatorsDisplayContainer}>
        <View style={styles.pricesTextContainer}>
          {livePrice !== null && (
            <>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
                {selectedValue}/USDT
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.selectedCurrency}>
                  {livePrice.toFixed(2)}
                  <Text style={styles.usdStyle}>USDT</Text>
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={{ marginTop: 14 }}>
          {selectedValue && (
            <>
              {selectedIndicator === 'BollingerBands' && indicatorData.upper_band && (
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.bbandText}>
                    Upper Band: <Text style={styles.bbandValue}>{indicatorData.upper_band.toFixed(2)}</Text>
                  </Text>
                  <Text style={styles.bbandText}>
                    Middle Band: <Text style={styles.bbandValue}>{indicatorData.middle_band.toFixed(2)}</Text>
                  </Text>
                  <Text style={styles.bbandText}>
                    Lower Band: <Text style={styles.bbandValue}>{indicatorData.lower_band.toFixed(2)}</Text>
                  </Text>
                </View>
              )}
              {selectedIndicator === 'RSI' && indicatorData.rsi_value && (
                <View>
                  <Text style={styles.rsiText}>
                    RSI: <Text style={styles.rsiValue}>{indicatorData.rsi_value.toFixed(2)}</Text>
                  </Text>
                </View>
              )}
            </>
          ) }
        </View>
      </View>

      <View style={styles.chartContainer}>
        {selectedValue && <CandleStickChartComponent coin={selectedValue} />}
      </View>
    </>
  );
}
}


  return (

      <View style={styles.container}>
        <View style={styles.header}>
        <Image source={require('../assets/hello_Logo.png')} style={styles.LogoStyling} />
          <Text style={styles.title}>rypto Analyzer</Text>
          <TouchableOpacity style={styles.userIcon} onPress={() => navigation.navigate('Profile')}>
            <Image source={require('../assets/settings4.png')} style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>

        <View style={styles.tabsView}>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('CryptoSignals')}>
          <View style={[styles.tabView, selectedTab === 'CryptoSignals' && styles.activeTab]}>
            <Text style={[styles.tabText, selectedTab === 'CryptoSignals' && styles.selectedTabText]}>
              Crypto Signals
            </Text>
            </View>
          </TouchableOpacity>
          </View>

        <View style={styles.tabsView}>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('PricePrediction')}>
          <View style={[styles.tabView, selectedTab === 'PricePrediction' && styles.activeTab]}>
            <Text style={[styles.tabText, selectedTab === 'PricePrediction' && styles.selectedTabText]}>
              Price Prediction
            </Text>
            </View>
          </TouchableOpacity>
          </View>

          <View style={styles.tabsView}>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('LivePrices')}>
          <View style={[styles.tabView, selectedTab === 'LivePrices' && styles.activeTab]}>
            <Text style={[styles.tabText, selectedTab === 'LivePrices' && styles.selectedTabText]}>
              Live Prices
            </Text>
            </View>
          </TouchableOpacity>
          </View>

        </View>

        <View style={styles.horizontalLine} />
        <View style={styles.contentContainer}>
          {renderContent ? renderContent() : <Text>No Content Available</Text>}
        </View>
      </View>

  );
};  

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    marginTop: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'black',
  },
  radioItemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    // marginVertical: 5,
  },
  radioLabel: {
    color: 'white',
    fontSize: 16,
    marginTop:-11,
    textAlign: 'center',
  },
  radioItem: {
    flexDirection: 'row-reverse',
  },
  scrollViewContainer : {
    flex: 1,
    padding: 20,
  },
  StartTradeText:{
    color:'#b29705',
    fontSize: 30,
    fontWeight:'bold',
    marginTop:-25,
    marginBottom:20,
    textAlign:'center'
  },
  buttonView:{
    marginTop: 20,
    width: 300,
    alignItems:'center'
  },
  startButton: {
    marginTop: 20,
    backgroundColor: '#b29705',
    borderRadius: 50,
    height: 45,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  CryptoInputContainer:{
    height:100
  },
  TimeframeInputContainer:{
    height:128,
  },
  tabView:{
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  header: {
    marginLeft: -8,
    marginTop: -10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#b29705',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: -135
  },
  settingsIcon: {
    marginTop: 20,
    borderRadius: 50,
    width: 35,
    height: 35,
  },
  LogoStyling: {
    marginTop: 20,
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  tabContainer: {
    height:29,
    display:'flex',
    flexDirection: 'row',
    justifyContent:'center',
    marginBottom: 20,
    marginLeft: -12,
    marginRight: -12,
    alignItems:'center',
    backgroundColor:'white',
    borderRadius:40
  },
  tabsView:{
    height:'100%',
    width:'33.5%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  tab: {
    height:'100%',
    width:'100%',
    borderRadius:40,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
  },
  tabText: {
    color: 'black',
    fontSize: 12,
    textAlign:'center'

  },
  selectedTabText: {
    fontWeight: 'bold',
    color: 'white',
    width:'100%',
    borderRadius:40,
  },
  tabView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  activeTab: {
    backgroundColor: '#b29705',
    borderRadius:40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyling:{
    color:'white',
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  coinsDropDownInCryptoSignals:{
    height: 34,
    width: 200,
    backgroundColor: 'white',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth:0.5,
    
  },
  InputContainerStyling: {
    alignItems:'center', 
    borderRadius:0.5, 
    borderWidth:3, 
    borderColor: 'gray',
    width: 280,
    borderRadius: 10,
  },
  textInputinputStyling:{
    height: 40,
    width: 280,
    borderRadius: 10,
    borderWidth:0,
    paddingLeft:10,
  },
  horizontalLine: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginLeft: -20,
    marginRight: -20,
    marginTop: -9,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 18,
  },
  pricesTextContainer: {
    marginTop: -4,
    marginBottom: 20,
    // width: '120%',
    height: 57,
    borderRadius: 10,
  },
  selectedCurrency: {
    color: '#00FF00',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: -4,
  },
 
  displayCurrentPrice: {
    marginLeft: 10,
    color: '#00FF00',
    fontSize: 25,
    fontWeight: 'bold',
  },
  usdStyle: {
    color:'gray',
    fontSize: 18,
    fontWeight: '400',
    fontStyle:'italic',
  },
  coinAndIndicatorsSelectionContainer: {
    width:380,
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  coinsDropDown: {
    height: 40,
    width: 180,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
  },
  indicatorsDropDown: {
    height: 40,
    width: 180,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
  },
  coinAndIndicatorsDisplayContainer:{
    width:380,
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  chartContainer: {
    marginTop: 10,
    height: 420,
    // height:280,
    width: '121%',
  },
  bbandText: {
    fontSize: 14,
    color: 'white'
  },
  bbandValue: {
    color: '#00FF00',
    fontWeight:'bold'
  },
  rsiText: {
    fontSize: 14,
    color:'white'
  },
  rsiValue: {
    fontSize: 17,
    color:'#00FF00',
    fontWeight:'bold'
  },
  selectedTimeTextStyle:{
    fontSize:18,
    color:'white',
    fontWeight:'500'
  },
  selectedTimeStyle:{
     fontSize:18,
     color:'green',
     fontWeight:'bold'
  },
  countdownStyle: {
    fontSize: 33,
    marginTop: 3,
    alignSelf:'center',
    color: '#e53935',
    fontWeight: 'bold',
  },
  selectionMessage: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 20,
  },
  alertsContainer: {
    padding: 20,
  },
  alertItem: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
  },
  alertText: {
    fontSize: 16,
    color: '#721c24',
  },
  noAlertsText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
  }, 
  alertContainer: {
    width: 600,
    marginTop: -10,
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  alertMessage:{
    fontSize: 16,
    fontWeight:'bold',
    color:'#2e2d2b'
  }, 

  predictionContainer: {
    padding: 20,
    alignItems:'center',
    // backgroundColor:'pink',
  },
  titleText: {
    color:'#b29705',
    fontWeight:'bold',
    fontSize: 26,
    marginBottom: 15,
    marginTop: -20
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  loading: {
    marginTop: 20,
  },
  prediction: {
    marginTop: 5,
    color:'green'
  },
  dropDownForPricePrediction: {
    height: 40,
    width: 180,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default HomeScreen;
