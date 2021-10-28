import 'react-native-get-random-values';

import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { v4 as uuid } from 'uuid';
import { Audio } from 'expo-av';

import { Entypo, Ionicons, FontAwesome } from '@expo/vector-icons';

import { Text, View } from '../components/Themed';
import { IMajorProps, IMinorProps } from '../types';
import useDimentions from '../hooks/useDimentions';
import Major from '../classes/Major';

export default function TabOneScreen() {
  const [{ major }, setMajor] = useState({ major: new Major({ x: 0, y: 0 }) });

  if (major.getWinner().winner) {
    if (major.getWinner().winner !== 'D')
      Alert.alert(
        'Congratulations!',
        `player ${major.getWinner().winner} won the game!`
      );
    else Alert.alert('Wow!', `The game resulted in a draw!`);
  }

  return (
    <View style={styles.body}>
      <TouchableOpacity
        onPress={() => setMajor(() => ({ major: new Major({ x: 0, y: 0 }) }))}
        style={styles.restart}
      >
        <FontAwesome name="refresh" size={24} color="#C8CAD9" />
        <Text style={{ marginLeft: 10, ...styles.title }}>Start over</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <FlatList
          data={major.getPositions().flat()}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 10,
          }}
          listKey={uuid()}
          keyExtractor={(_, index) => index.toString()}
          numColumns={3}
          renderItem={({ index }) => (
            <MajorViews major={major} index={index} setMajor={setMajor} />
          )}
        />
      </View>
      <View
        style={{
          marginTop: 32,
          width: '50%',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FontAwesome
            name="circle-o"
            size={750 * 0.07}
            style={{ padding: 12 }}
            color={major.getTurn() === 'O' ? '#5C68D3' : '#2B2C3E'}
          />
          <Ionicons
            name="md-close"
            size={750 * 0.09}
            color={major.getTurn() === 'X' ? '#FA212A' : '#2B2C3E'}
          />
        </View>
        <View
          style={{
            height: 5,
            width: '35.5%',
            backgroundColor: '#515677',
            borderRadius: 5,
            ...(major.getTurn() === 'X'
              ? { marginLeft: 'auto' }
              : { marginRight: 'auto' }),
          }}
        />
      </View>
    </View>
  );
}

const MajorViews: React.FC<IMajorProps> = ({ major, index, setMajor }) => {
  const [dimention] = useDimentions('width');
  const vw = dimention as number;

  const { x: line, y: col } = major.getActiveMinor();

  const minors = major.getMinors().flat();
  const { winner } = minors[index].getWinner();

  const majorStatus = major.getPositions().flat()[index];

  const roundPos = 3 * line + col;
  const showAllDots = minors.some(
    (minor, idx) => minor.getWinner().winner && idx === roundPos
  );

  const showDots = showAllDots
    ? roundPos !== index && !winner
    : roundPos === index;

  return (
    <View style={[...getStyle(index)]}>
      {!!winner && (
        <View
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 1,
            backgroundColor: 'transparent',
          }}
        >
          {majorStatus === 'X' ? (
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="md-close"
                size={vw * 0.335}
                color="#FA212A"
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
              />
            </View>
          ) : (
            majorStatus === 'O' && (
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <FontAwesome
                  name="circle-o"
                  size={vw * 0.275}
                  color="#5C68D3"
                  style={{ marginLeft: 'auto', marginRight: 'auto' }}
                />
              </View>
            )
          )}
        </View>
      )}
      <FlatList
        data={minors[index].getPositions().flat()}
        listKey={uuid()}
        keyExtractor={(_, index) => index.toString()}
        style={{ padding: 5 }}
        numColumns={3}
        renderItem={({ item, index: idx }) => (
          <MinorViews
            reference={index}
            winner={winner}
            showDots={showDots}
            item={item}
            index={idx}
            major={major}
            setMajor={setMajor}
          />
        )}
      />
    </View>
  );
};

const MinorViews: React.FC<IMinorProps> = ({
  item,
  index,
  showDots,
  winner,
  major,
  setMajor,
  reference,
}) => {
  const [dimention] = useDimentions('width');
  const vw = dimention as number;

  const [sound, setSound] = useState<Audio.Sound>();

  const handlePlacement = async (
    major: Major,
    setMajor: React.Dispatch<React.SetStateAction<{ major: Major }>>,
    reference: number,
    index: number
  ) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/pop.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (e) {
      console.warn(e);
      await sound?.unloadAsync();
    }

    major.play(
      { x: Math.floor(index / 3), y: index % 3 },
      { x: Math.floor(reference / 3), y: reference % 3 }
    );

    setMajor((prev) => {
      const aux = Object.assign({}, { major: prev.major });
      aux.major = major;
      return aux;
    });
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={[...getStyle(index), styles.box, { height: 0.09 * vw }]}>
      {item ? (
        item === 'X' ? (
          <Ionicons
            name="md-close"
            size={vw * 0.09}
            color={!winner ? '#FA212A' : '#2B2C3E'}
          />
        ) : (
          item === 'O' && (
            <FontAwesome
              name="circle-o"
              size={vw * 0.07}
              color={!winner ? '#5C68D3' : '#2B2C3E'}
            />
          )
        )
      ) : (
        showDots &&
        !major.getWinner().winner && (
          <Entypo
            name="dot-single"
            size={24}
            color={major.getTurn() === 'O' ? '#5C68D3' : '#FA212A'}
            onPress={() => handlePlacement(major, setMajor, reference, index)}
          />
        )
      )}
    </View>
  );
};

// Não me julgue
const getStyle = (index: number) => {
  const { border, vertical, horizontal } = styles;

  if ([1, 7].includes(index)) return [border, vertical];

  if ([3, 5].includes(index)) return [border, horizontal];

  if (index === 4) return [border, horizontal, vertical];

  return [border];
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    flexGrow: 1,
    flexBasis: 0,
    borderStyle: 'solid',
    borderColor: '#C8CAD9',
  },
  vertical: {
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  horizontal: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  box: {
    borderColor: '#2C2E40',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  restart: {
    marginBottom: 48,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1
  },
});
