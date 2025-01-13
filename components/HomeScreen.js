import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RNPickerSelect from 'react-native-picker-select';
import CandleStickChartComponent from './CandleStickChartComponent';
import { BACKEND_API_URL } from './configUrl';

const HomeScreen = ({ navigation, route }) => {
  const [selectedTab, setSelectedTab] = useState('LivePrices');
  const [selectedValue, setSelectedValue] = useState(null);
  const [livePrice, setLivePrice] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [indicatorData, setIndicatorData] = useState({});
  const [selectedTime, setSelectedTime] = useState(false);
  const [countdown, setCountdown] = useState('00:00'); // State for countdown in HH:MM format
  const [isCoinSelected, setIsCoinSelected] = useState(false); // Track if a coin is selected
  const [selectionMessage, setSelectionMessage] = useState('');
  const [error, setError] = useState('');
  const [alertError, setAlertError] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previousPrice, setPreviousPrice] = useState(null);  // Track previous price
  const [priceChangeDirection, setPriceChangeDirection] = useState(null); // Track price direction



  useEffect(() => {
    if (previousPrice !== null) {
      if (livePrice > previousPrice) {
        setPriceChangeDirection('up'); // Price went up
      } else if (livePrice < previousPrice) {
        setPriceChangeDirection('down'); // Price went down
      }
    }
    setPreviousPrice(livePrice);
  }, [livePrice]);

  // Style for price based on its direction (up or down)
  const priceStyle = priceChangeDirection === 'up' ? { color: 'green' } : priceChangeDirection === 'down' ? { color: 'red' } : {};
  
  useEffect(() => {
    if (selectedTime) {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/get_alerts?selectedTime=${selectedTime}&selectedValue=${selectedValue}`);
        if (!response.ok) {
          throw new Error('Failed to fetch alerts');
        }
        const data = await response.json();
        setAlerts(data.alerts || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchAlerts();  // Fetch alerts immediately

    const intervalId = setInterval(fetchAlerts, 1000);  // Fetch alerts every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }
  }, [selectedTime, selectedValue]);

  
  useEffect(() => {
    if (selectedTime) {
      const handleAlertsData = async () => {
        try {
          const response = await fetch(`${BACKEND_API_URL}/generate_alerts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedTime, selectedValue }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to generate alert data');
          }
        } catch (error) {
          console.error('Error sending alert data:', error);
        }
      };
  
      handleAlertsData();

      const timeInSeconds = parseInt(selectedTime, 10) * 60; // Convert selectedTime (minutes) to seconds
      let remainingTime = timeInSeconds;
  
      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };
  
      setCountdown(formatTime(remainingTime));
  
      const countdownInterval = setInterval(() => {
        remainingTime -= 1;
        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
          setCountdown('00:00');
          setSelectedTime(null); // Reset the selected time
          navigation.navigate('Home', { resetBotScalping: true });
        } else {
          setCountdown(formatTime(remainingTime));
        }
      }, 1000);
  
      return () => clearInterval(countdownInterval);
    }
  }, [selectedTime, selectedValue, navigation]);
  
  useEffect(() => {
    if (!isCoinSelected) {
      setSelectionMessage('Please select a coin from the Live Prices tab before starting.');
    } else {
      setSelectionMessage('');
    }
  }, [isCoinSelected]);

  useEffect(() => {
    if (!selectedTime) {
      setAlertError('Please select timeframe from the Bot Scalping Signals tab to see alerts.');
    } else {
      setAlertError(''); 
    }
  }, [isCoinSelected]);
  

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.fromTimeScreen) {
        setSelectedTab('BotScalpingSignals');
        setSelectedTime(route.params?.selectedTime || null); 
      }
      if (route.params?.resetBotScalping) {
        setSelectedTab('BotScalpingSignals');
        setSelectedTime(null); // Reset the selected time
      }
    }, [route.params?.fromTimeScreen, route.params?.resetBotScalping])
  );
  
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
      case 'LivePrices':
        return (
          <>
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
                  label: 'Select coin',
                  vAalue: null,
                }}
              />
            </View>
            <View style={styles.pricesTextContainer}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
                Selected Coin: 
                <Text style={{ color: 'green', fontSize: 20, fontWeight: 'bold' }}> {selectedValue}</Text>
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {livePrice !== null && (
                  <>
                    <Text style={styles.selectedCurrency}>
                      {livePrice.toFixed(2)}<Text style={styles.usdStyle}>USDT</Text>
                    </Text>
                    
                  </>
                )}
              </View>
            </View>
            <View style={styles.chartContainer}>
              {selectedValue && <CandleStickChartComponent coin={selectedValue} />}
            </View>
          </>
        );
      case 'Indicators':
      return (
      <>
       {selectedValue ? (
        <>
          <View style={styles.pricesTextContainer}>
            {livePrice !== null && (
              <Text style={styles.displayCurrentPrice}>
                <Text style={{ color: 'green', fontStyle: 'italic', fontWeight: 'bold' }}>
                  {selectedValue}: </Text>{livePrice.toFixed(2)}
                <Text style={styles.usdStyle}>USDT</Text>
              </Text>
            )}
          </View>
          <View style={styles.indicatorsDropDown}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedIndicator(value)}
              items={[
                { label: 'Bollinger Bands', value: 'BollingerBands' },
                { label: 'Relative Strength Index', value: 'RSI' },
              ]}
              style={pickerSelectStyles.inputAndroid}
              placeholder={{
                label: 'Select indicator...',
                value: null,
              }}
            />
          </View>
          {selectedIndicator === 'BollingerBands' && indicatorData.upper_band && (
            <View>
              <Text>Upper Band: {indicatorData.upper_band.toFixed(2)}</Text>
              <Text>Middle Band: {indicatorData.middle_band.toFixed(2)}</Text>
              <Text>Lower Band: {indicatorData.lower_band.toFixed(2)}</Text>
            </View>
          )}
          {selectedIndicator === 'RSI' && indicatorData.rsi_value && (
            <View>
              <Text style={styles.rsiText}>RSI Value: {indicatorData.rsi_value.toFixed(2)}</Text>
            </View>
          )}
        </>
      ) : (
        // If no coin is selected, display an error message
        <View style={{marginTop: 73}}>
        <Text style={styles.selectionMessage}>{selectionMessage}</Text>
        </View>
      )}
    </>
  );

  case 'BotScalpingSignals':
    return (
     <>
        <View style={styles.pricesTextContainer}>
            {livePrice !== null && (
              <Text style={styles.displayCurrentPrice}>
                <Text style={{ color: 'green', fontStyle: 'italic', fontWeight: 'bold' }}>
                  {selectedValue}: </Text>{livePrice.toFixed(2)}
                <Text style={styles.usdStyle}>USDT</Text>
              </Text>
            )}
          </View>
      {selectedTime ? (
        <View style={{ marginTop: 15 }}>
          <Text style={styles.selectedTimeTextStyle}>
            Time Frame:<Text style={styles.selectedTimeStyle}> {selectedTime}</Text>
          </Text>
          <Text style={styles.countdownStyle}>{countdown}</Text>
        </View>
      ) : (
        !isCoinSelected ? (    // if no coin seleted, Display the message 
          <Text style={styles.selectionMessage}>{selectionMessage}</Text>
        ) : (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('Time', { selectedValue })}
          >
            <Text style={styles.startButtonText}>Get Started</Text>
          </TouchableOpacity>
        )
      )}
    </>
  );

   case 'Alerts':
    return (
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {alerts.length > 0 ? (
          alerts
            .slice()
            .reverse()
            .map((alert, index) => {
              const createdAt = new Date(alert.created_at);
              const timeString = createdAt.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });
  
              return (
                <View style={styles.alertContainer} key={index}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text>Coin: {alert.symbol}</Text>
                  <Text>RSI Value: {alert.rsi_value}</Text>
                  <Text>Time Frame: {alert.timeFrame}</Text>
                  <Text>Username: {alert.username}</Text>
                  <Text>Email: {alert.email}</Text>
                  <Text>Time: {timeString}</Text>
                </View>
              );
            })
        ) : (
          // <Text>No alerts found</Text>
          <Text style={styles.selectionMessage}>{alertError}</Text>
        )}
      </ScrollView>
    );
 
  default:
    return null;

    }
  };

  return (
    <LinearGradient
      colors={['black', '#3d0615']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }} // Changed to vertical gradient
      style={styles.gradientBackground}>

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Crypto Trading Bot</Text>
          <TouchableOpacity style={styles.userIcon} onPress={() => navigation.navigate('Profile')}>
            <Image source={require('../assets/usericon.png')} style={styles.userIconImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('LivePrices')}>
            <Text style={[styles.tabText, selectedTab === 'LivePrices' && styles.selectedTabText]}>
              Live Prices
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('Indicators')}>
            <Text style={[styles.tabText, selectedTab === 'Indicators' && styles.selectedTabText]}>
              Indicators
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('BotScalpingSignals')}>
            <Text style={[styles.tabText, selectedTab === 'BotScalpingSignals' && styles.selectedTabText]}>
              Bot Scalping Signals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('Alerts')}>
            <Text style={[styles.tabText, selectedTab === 'Alerts' && styles.selectedTabText]}>
              Alerts
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.contentContainer}>
          {renderContent ? renderContent() : <Text>No Content Available</Text>}
        </View>
      </View>
    </LinearGradient>

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
  },
  header: {
    marginLeft: -8,
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: '20',
  },
  userIcon: {},
  userIconImage: {
    marginTop: 20,
    borderRadius: 50,
    width: 35,
    height: 35,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 25,
    marginLeft: -5,
    marginRight: -5,
    justifyContent: 'space-between',
  },
  tab: {
    marginRight: 10,
  },
  tabText: {
    color: 'white',
    fontSize: 12,
  },
  selectedTabText: {
    fontWeight: 'bold',
    color: '#63B8CE',
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
    width: '120%',
    height: 57,
    borderRadius: 10,
  },
  selectedCurrency: {
    color: '#63B8CE',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: -4,
  },
 
  displayCurrentPrice: {
    marginLeft: 10,
    color: '#63B8CE',
    fontSize: 25,
    fontWeight: 'bold',
  },
  usdStyle: {
    color:'#63B8CE',
    fontSize: 18,
    fontWeight: '400',
    fontStyle:'italic',
  },
  coinsDropDown: {
    height: 43,
    width: 200,
    backgroundColor: 'white',
    borderColor: '#304b52',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
  },
  indicatorsDropDown: {
    height: 46,
    width: 250,
    backgroundColor: 'white',
    borderColor: '#304b52',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    marginTop: -19,
    marginBottom: 15,
  },
  chartContainer: {
    marginTop: '10',
    height: 380,
    width: '121%',
  },
  rsiText: {
    fontSize: 17,
  },
  startButton: {
    marginTop: 140,
    borderRadius: 50,
    backgroundColor: '#63B8CE',
    height: 50,
    width: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
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
    color: 'red',
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
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
  },

  
});

export default HomeScreen;
