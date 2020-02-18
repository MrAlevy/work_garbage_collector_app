import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  AsyncStorage
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { getJournal, setSettings } from '../../actions';
import { SCREEN } from '../../constants';
import {
  getContTypesDict,
  getGarbageGenDict,
  getNewGarbageGenDict,
  getPoiDict,
  getNewPoiDict
} from '../../actions/dictsActions';
import { COLORS } from '../../styles';

const _storeData = async obj => {
  console.log('hello: ', obj);
  for (let key in obj) {
    console.log('its key: ', key);
    try {
      await AsyncStorage.setItem(key, obj[key]);
    } catch (error) {
      console.log(`async storage error (set data): ${error}`);
    }
  }
};
/* 
const _retrieveData = async key => {
  try {
    const valuesettings.msisdn = await AsyncStorage.getItem('@storage_settings.msisdn');
    if (valuesettings.msisdn !== null) {
      setsettings.msisdn(valuesettings.msisdn);
    }
  } catch (error) {
    console.log('async storage error: ', error);
  }
}; */

const SettingsScreen = props => {
  const dispatch = useDispatch();
  const journalStore = useSelector(state => state.journal);
  const settings = useSelector(state => state.settings);
  const api = settings.api;

  const [tsRefInput, setTsRefInput] = useState();
  const reqData = {
    headers: {
      msisdn: settings.msisdn, //.match(/\d/g).join(''),
      vehicleNumber: settings.vehicleNumber
    },
    body: {
      actualizationDate: '2020-01-31T07:45:49.953Z',
      updateDate: ''
    }
  };

  /*   // Insert data to form from async storage if it's there
  useEffect(() => {
    _retrieveData();
  }, []); */

  // Phone number formatting
  const handleFocusPhoneInput = () => {
    if (settings.msisdn.length === 0)
      dispatch(setSettings({ ...settings, msisdn: `+7 (` }));
  };

  const handleChangePhoneInput = text => {
    let validText = text
      .split('')
      .map((dig, i) => {
        if (i === 0) return `+`;
        if (!/\d/.test(dig)) return; // only digits
        return dig;
      })
      .join('');

    let phoneEnding = '';

    // prettier-ignore
    if (validText.length > 2 && validText.length < 6) {
      phoneEnding = validText.slice(2, 5);
    } else if (validText.length > 5 && validText.length < 9) {
      phoneEnding = validText.slice(2, 5) + ') ' + validText.slice(5)
    } else if (validText.length > 8 && validText.length < 11) {
      phoneEnding = validText.slice(2, 5) + ') ' + validText.slice(5, 8) + '-' + validText.slice(8, 10)
    } else if (validText.length > 10 && validText.length < 15) {
      phoneEnding = validText.slice(2, 5) + ') ' + validText.slice(5, 8) + '-' + validText.slice(8, 10) + '-' + validText.slice(10, 12);
    }

    validText = validText.slice(0, 2) + ' (' + phoneEnding;

    if (validText.match(/\d/g) === null) {
      validText = '';
      return;
    }

    dispatch(setSettings({ ...settings, msisdn: validText }));

    // Only digits for reqData
    /*     setReqData({
      ...reqData,
      headers: {
        ...reqData.headers,
        msisdn: validText.match(/\d/g).join('')
      }
    }); */
  };

  // TS input formatting
  const handleChangeTsInput = text => {
    try {
      const validText = text
        .match(/[ABEKMHOPCTYX\d]/gi) // only English
        .join('')
        .toUpperCase()
        .slice(0, 16);

      dispatch(setSettings({ ...settings, vehicleNumber: validText }));
    } catch {
      dispatch(setSettings({ ...settings, vehicleNumber: '' }));
    }
  };

  // PUSH Apply button
  const handleApply = () => {
    if (settings.msisdn.length < 6 || settings.vehicleNumber.length < 3) {
      Alert.alert(
        'Ошибка',
        'Заполните поля "Номер телефона" и "Номер траспортного средства".',
        [{ text: 'OK' }]
      );
      return;
    }

    /*     _storeData({
      '@storage_settings.msisdn': settings.msisdn,
      '@storage_TsNumber': tsNumber
    }); */
    console.log(
      '\n⚡  ___ initial request has been started ___  ⚡\n',
      '➡ request body: ',
      reqData
    );
    dispatch(getContTypesDict(api, reqData));
    dispatch(getGarbageGenDict(api, reqData));
    dispatch(getNewGarbageGenDict(api, reqData));
    dispatch(getPoiDict(api, reqData));
    dispatch(getNewPoiDict(api, reqData));
    dispatch(getJournal(api, reqData));
  };

  /*   useEffect(() => {
    setReqData({
      ...reqData,
      body: {
        actualizationDate: new Date(),
        updateDate: new Date()
      }
    });
  }, []); */

  //FIXME:
  useEffect(() => {
    // console.log(journalStore);
    journalStore.isFilled && props.navigation.navigate(SCREEN.HOME);
  }, [journalStore.isFilled]);
  // journalStore
  /*   useEffect(() => {
    console.log('__________________global store!');
    console.log('global store!');
    console.log(globalStore);
    console.log('global store!');
    console.log('__________________global store!');
  }, []); */

  return (
    <View style={styles.main}>
      <View style={styles.form}>
        <View style={styles.inputData}>
          <View style={styles.line}>
            <Text style={styles.capt}>Номер телефона</Text>
            <TextInput
              style={styles.input}
              keyboardType='phone-pad'
              onChangeText={text => handleChangePhoneInput(text)}
              onFocus={() => handleFocusPhoneInput()}
              onSubmitEditing={() => {
                tsRefInput.focus();
              }}
              value={settings.msisdn}
            />
          </View>

          <View style={styles.line}>
            <Text style={styles.capt}>Номер транспортного средства</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => handleChangeTsInput(text)}
              value={settings.vehicleNumber}
              ref={e => {
                setTsRefInput(e);
              }}
            />
          </View>

          <View style={styles.line}>
            <Text style={styles.capt}>Адрес сервера</Text>
            <TextInput
              style={styles.input}
              onChangeText={text =>
                dispatch(setSettings({ ...settings, api: text }))
              }
              value={settings.api}
            />
          </View>

          <View style={styles.applyBtn}>
            <Button
              title='применить'
              color={COLORS.buttons}
              onPress={() => {
                handleApply();
              }}
            />

            {/*           <Button
            title='remove storage'
            onPress={() => {
              AsyncStorage.clear();
            }}
          /> */}
          </View>
        </View>
      </View>
      <Button
        title=''
        color='rgba(250, 0, 0, 0.06)'
        onPress={() => {
          dispatch(
            setSettings({
              ...settings,
              msisdn: '79512224455',
              vehicleNumber: 'C359TE178',
              api: 'http://192.168.88.121:5001'
            })
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    marginTop: 40,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
    width: '80%'
  },
  inputData: {
    flex: 1
  },
  line: {
    flex: 1,
    maxHeight: 90
  },
  input: {
    height: 40,
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: COLORS.borderGray
  },
  capt: {
    fontSize: 15,
    color: COLORS.textSecondary
  },
  applyBtn: {
    width: 120,
    marginTop: 20,
    alignSelf: 'flex-end'
  }
});

export default SettingsScreen;
