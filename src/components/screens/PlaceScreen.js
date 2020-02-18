import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Text,
  Image,
  Modal,
  Picker,
  TouchableOpacity,
  SafeAreaView,
  SectionList,
  FlatList,
  TextInput,
  Animated,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as MediaLibrary from 'expo-media-library';

import {
  updateJournalContainer,
  updateJournalWaypoint,
  addJournalContainer,
  addJournalBulky,
  addJournalGarbageGen,
  addJournalWaypoint,
  updateCreatedGarbageGenDict
} from '../../actions';

import { AddContainerModal, AddBulkyModal } from '../pure/homeScreen';

import { COLORS } from '../../styles';
import { SCREEN } from '../../constants';
import { USUAL_BUTTON_1 } from '../../styles';

const PlaceScreen = props => {
  const dispatch = useDispatch();

  function updateJournalFunc(updateData) {
    dispatch(updateJournal(updateData));
  }

  // Name for new image
  const createImageName = () => new Date().getTime() + '.jpg';

  // Initialize state
  const [images, setImages] = useState([]);
  const [viewedDate, setViewedDate] = useState(''); // entry time for render
  const [datePicker, setDatePicker] = useState({
    date: Date.now() + 3 * 3.6e6,
    mode: 'date',
    show: false
  }); // for date picker
  const [uniqueGarbageGen, setUniqueGarbageGen] = useState({}); // unique garbage generators id with all info from waypoints
  const [isContMenuVisible, setIsContMenuVisible] = useState(false); // place container block visibility
  const [isAddContVisible, setIsAddContVisible] = useState({}); // add new container type block visibility
  const [isAddBulkyVisible, setIsAddBulkyVisible] = useState({}); // add bulky waste block visibility
  const [isPhotoBarVisible, setIsPhotoBarVisible] = useState(false); // photo bar block visibility
  const [addGarbGen, setAddGarbGen] = useState({
    visible: false,
    chosenGarbageGenId: '',
    newGarbageGenBlockVisible: false,
    newGarbageGen: {
      id: '',
      name: '',
      inn: '',
      kpp: '',
      ogrn: ''
    }
  });

  const [modalWithPicker, setModalWithPicker] = useState({
    visible: false,
    data: {}
  }); // render-props comp visibility

  const [addContModal, setAddContModal] = useState({
    garbageGenId: '',
    visible: false
  }); // add container modal visibility
  const [addBulkyModal, setAddBulkyModal] = useState({
    garbageGenId: '',
    visible: false
  }); // add container modal visibility
  const [isAddBulkyModalVisible, setIsAddBulkyModalVisible] = useState(false); // add bulky modal visibility

  // Set the entry time to journal
  const setTime = time => {
    currentPlace.entryUserDate = time; // entry time in ms for server
    setViewedDate(timeStamp(new Date(currentPlace.entryUserDate)));
  };

  // Assign current container place from journal from Store
  //FIXME: place.number change to place.id
  const currentPlace = useSelector(
    state =>
      state.journal.journal.waypoints.filter(
        place => place.id === props.navigation.getParam('currentPlaceId')
      )[0]
  );

  const idPOI = currentPlace.idPOI;

  // Assign garbage generators dictionary from dicts/garbageGen from Store
  const garbageGenDict = useSelector(state => state.dicts.garbageGen);
  const createdGarbageGenDict = useSelector(
    state => state.dicts.createdGarbageGen
  );

  // Assign container types dictionary from dicts/contType from Store
  const contTypeDict = useSelector(state => state.dicts.contType);
  const contTypeValuesDict = useSelector(state => state.dicts.contTypeValues);
  //console.log(contTypeValuesDict);

  const poiDict = useSelector(state => state.dicts.poi);

  /*   console.log(garbageGenDict);
  const qqq = useSelector(state => {
    console.log(
      '⏩⏩⏩ State: ',
      Object.keys(state),
      'Journal: ',
      Object.keys(state.journal),
      'Dicts: ',
      Object.keys(state.dicts)
    );
    console.log('⏩⏩⏩⏩');
    console.log(state.journal);
  }); */

  // String - local directory link for saving photos
  const imagesDir =
    FileSystem.documentDirectory + 'images_upload/' + currentPlace.id;

  //FIXME: delete
  const [imgSize, setImgSize] = useState([]);

  function getImgSize() {
    images.forEach(async image => {
      const imgInfo = await FileSystem.getInfoAsync(imagesDir + '/' + image);
      setImgSize([...imgSize, imgInfo.size / 1000 + 'Кб']);
      console.log(imagesDir + '/' + image + ':', imgInfo.size / 1000 + 'Кб');
    });
  }
  //FIXME:

  // Create local directory for saving photos
  FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });

  // First time component render
  useEffect(() => {
    // Set the entry time
    setTime(datePicker.date);

    // If place is container place
    if (poiDict.items[currentPlace.idPOI].type === 'container_place') {
      // Getting permissions for camera
      const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
          );
          if (status !== 'granted') {
            alert(
              'Для корректной работы приложению необходимо предоставить доступ к камере и галерее.'
            );
          }
        }
      };
      getPermissionAsync();

      // Read images names from local directory and write to the state
      const readImagesNames = async () => {
        const imagesNames = await FileSystem.readDirectoryAsync(imagesDir);
        setImages(imagesNames);
      };
      readImagesNames();
    }
  }, []);

  useEffect(() => {
    // Filled the unique garbage generators array
    const uniqId = new Set();

    if (!('containerWaste' in currentPlace)) currentPlace.containerWaste = [];
    if (!('bulkyWaste' in currentPlace)) currentPlace.bulkyWaste = [];

    currentPlace.containerWaste.forEach(e => uniqId.add(e.garbageGeneratorId));
    currentPlace.bulkyWaste.forEach(e => uniqId.add(e.garbageGeneratorId));

    const tempObjId = {};
    for (let id of uniqId) {
      tempObjId[id] = { containers: {}, bulkyWaste: null };
    }

    currentPlace.containerWaste.forEach(
      e => (tempObjId[e.garbageGeneratorId].containers[e.containerTypeId] = e)
    );
    currentPlace.bulkyWaste.forEach(
      e => (tempObjId[e.garbageGeneratorId].bulkyWaste = e.value)
    );
    setUniqueGarbageGen(tempObjId);
    console.log(currentPlace);
  }, [currentPlace]);

  // Animation Refresh icon settings
  const animatedRefreshIcon = new Animated.Value(0);
  const interpolateRotation = animatedRefreshIcon.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  const animatedStyleRefreshIcon = {
    transform: [{ rotate: interpolateRotation }]
  };

  // Pick image from gallery
  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.4
    });

    if (result.cancelled) return;

    const newImageName = createImageName();

    FileSystem.copyAsync({
      from: result.uri,
      to: imagesDir + '/' + createImageName()
    }).then(() => {
      setImages([...images, newImageName]);
    });

    /*     if (!result.cancelled) {
      this.setState({ images: [...this.state.images, result.uri] });
    } */
  };

  // Take image from camera
  const _takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.4
    });

    if (result.cancelled) return;

    const newImageName = createImageName();

    FileSystem.copyAsync({
      from: result.uri,
      to: imagesDir + '/' + createImageName()
    }).then(() => {
      setImages([...images, newImageName]);
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 7
      }}
    >
      {/**PART: main header data */}
      <View style={{ height: 90, padding: 10, width: '100%' }}>
        {/*  <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ flex: 1, flexGrow: 2 }}>Синхронизация:</Text>
          <View
            style={{
              flexGrow: 5,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <Animated.View style={[animatedStyleRefreshIcon]}>
              <Feather name='refresh-cw' size={15} />
            </Animated.View>
              <Button
              title='rot'
              onPress={() => {
                Animated.loop(
                  Animated.timing(animatedRefreshIcon, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true
                  })
                ).start();
              }}
            /> 
            <Feather name='check' size={20} />
          </View>
        </View> */}

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ flex: 1, flexGrow: 2, color: COLORS.textSecondary }}>
            Адрес:
          </Text>
          <Text
            style={{
              flex: 1,
              flexGrow: 5,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            {poiDict.items[idPOI].address}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ flex: 1, flexGrow: 2, color: COLORS.textSecondary }}>
            Время входа:
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              flexGrow: 5,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <Text>{viewedDate}</Text>
            <TouchableOpacity
              style={{
                flex: 1,
                flexGrow: 5,
                flexWrap: 'wrap',
                alignItems: 'center',
                marginLeft: 10
              }}
              onPress={() => {
                setDatePicker({ ...datePicker, show: true });
              }}
            >
              <Feather style={{}} name='edit' size={20} />
            </TouchableOpacity>
          </View>
        </View>
        {datePicker.show && (
          <DateTimePicker
            value={datePicker.date}
            mode={datePicker.mode}
            is24Hour={true}
            display='default'
            onChange={(e, date) => {
              setDatePicker({
                date:
                  datePicker.mode === 'date'
                    ? date || datePicker.date
                    : datePicker.date,
                mode: datePicker.mode === 'date' ? 'time' : 'date',
                show: datePicker.show === true ? 'timeMode' : false
              });
              setTime(datePicker.date);

              if (datePicker.mode === 'time') {
                datePicker.date.setHours(date.getHours());
                datePicker.date.setMinutes(date.getMinutes());
                datePicker.date.setSeconds(date.getSeconds());
                const newDate = datePicker.date;

                setTime(newDate);
              }
            }}
          />
        )}
      </View>

      {/**PART: containers block */}
      <View
        style={{ ...styles.collapseSectionContainer, alignItems: 'center' }}
      >
        <TouchableOpacity
          onPress={() => {
            setIsContMenuVisible(!isContMenuVisible);
          }}
          activeOpacity={0.7}
          style={styles.collapseSectionOuter}
        >
          <View style={styles.collapseSectionInner}>
            <Text style={{ fontSize: 16, color: 'white' }}>Контейнеры</Text>
            <Feather name='chevron-down' size={25} color='white' />
          </View>
        </TouchableOpacity>

        <SafeAreaView
          style={{
            height: isContMenuVisible ? '80%' : 0,
            width: '98%'
          }}
        >
          <FlatList
            data={Object.keys(uniqueGarbageGen).sort()}
            keyExtractor={item => item}
            renderItem={({ item, index }) => (
              <View
                style={{
                  marginTop: index === 0 ? 5 : 10,
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderColor: COLORS.borderGray
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: index === 0 ? 0 : 10,
                    marginBottom: 5
                  }}
                >
                  {/**EL: garbage gen name*/}
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 14
                    }}
                  >
                    {item in garbageGenDict.items &&
                      garbageGenDict.items[item].name}
                  </Text>

                  {/**EL: garbage gen icons block*/}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      maxWidth: 90,
                      marginHorizontal: 20
                    }}
                  >
                    {/*                     <Feather
                      style={{ color: 'gray' }}
                      name='plus-square'
                      size={15}
                      onPress={() => {
                        setAddContModal({
                          garbageGenId: item,
                          visible: true
                        });
                      }}
                    /> */}
                    {/**BLOCK: add container */}
                    <TouchableOpacity
                      onPress={() => {
                        setIsAddContVisible({
                          ...isAddContVisible,
                          [item]: {
                            ...isAddContVisible[item],
                            visible:
                              item in isAddContVisible
                                ? !isAddContVisible[item].visible
                                : true
                          }
                        });
                      }}
                    >
                      <Feather
                        style={{ color: '#5073a5' }}
                        name='plus-square'
                        size={25}
                      />
                    </TouchableOpacity>

                    {/**BLOCK: add bulky waste */}
                    <TouchableOpacity
                      onPress={() => {
                        setIsAddBulkyVisible({
                          ...isAddBulkyVisible,
                          [item]: {
                            ...isAddBulkyVisible[item],
                            visible:
                              item in isAddBulkyVisible
                                ? !isAddBulkyVisible[item].visible
                                : true
                          }
                        });
                      }}
                    >
                      <Feather
                        style={{ color: '#a55050' }}
                        name='box'
                        size={25}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ height: 5 }}></View>

                {/**SECT: add bulky waste block */}
                <View style={{}}>
                  <View
                    style={{
                      opacity:
                        item in isAddBulkyVisible &&
                        isAddBulkyVisible[item].visible
                          ? 1
                          : 0,
                      height:
                        item in isAddBulkyVisible &&
                        isAddBulkyVisible[item].visible
                          ? 120
                          : 0
                      // backgroundColor: 'lightgray',
                      // flex: 1,
                      // justifyContent: 'space-between',
                      // marginTop: 20,
                      // marginBottom: 20,
                      // width: 200
                    }}
                  >
                    <Text>Объем КГО:</Text>
                    <TextInput
                      style={{
                        backgroundColor: 'lightyellow',
                        width: 50,
                        height: 20
                      }}
                      keyboardType='numeric'
                      placeholder='0'
                      placeholderTextColor='gray'
                      onChangeText={text => {
                        setIsAddBulkyVisible({
                          ...isAddBulkyVisible,
                          [item]: {
                            ...isAddBulkyVisible[item],
                            value: text
                          }
                        });
                      }}
                      value={
                        item in isAddBulkyVisible &&
                        isAddBulkyVisible[item].value
                          ? isAddBulkyVisible[item].value.toString()
                          : 0
                      }
                    />

                    <Button
                      title='добавить'
                      onPress={() => {
                        dispatch(
                          addJournalBulky(currentPlace.id, {
                            garbageGeneratorId: item,
                            value: isAddBulkyVisible[item].value
                          })
                        );
                      }}
                    />
                  </View>
                </View>

                {/**SECT: add new container block*/}
                <View style={{}}>
                  <View
                    style={{
                      opacity:
                        item in isAddContVisible &&
                        isAddContVisible[item].visible
                          ? 1
                          : 0,
                      height:
                        item in isAddContVisible &&
                        isAddContVisible[item].visible
                          ? 230
                          : 0
                      // backgroundColor: 'lightgray',
                      // flex: 1,
                      // justifyContent: 'space-between',
                      // marginTop: 20,
                      // marginBottom: 20,
                      // width: 200
                    }}
                  >
                    <Text>выберите тип:</Text>

                    <Picker
                      selectedValue={
                        item in isAddContVisible &&
                        isAddContVisible[item].choosenValue
                          ? isAddContVisible[item].choosenValue.toString()
                          : ''
                      }
                      style={{ height: 50, width: 200 }}
                      onValueChange={text => {
                        console.log('____');
                        console.log(text);
                        console.log('____');
                        console.log(isAddContVisible);
                        console.log('____');
                        setIsAddContVisible({
                          ...isAddContVisible,
                          [item]: {
                            ...isAddContVisible[item],
                            choosenValue: text,
                            possibleTypesId: contTypeValuesDict[text],
                            choosenTypeId:
                              contTypeValuesDict[text].lenght === 1
                                ? contTypeValuesDict[text][0]
                                : ''
                          }
                        });
                      }}
                    >
                      {Object.keys(contTypeValuesDict).map(value => (
                        <Picker.Item key={value} label={value} value={value} />
                      ))}
                    </Picker>

                    <Picker
                      selectedValue={
                        item in isAddContVisible &&
                        isAddContVisible[item].choosenTypeId
                          ? isAddContVisible[item].choosenTypeId.toString()
                          : ''
                      }
                      style={{ height: 50, width: 200 }}
                      onValueChange={text => {
                        console.log(isAddContVisible);
                        setIsAddContVisible({
                          ...isAddContVisible,
                          [item]: {
                            ...isAddContVisible[item],
                            choosenTypeId: text
                          }
                        });
                      }}
                    >
                      {item in isAddContVisible &&
                        'possibleTypesId' in isAddContVisible[item] &&
                        isAddContVisible[item].possibleTypesId.map(typeId => (
                          <Picker.Item
                            key={typeId}
                            label={contTypeDict.items[typeId].fullname}
                            value={typeId}
                          />
                        ))}
                    </Picker>

                    <Text>количество на площадке:</Text>
                    <TextInput
                      style={{
                        backgroundColor: 'lightyellow',
                        width: 50,
                        height: 20
                      }}
                      keyboardType='numeric'
                      placeholder='0'
                      placeholderTextColor='gray'
                      onChangeText={text => {
                        setIsAddContVisible({
                          ...isAddContVisible,
                          [item]: {
                            ...isAddContVisible[item],
                            count: text
                          }
                        });
                      }}
                      value={
                        item in isAddContVisible && isAddContVisible[item].count
                          ? isAddContVisible[item].count.toString()
                          : 0
                      }
                    />

                    <Text>загружено:</Text>
                    <TextInput
                      style={{
                        backgroundColor: 'lightyellow',
                        width: 50,
                        height: 20
                      }}
                      keyboardType='numeric'
                      placeholder='0'
                      placeholderTextColor='gray'
                      onChangeText={text => {
                        setIsAddContVisible({
                          ...isAddContVisible,
                          [item]: {
                            ...isAddContVisible[item],
                            loadedCount: text
                          }
                        });
                      }}
                      value={
                        item in isAddContVisible &&
                        isAddContVisible[item].loadedCount
                          ? isAddContVisible[item].loadedCount.toString()
                          : 0
                      }
                    />

                    <Button
                      title='добавить'
                      onPress={() => {
                        // setUniqueGarbageGen({
                        //   ...uniqueGarbageGen,
                        //   [item]: {
                        //     ...uniqueGarbageGen[item],
                        //     containers: {
                        //       ...uniqueGarbageGen[item].containers,
                        //       [isAddContVisible[item].type]: {
                        //         containerTypeId: isAddContVisible[item].type,
                        //         containersCount: isAddContVisible[item].count,
                        //         garbageGeneratorId: item,
                        //         loadedContainersCount:
                        //           isAddContVisible[item].loadedCount,
                        //         modify: 'added'
                        //       }
                        //     }
                        //   }
                        // });
                        //prettier-ignore
                        console.log(
                          {
                              containerTypeId: isAddContVisible[item].choosenTypeId,
                              containersCount: isAddContVisible[item].count,
                              garbageGeneratorId: item,
                              loadedContainersCount: isAddContVisible[item].loadedCount,
                              status: 'created'
                            }
                        )
                        //prettier-ignore
                        dispatch(
                          addJournalContainer(currentPlace.id, {
                            containerTypeId: isAddContVisible[item].choosenTypeId,
                            containersCount: isAddContVisible[item].count, //FIXME: fix null count to not assign
                            garbageGeneratorId: item,
                            loadedContainersCount: isAddContVisible[item].loadedCount,
                            status: 'created'
                          })
                        );
                      }}
                    />
                  </View>
                </View>

                {/**SECT: bulky waste line*/}
                {uniqueGarbageGen[item].bulkyWaste !== null &&
                  uniqueGarbageGen[item].bulkyWaste !== '0' &&
                  uniqueGarbageGen[item].bulkyWaste !== '' && (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        marginBottom: 10,
                        marginLeft: 12
                      }}
                    >
                      <Text>Объем КГО:</Text>
                      <TextInput
                        style={{
                          textAlign: 'center',
                          backgroundColor: '#fffbcc',
                          width: 30,
                          height: 20,
                          marginHorizontal: 5,
                          fontSize: 20
                        }}
                        keyboardType='numeric'
                        maxLength={6}
                        placeholderTextColor='gray'
                        onChangeText={text => {
                          dispatch(
                            addJournalBulky(currentPlace.id, {
                              value: text,
                              garbageGeneratorId: item
                            })
                          );
                        }}
                        value={
                          'bulkyWaste' in currentPlace &&
                          currentPlace.bulkyWaste.length &&
                          currentPlace.bulkyWaste.filter(
                            bulky => bulky.garbageGeneratorId === item
                          ).length &&
                          currentPlace.bulkyWaste
                            .filter(
                              bulky => bulky.garbageGeneratorId === item
                            )[0]
                            .value.toString()
                        }
                      />
                      <Text>м&#179;</Text>
                    </View>
                  )}

                {/**SECT: containers list for current garbage generator*/}
                {'containers' in uniqueGarbageGen[item] &&
                  Object.keys(uniqueGarbageGen[item].containers)
                    .sort()
                    .map(id => {
                      const currentContainer =
                        uniqueGarbageGen[item].containers[id];
                      if (currentContainer.deleted) return;
                      return (
                        <View
                          key={currentContainer.containerTypeId}
                          style={styles.containerTableRow}
                        >
                          {/**EL: container name and value*/}
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              paddingRight: 10,
                              maxWidth: '60%'
                              // backgroundColor: 'red'
                            }}
                          >
                            {/**BLOCK: delete container icon*/}
                            <TouchableOpacity
                              style={{
                                flex: 1,
                                maxWidth: '20%'
                                // backgroundColor: 'green'
                              }}
                              onPress={() => {
                                //prettier-ignore
                                dispatch(
                                updateJournalContainer(
                                  currentPlace.id, 
                                  {
                                    containerTypeId: currentContainer.containerTypeId,
                                    garbageGeneratorId: currentContainer.garbageGeneratorId,
                                    deleted: 1
                                  }
                                )
                              );
                              }}
                            >
                              <Feather
                                style={{ color: '#856666' }}
                                name='x-circle'
                                size={20}
                              />
                            </TouchableOpacity>

                            {/**BLOCK: short name and value*/}
                            <Text
                              style={{
                                fontSize: 16,
                                flex: 1,
                                maxWidth: '40%'
                              }}
                            >
                              {contTypeDict.items[id].shortname}
                            </Text>
                            <Text
                              style={{ fontSize: 16, flex: 1, maxWidth: '30%' }}
                            >
                              {contTypeDict.items[id].value} м&#179;
                            </Text>
                          </View>

                          {/**SECT: container input fields*/}
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',

                              maxWidth: '50%'
                              // backgroundColor: 'lightblue'
                            }}
                          >
                            {/**EL: containers count*/}
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center'
                                // backgroundColor: 'green'
                              }}
                            >
                              <Feather
                                onPress={() => {}}
                                style={{ color: 'gray', marginHorizontal: 2 }}
                                name='book-open'
                                size={17}
                              />

                              <TextInput
                                style={{
                                  backgroundColor: '#e7ffe0',
                                  borderBottomWidth: 1,
                                  borderColor: 'gray',
                                  ...styles.contCountInput
                                }}
                                keyboardType='numeric'
                                placeholder='0'
                                placeholderTextColor='gray'
                                onChangeText={text => {
                                  //prettier-ignore
                                  dispatch(
                                  updateJournalContainer(
                                    currentPlace.id, 
                                    {
                                      containerTypeId: currentContainer.containerTypeId,
                                      containersCount: text,
                                      garbageGeneratorId: currentContainer.garbageGeneratorId,
                                    }
                                  )
                                );
                                }}
                                value={currentContainer.containersCount.toString()}
                              />
                            </View>

                            {/**EL: containers loaded count*/}
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 10
                                // backgroundColor: 'blue'
                              }}
                            >
                              <Feather
                                onPress={() => {}}
                                style={{ color: 'gray', marginHorizontal: 2 }}
                                name='truck'
                                size={17}
                              />

                              <TextInput
                                style={{
                                  backgroundColor: '#fffbcc',
                                  borderBottomWidth: 1,
                                  borderColor: 'gray',
                                  ...styles.contCountInput
                                }}
                                keyboardType='numeric'
                                placeholderTextColor='gray'
                                onChangeText={text => {
                                  //prettier-ignore
                                  dispatch(
                                  updateJournalContainer(
                                    currentPlace.id, 
                                    {
                                      containerTypeId: currentContainer.containerTypeId,
                                      loadedContainersCount: text,
                                      garbageGeneratorId: currentContainer.garbageGeneratorId,
                                    }
                                  )
                                );
                                }}
                                value={
                                  'loadedContainersCount' in currentContainer &&
                                  currentContainer.loadedContainersCount.toString()
                                }
                              />
                            </View>
                          </View>
                        </View>
                      );
                    })}
                <Text></Text>
              </View>
            )}
          />
        </SafeAreaView>

        {/**SECT: modal add garbage generator */}
        <Modal animationType='fade' visible={addGarbGen.visible}>
          <View>
            <Text>Выберите клиента из списка или создайте нового.</Text>

            <Picker
              selectedValue={addGarbGen.chosenGarbageGenId}
              style={{ height: 50, width: 200 }}
              onValueChange={text => {
                setAddGarbGen({ ...addGarbGen, chosenGarbageGenId: text });
              }}
            >
              {Object.keys(garbageGenDict.items).map(garbageGenId => (
                <Picker.Item
                  key={garbageGenId}
                  label={garbageGenDict.items[garbageGenId].name}
                  value={garbageGenId}
                />
              ))}
            </Picker>

            <Button
              title='new'
              onPress={() => {
                setAddGarbGen({
                  ...addGarbGen,
                  newGarbageGenBlockVisible: !addGarbGen.newGarbageGenBlockVisible
                });
              }}
            />

            {/**EL: new garbage generator creating block */}
            <View
              style={{
                height: addGarbGen.newGarbageGenBlockVisible ? 300 : 0
              }}
            >
              {['name', 'inn', 'kpp', 'ogrn'].map(e => {
                let label = '';
                switch (e) {
                  case 'name':
                    label = 'Наименование';
                    break;
                  case 'inn':
                    label = 'ИНН';
                    break;
                  case 'kpp':
                    label = 'КПП';
                    break;
                  case 'ogrn':
                    label = 'ОГРН';
                    break;
                  default:
                    break;
                }

                return (
                  <View key={e} style={styles.addGarbageGViewTextInput}>
                    <Text>{label}</Text>
                    <TextInput
                      style={styles.addGarbageGTextInput}
                      onChangeText={text => {
                        setAddGarbGen({
                          ...addGarbGen,
                          newGarbageGen: {
                            ...addGarbGen.newGarbageGen,
                            [e]: text
                          }
                        });
                      }}
                      value={addGarbGen.newGarbageGen[e]}
                    ></TextInput>
                  </View>
                );
              })}
              <Button
                title='Добавить в справочник'
                onPress={() => {
                  dispatch(
                    updateCreatedGarbageGenDict(
                      'asdfsda32r',
                      addGarbGen.newGarbageGen
                    )
                  );
                }}
              />
            </View>

            <Button
              title='add'
              onPress={() => {
                setUniqueGarbageGen({
                  ...uniqueGarbageGen,
                  [addGarbGen.chosenGarbageGenId]: {
                    containers: {},
                    bulkyWaste: null
                  }
                });
              }}
            />
            <Button
              title='close'
              onPress={() => setAddGarbGen({ ...addGarbGen, visible: false })}
            />
          </View>
        </Modal>

        {/* <AddContainerModal
          visible={addContModal.visible}
          handleClose={() =>
            setAddContModal({
              ...addContModal,
              visible: false
            })
          }
          wayPointId={currentPlace.id}
          garbageGenId={addContModal.garbageGenId}
        />
        <AddBulkyModal
          visible={addBulkyModal.visible}
          handleClose={() =>
            setAddBulkyModal({
              ...addBulkyModal,
              visible: false
            })
          }
          wayPointId={currentPlace.id}
          garbageGenId={addBulkyModal.garbageGenId}
        /> */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '98%'
          }}
        >
          <Text style={{}}>всего загружено: {} шт.</Text>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              width: 50,
              height: 30
            }}
            onPress={() => {
              setAddGarbGen({ ...addGarbGen, visible: true });
            }}
          >
            <Feather name='user-plus' size={25} style={{}} />
          </TouchableOpacity>
        </View>
      </View>

      {/* PART: photo bar (only for container_place type) */}
      {poiDict.items[currentPlace.idPOI].type === 'container_place' && (
        <View
          style={{
            ...styles.collapseSectionContainer,
            height: isPhotoBarVisible ? 250 : 70
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsPhotoBarVisible(!isPhotoBarVisible);
            }}
            activeOpacity={0.7}
            style={styles.collapseSectionOuter}
          >
            <View style={styles.collapseSectionInner}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  maxWidth: '62%',
                  justifyContent: 'space-between'
                }}
              >
                <Text style={{ fontSize: 16, color: 'white' }}>
                  Контрольные фотографии
                </Text>
              </View>
              <Feather
                name={isPhotoBarVisible ? 'chevron-up' : 'chevron-down'}
                size={25}
                color='white'
              />
            </View>
          </TouchableOpacity>

          <SafeAreaView
            style={{
              height: isPhotoBarVisible ? 180 : 0
            }}
          >
            <FlatList
              horizontal={true}
              data={images}
              extraData={images}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <View
                  style={{
                    paddingTop: 10,
                    marginVertical: 5,
                    flex: 1,
                    alignItems: 'flex-end'
                  }}
                >
                  {/*                   <Text
                    style={{
                      zIndex: 999,
                      position: 'absolute',
                      width: 140,
                      height: 30,
                      borderWidth: 1,
                      fontSize: 13,
                      borderColor: 'red'
                    }}
                  >
                    {item}
                  </Text> */}
                  {/*                   <Button
                    title='save'
                    onPress={() => {
                      console.log('click');
                      MediaLibrary.saveToLibraryAsync(imagesDir + '/' + item);
                    }}
                  /> */}
                  <Image
                    source={{ uri: imagesDir + '/' + item }}
                    style={{
                      marginLeft: images.indexOf(item) === 0 ? 5 : 0,
                      marginRight: 5,
                      width: 150,
                      height: 150,
                      maxWidth: 150
                    }}
                  />
                  <Feather
                    onPress={() => {
                      FileSystem.deleteAsync(imagesDir + '/' + item);
                      setImages(images.filter(image => image !== item));
                    }}
                    style={{
                      marginLeft: images.indexOf(item) === 0 ? 5 : 0,
                      width: 25,
                      height: 25,
                      marginTop: -20,
                      marginLeft: -5,
                      color: '#ff4242',
                      backgroundColor: 'white',
                      borderRadius: 7
                    }}
                    name='x'
                    size={25}
                  />
                </View>
              )}
            />
          </SafeAreaView>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Text style={{ marginLeft: 5, marginTop: -10 }}>
              всего загружено: {images.length} шт.
            </Text>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                maxWidth: 120
              }}
            >
              <Feather
                onPress={() => _pickImage()}
                style={{ marginHorizontal: 15, width: 30, height: 30 }}
                name='image'
                size={27}
              />
              <Feather
                onPress={() => _takePhoto()}
                style={{
                  marginHorizontal: 15,
                  width: 30,
                  height: 30
                }}
                name='camera'
                size={27}
              />
            </View>
          </View>
        </View>
      )}

      {/*       <Button
        title='img size'
        onPress={() => {
          getImgSize();
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  containerTableRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 6
  },
  collapseSectionContainer: {
    width: '100%',
    marginBottom: 20,
    minHeight: 75,
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  collapseSectionOuter: {
    width: '100%',
    height: 35,
    borderRadius: 5
  },
  collapseSectionInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: 35,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#455A64'
  },
  contCountInput: {
    textAlign: 'center',
    marginHorizontal: 4,
    fontSize: 30,
    width: 50,
    height: 40,
    borderRadius: 7
  },
  addGarbageGViewTextInput: {
    flex: 1,
    height: 60
  },
  addGarbageGTextInput: {
    height: 40,
    backgroundColor: 'lightyellow'
  }
});

// prettier-ignore
// FIXME: Time formatting for showing in the screen
function timeStamp(dateMS) {
  const now = new Date(dateMS);

  const leadZero = (date) => {
    return date.toString().length === 1 ? '0' + date : date
  }

  const date = leadZero(now.getDate()) + '.' + leadZero((now.getMonth() + 1)) + '.' + now.getFullYear();
  const time = leadZero(now.getHours()) + ":" + leadZero(now.getMinutes());
  return time + ' - ' + date;
}

export default PlaceScreen;
