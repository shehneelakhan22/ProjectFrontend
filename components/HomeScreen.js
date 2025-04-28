import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput, FlatList, ActivityIndicator, Alert, Animated, SafeAreaView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { RadioButton } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit'; 
import { Dimensions } from 'react-native';
import CandleStickChartComponent from './CandleStickChartComponent';
import { BACKEND_API_URL } from './configUrl';
import { colors } from './constantcolors'


const HomeScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('TradingBot');
  const [selectedValue, setSelectedValue] = useState(null);
  const [livePrice, setLivePrice] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [indicatorData, setIndicatorData] = useState({});
  const [isCoinSelected, setIsCoinSelected] = useState(false); 
  const [error, setError] = useState('');
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('0');
  const [selectedCoin, setSelectedCoin] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [predictionError, setPredictionError] = useState('');
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [botRunning, setBotRunning] = useState(false);
  const [dates, setDates] = useState([]);
  const [balance, setBalance] = useState(null); 
  const [botLoading, setBotLoading] = useState(false); 
  const [trades, setTrades] = useState([]);
  const [finalBalance, setFinalBalance] = useState(0);



  ////////////// "Crypto Signals" tab functions and states //////////////


  // ---------------Start the bot--------------------- //
  const startBot = async () => {
    if (selectedTimeframe && selectedTicker && investmentAmount) {
      console.log(`Bot started with timeframe: ${selectedTimeframe} minutes`);
      setIsBotRunning(true);

      const now = new Date();
      const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
      const date = now.toLocaleDateString('en-US', options);
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
  
      setStartTimestamp(`${time} - ${date}`);
      setBotRunning(true);
      setElapsedTime(0);
  
      // Convert formatted amount string back to a number
      const numericAmount = Number(investmentAmount.replace(/,/g, ''));
      // 1. Update wallet
      const updateResponse = await fetch(`${BACKEND_API_URL}/update_wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important if using session
        body: JSON.stringify({ amount: numericAmount }),
      });

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        alert(updateData.error || 'Failed to update wallet');
        return;
      }

      // 2. Get updated balance
      const balanceResponse = await fetch(`${BACKEND_API_URL}/get_balance`, {
        method: 'GET',
        credentials: 'include',
      });

      const balanceData = await balanceResponse.json();

      if (!balanceResponse.ok) {
        alert(balanceData.error || 'Failed to fetch balance');
        return;
      }

      const balanceFormatted = Number(balanceData.balance).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setBalance(balanceFormatted);
      // setBalance(Number(balanceData.balance).toLocaleString());
      console.log(`Updated Balance: $${balanceData.balance}`);

      // 3. Call /startbot endpoint to pass values
     const startBotResponse = await fetch(`${BACKEND_API_URL}/start_Bot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        timeframe: selectedTimeframe,
        coin: selectedTicker,
        balance: balanceData.balance, 
     }),
    });

    const botData = await startBotResponse.json();
    if (!startBotResponse.ok) {
      alert(botData.error || 'Failed to start bot');
      return;
    }
  
  } else {
      alert('Please select all fields before starting the bot.');
    }
  };

  
  // ---------------Stop the bot---------------------
  const stopBot = async () => {
    setBotLoading(true);

    try {
      const response = await fetch(`${BACKEND_API_URL}/stop_Bot`);
      const data = await response.json();
  
      if (response.ok) {
        const {final_portfolio_value, total_profit, total_trades } = data;

        setBotLoading(false);
        setIsBotRunning(false);
        
      Alert.alert(
        'Bot Stopped Successfully', // Title
        `📈 Current Balance: $ ${final_portfolio_value}\n` +
        `💰 Total Profit: $${total_profit}\n` +
        `📊 Total Trades: ${total_trades}`,
        [{ text: 'OK' }]
      );

      // Send updated balance to /update_wallet
      await fetch(`${BACKEND_API_URL}/update_wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentBalance: final_portfolio_value,
        }),
      });

      setSelectedTicker(null);
      setSelectedTimeframe(null);
      setInvestmentAmount('0');
      setBotRunning(false); // Stop the timer
      } else {
        alert(`Error: ${data.error || 'Something went wrong stopping the bot.'}`);
        setBotLoading(false);
      }
    } catch (error) {
      alert(`Network Error: ${error.message}`);
      setBotLoading(false);
    }
  };

  // ---------------fetching trades---------------------
  const fetchTrades = async () => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/get_trades`);
      const data = await response.json();
      setTrades(data.trades.reverse());  // Latest trade on top
      const formattedBalance = Number(data.final_portfolio_value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setFinalBalance(formattedBalance);
      
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  useEffect(() => {
    fetchTrades(); // fetch immediately
    const interval = setInterval(fetchTrades, 5000); 
    return () => clearInterval(interval); // cleanup on unmount
  }, []);
  
  

  const renderTrade = ({ item }) => (
    <View style={[styles.IndividualCard, item.type === 'BUY' ? styles.buy : styles.sell]}>
      <Text style={styles.type}>{item.type}  <Text style={{color:'#00ff00', fontWeight:'condensed'}}>${item.price.toFixed(2)}</Text></Text>
      <Text style={{ fontStyle: 'italic', color:'#00FFCC' }}>{item.time}</Text>
      {item.profit !== undefined && (
        <Text style={{ color: 'white'}}>Profit: <Text style={{ color: '#00ff00'}}>${item.profit.toFixed(2)}</Text></Text>
      )}
    </View>
  );

  // ---------------Loading picture animation---------------------
  const fadeAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
      if (botLoading) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0.3, // fade out
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1, // fade in
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        fadeAnim.setValue(1); // reset to fully visible when not loading
      }
    }, [botLoading]);


  // --------Timer--------
  useEffect(() => {
    let timer;
    if (botRunning) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer); // Clear interval when stopped
    }

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [botRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  

  ////////////// "Price Prediction" tab functions and states //////////////
  const getFormattedDateLabels = () => {
    return dates.map((date, index) => (index % 5 === 0 ? date.slice(5) : ''));

  };
  
  const fetchPredictions = async (coin) => {
    if (!coin) return;
    
    setLoading(true);
    setPredictionError('');
    setPredictions([]);
    setDates([]);
  
    try {
      const response = await fetch(`${BACKEND_API_URL}/predict?coin=${coin}`);
      const data = await response.json();
  
      if (data.error) {
        setPredictionError(data.error);
      } else {
        setPredictions(data.predictions);
        setDates(data.future_dates);
      }
    } catch (error) {
      setPredictionError('Failed to fetch predictions.');
    } finally {
      setLoading(false);
    }
  };
  

  
  ////////////// "Live Prices" tab functions and states //////////////
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
          console.log("Backend API URL:", Config.BACKEND_API_URL);

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
  

  ///////////////////////////////////////////////////////////////////////////////
  ////////////////////////////----- Tabs Views ------////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////

  const renderContent = () => {
    switch (selectedTab) {
      case 'TradingBot':
        return (
          <>
          {isBotRunning ? (
            botLoading ? (
              <View style={{ display:'flex', width:'100%', justifyContent: 'center', alignItems: 'center', marginTop:100 }}>
              <Animated.Image
              source={require('../assets/hello_Logo.png')}
              style={{
                width: 70,
                height: 70,
                opacity: fadeAnim,
              }}
              />
              <Text style={{ color: 'white', marginTop: 10 }}>Please wait a moment, BOT is stopping...</Text>
              </View>
              
            ) : (

            <View  
            Style={[styles.runningBotContainer, { flexGrow: 1 }]} >
               <Text style={styles.botRunningText}>Bot is running...</Text>
               <View style={styles.stopButtonView}> 
                <TouchableOpacity style={styles.stopButton} onPress={stopBot}>
                  <Text style={styles.stopButtonText}>Stop</Text>
                  </TouchableOpacity>
              </View>

      <View style={styles.botDetailsContainer}>  
        <View style={styles.selectedDetailsContainer}>   
      <Text style={styles.timestampText}>
        Bot Started at: <Text style={{ fontStyle: 'italic', color:'#00FFCC' }}> {startTimestamp}</Text>
      </Text>
      <Text style={{ color: '#00FFCC', fontSize: 18, fontWeight: 'bold', marginBottom: 5, }}>
        {formatTime(elapsedTime)}
      </Text>

      <Text style={styles.detailText}>
        Selected Coin: <Text style={styles.highlighted}>{selectedTicker}</Text>
      </Text>
      <Text style={styles.detailText}>
        Investment: <Text style={styles.highlighted}>$ {investmentAmount}</Text>
      </Text>
      <Text style={styles.detailText}>
        Total Balance: <Text style={[styles.highlighted, {color:'#00ff00'}]}>$ {balance}</Text>
      </Text>
      <Text style={styles.detailText}>
        Timeframe: <Text style={styles.highlighted}>{
        selectedTimeframe === '1m' ? '1 min' :
        selectedTimeframe === '5m' ? '5 mins' :
        selectedTimeframe === '15m' ? '15 mins' : ''}
      </Text>
      </Text>
      </View> 

      <View style={styles.card}>
      <Text style={styles.balance}>
        Portfolio Balance: <Text style={{ color: '#21a321'}}>${finalBalance} </Text>
      </Text>
      <FlatList
        data={trades}
        renderItem={renderTrade}
        keyExtractor={(_, index) => index.toString()}
      />
      </View>

      </View>  
               
    </View> 
    )
      ) : (

              <View style={styles.tradingContainer}>
                 <Text style={styles.StartTradeText}>Crypto Trading Bot</Text>
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
                          <View style={{flexDirection: 'row', justifyContent:'space-between', width:'100%', paddingLeft:7, paddingRight:7}}>

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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.DollarSign}>$</Text> 
                      <TextInput
                      style={[ 
                        styles.textInputinputStyling,
                        { color: investmentAmount === '0' ? 'gray' : 'white' }
                      ]}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="gray"
                      value={investmentAmount}
                      onChangeText={(text) => {
                        let numericValue = text.replace(/[^0-9]/g, '');
                        numericValue = numericValue.replace(/^0+/, '');
                        const formattedValue = numericValue
                          ? parseInt(numericValue, 10).toLocaleString('en-US')
                          : '0';
                        setInvestmentAmount(formattedValue);
                      }}
                      />
                    </View>

                  </View>

                </View>

                <View style={styles.buttonView}>
                  <TouchableOpacity style={styles.startButton} onPress={startBot}>
                    <Text style={styles.startButtonText}>Start</Text>
                  </TouchableOpacity>
                </View>

              </View>
            
            )}
          </>
        );
        
        case 'PricePrediction':
          return (
            <View style={styles.predictionContainer}>
              <Text style={styles.titleText}>Cryptocurrency Price Prediction</Text>
              <Text style={{color:colors.secondary, textAlign:'center', marginBottom: 15}}>Select a coin to see its price forecast for the next 40 days.</Text>
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
                      color: colors.accent,
                      paddingHorizontal: 10
                  }}
                  placeholder={{ label: 'Select a coin', value: null }}
                />
              </View>
              {selectedCoin ? <Text style={styles.viewingCoin}>Viewing: <Text style={styles.predictionCoin}>{selectedCoin.toUpperCase()}</Text></Text> : null}
    
              {loading && <ActivityIndicator size="large" style={styles.loading} />}
    
              {predictionError ? (
                <Text style={styles.error}>{predictionError}</Text>
              ) : predictions.length > 0 ? (
                <View style={styles.chartContainer}>
                 <LineChart
                 data={{
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
                  width={Dimensions.get('window').width - 20} 
                  height={Dimensions.get('window').width * 0.9} 
                  yLabelsOffset={3}
                  chartConfig={{
                    backgroundColor: '#FFFFFF', 
                    backgroundGradientFrom: '#FFFFFF', 
                    backgroundGradientTo: '#FFFFFF',
                    decimalPlaces: 2, // Show two decimal places
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Axis and grid line color (black)
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color for both x and y axes [default]
                    propsForDots: {
                      r: '0', // This will remove dots from the chart
                    },
                    propsForBackgroundLines: {
                      stroke: '#e0e0e0', // light grey lines
                      strokeDasharray: '', // solid lines
                    },
                  }}
                  decorator={() => null}
                  style={{
                    marginVertical: 10,
                    paddingBottom: 10
                  }}
                  contentInset={{ top: 100, bottom: 10 }}
                  bezier
                  verticalLabelRotation={90}
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
    <View style={{marginTop:10, alignItems:'center'}}>
       <Text style={styles.titleText}>Cryptocurrency Insignt</Text>
       <Text style={{color:colors.secondary, textAlign:'center', marginBottom: 10}}>Select a cryptocurrency to access real-time price and indicator data.</Text>
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
      </View>

  );
}
}

///////////////////////////////////////////////////////////////////////////////
//////////////////////////---- Tabs Calls ----/////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

  return (

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
        <Image source={require('../assets/HomeScreenTitle.png')} style={styles.LogoStyling} />
          <TouchableOpacity style={styles.userIcon} onPress={() => navigation.navigate('Profile')}>
            <Image source={require('../assets/profile_click.png')} style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>

        <View style={styles.tabsView}>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('TradingBot')}>
          <View style={[styles.tabView, selectedTab === 'TradingBot' && styles.activeTab]}>
            <Text style={[styles.tabText, selectedTab === 'TradingBot' && styles.selectedTabText]}>
              Trading Bot
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

        <View style={styles.contentContainer}>
          {renderContent ? renderContent() : <Text>No Content Available</Text>}
        </View>
      </SafeAreaView>

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
    color: colors.secondary,
    marginTop: 10,
  },
});

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:24,
    backgroundColor: colors.accent,
  },
  radioItemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  radioLabel: {
    color: colors.secondary,
    fontSize: 16,
    marginTop:-11,
    textAlign: 'center',
    fontWeight:'300'
  },
  tradingContainer : {
    padding: 20,
    width:screenWidth * 0.9
  },
  StartTradeText:{
    color:colors.primary,
    fontSize: 30,
    marginTop:-25,
    marginBottom:20,
    textAlign:'center',
    color:colors.primary,
    fontWeight:'400',
    marginBottom: 10,
    marginTop: -40
  },
  buttonView:{
    marginTop: 20,
    width: 300,
    alignItems:'center'
  },
  startButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    borderRadius: 50,
    height: 45,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  CryptoInputContainer:{
    height:100,
  },
  TimeframeInputContainer:{
    height:128,
  },
  tabView:{
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 22,
  },
  settingsIcon: {
    width: 35,
    height: 35,
  },
  LogoStyling: {
    alignSelf:'center',
    width: 190,
    height: 50,
  },
  tabContainer: {
    height:33,
    display:'flex',
    flexDirection: 'row',
    justifyContent:'center',
    marginBottom: 20,
    marginLeft: -12,
    marginRight: -12,
    alignItems:'center',
    backgroundColor:colors.secondary,
    borderRadius:10
  },
  tabsView:{
    height:'100%',
    width:'33.3%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },
  tab: {
    height:'100%',
    width:'100%',
    borderRadius:10,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
  },
  tabText: {
    color: colors.accent,
    fontSize: 12,
    textAlign:'center'

  },
  selectedTabText: {
    fontWeight: 'bold',
    color: colors.secondary,
    width:'100%',
    borderRadius:10,
  },
  tabView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderRadius:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelStyling:{
    color:colors.secondary,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '300',
  },
  coinsDropDownInCryptoSignals:{
    height: 34,
    width: 200,
    backgroundColor: colors.secondary,
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
  DollarSign:{
    color: colors.secondary, 
    fontWeight: 'bold', 
    fontSize: 20, 
    paddingLeft:33,
    marginTop:-3
  },
  textInputinputStyling:{
    height: 40,
    width: 280,
    borderRadius: 10,
    borderWidth:0,
    marginLeft:0,
    fontSize:16
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
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    borderRadius: 10,
  },
  indicatorsDropDown: {
    height: 40,
    width: 180,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    borderRadius: 10,
  },
  coinAndIndicatorsDisplayContainer:{
    width:380,
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  chartContainer: {
    height: screenHeight * 0.65,
  },
  bbandText: {
    fontSize: 14,
    color: colors.secondary
  },
  bbandValue: {
    color: '#00FF00',
    fontWeight:'bold'
  },
  rsiText: {
    fontSize: 14,
    color: colors.secondary
  },
  rsiValue: {
    fontSize: 17,
    color:'#00FF00',
    fontWeight:'bold'
  },
  selectedTimeTextStyle:{
    fontSize:18,
    color: colors.secondary,
    fontWeight:'500'
  },
  selectedTimeStyle:{
     fontSize:18,
     color:colors.success,
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
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
  alertMessage:{
    fontSize: 16,
    fontWeight:'bold',
    color:'#2e2d2b'
  }, 
  predictionContainer: {
    width:screenWidth * 0.9,
    padding: 20,
    alignItems:'center',
  },
  titleText: {
    color:colors.primary,
    fontWeight:'400',
    fontSize: 22,
    marginBottom: 10,
    marginTop: -40,
  },
  error: {
    color: colors.error,
    marginTop: 10,
  },
  loading: {
    marginTop: 20,
  },
  prediction: {
    marginTop: 5,
    color:colors.success
  },
  dropDownForPricePrediction: {
    height: 40,
    width: 180,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    borderRadius: 10,
  },
  viewingCoin:{
    color: colors.secondary,
    fontSize:16,
    marginTop:10,
    fontWeight:'400'
  },
  predictionCoin: {
    color: colors.primary,
    fontSize:16,
    fontWeight:'600'
  },
  runningBotContainer: {
    flex:1,
    width: '100%',
    alignItems:'center',
  },
  botRunningText: {
    marginBottom: 20,
    alignSelf:'center',
    fontSize: 20, 
    color: '#00ff00', 
    fontWeight: 'bold',
  },
  stopButtonView: {
    alignItems: 'center',
  },
  stopButton: {
    width:150,
    alignItems:'center',
    backgroundColor: colors.error,
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  stopButtonText: {
    color: colors.secondary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  botDetailsContainer: {
    marginTop: 20,
    paddingLeft: 11,
    paddingRight: 11,
    // boxShadow: '-1px -2px 17px rgba(255, 255, 255, 0.96)',
    borderRadius: 10,
    width:'110%',
    height:500
  },
  selectedDetailsContainer:{
    alignItems:'center'
  },
  timestampText: {
    color: colors.secondary,
    fontSize: 14,
    marginVertical: 10,
  },
  detailText: {
    color: colors.secondary,
    fontSize: 15,
    marginVertical: 2,
  },
  highlighted: {
    fontWeight: 'bold',
    color: '#ffd700',
  },
  card: {
    backgroundColor: '#6e6e6e',
    paddingHorizontal: 12,
    marginVertical: 10,
    borderRadius: 10,
    paddingTop:5,
    paddingBottom:5,
  },
  IndividualCard: {
    backgroundColor:colors.accent,
    borderRadius:10,
    padding:10,
    marginVertical:'5',
  },
  SummaryText:{
    color:colors.secondary,
    fontWeight:'bold',
    fontSize:16
  },
  infoText:{
    marginTop:2,
    color:colors.secondary,
    fontSize:14
  },
  conStatus: {
    color: '#ffd700',
    marginBottom: 5,
  },
  coinText: {
    color: colors.secondary,
    fontSize: 16,
  },
  cardTimestamp: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 3,
  },
  balance: { 
    fontSize: 18, 
    fontWeight: '500', 
    marginBottom: 10 
  },
  card: {
    backgroundColor: '#eee',
    padding: 10,
    marginVertical: 6,
    borderRadius: 10,
  },
  buy: {
    borderLeftWidth: 5,
    borderLeftColor: colors.success,
  },
  sell: {
    borderLeftWidth: 5,
    borderLeftColor: colors.error,
  },
  type: {
    fontWeight: 'bold',
    fontSize: 16,
    color:colors.primary
  },
});

export default HomeScreen;
