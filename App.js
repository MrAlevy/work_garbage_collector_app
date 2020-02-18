import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { createAppContainer, StackActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Feather } from '@expo/vector-icons';

import rootReducer from './src/reducers';
import {
  HomeScreen,
  SettingsScreen,
  PlaceScreen
} from './src/components/screens';
import { SCREEN } from './src/constants/screenConstants';
import { COLORS } from './src/styles';

const HomePageNavigator = createStackNavigator(
  {
    [SCREEN.HOME]: {
      screen: HomeScreen,
      headerMode: 'screen',
      navigationOptions: ({ navigation }) => ({
        headerTitle: () => (
          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.headerFont
              }}
            >
              {'Журнал от ' +
                ' ' +
                new Date(navigation.getParam('date'))
                  .toLocaleDateString() //FIXME: wrong output!
                  .replace(/\//g, '.')}
            </Text>
          </View>
        ),
        headerLeft: null,
        headerRight: () => (
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{ color: COLORS.headerFont }}>
                {navigation.getParam('phoneNumber')}
              </Text>
              <Text style={{ color: COLORS.headerFont }}>
                {navigation.getParam('tsNumber')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate(SCREEN.SETTINGS)}
            >
              <Feather
                style={{ marginHorizontal: 10, color: COLORS.headerFont }}
                name='settings'
                size={30}
              />
            </TouchableOpacity>
          </View>
        )
      })
    },
    [SCREEN.SETTINGS]: {
      screen: SettingsScreen,
      headerMode: 'screen',
      navigationOptions: {
        headerTitle: 'Настройки'
      }
    },
    [SCREEN.PLACE]: {
      screen: PlaceScreen,
      headerMode: 'screen',
      navigationOptions: ({ navigation }) => ({
        headerTitle: () => (
          <Text style={{ fontSize: 16, color: COLORS.headerFont }}>
            {navigation.getParam('currentPlaceType') === 'container_place'
              ? 'Контейнерная площадка'
              : navigation.getParam('currentPlaceType') === 'place_reloading'
              ? 'Точка перегруза'
              : 'Полигон'}
            {' № '}
            {navigation.getParam('currentPlaceNumber')}
          </Text>
        )
      })
    }
  },
  {
    defaultNavigationOptions: () => ({
      headerStyle: {
        backgroundColor: COLORS.main
      },
      headerTintColor: COLORS.headerFont
    }),
    //headerMode: 'none', // disable header
    initialRouteName: SCREEN.SETTINGS
  }
);

/* // Tab navigator configuration
const TabScreens = createBottomTabNavigator(
  {
    [SCREEN.HOME]: HomePageNavigator,
    [SCREEN.SETTINGS]: SettingsScreen
  },
  {
    initialRouteName: SCREEN.HOME,
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Feather;
        let iconName;
        if (routeName === SCREEN.HOME) {
          iconName = `book-open`;
        } else if (routeName === SCREEN.SETTINGS) {
          iconName = `settings`;
        }
        return (
          <IconComponent
            style={{ marginTop: 10 }}
            name={iconName}
            size={25}
            color={tintColor}
          />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: COLORS.active,
      inactiveTintColor: COLORS.inactive,
      labelStyle: {
        marginBottom: 7,
        fontSize: 15
      },
      style: {
        alignContent: 'center',
        height: 60,
        backgroundColor: COLORS.main
      }
    }
  }
); */

// Implement tab navigator
// const AppContainer = createAppContainer(TabScreens);
const AppContainer = createAppContainer(HomePageNavigator);

// Init Redux store
const store = createStore(rootReducer, applyMiddleware(thunk));

// Export whole App component
const App = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

export default App;
