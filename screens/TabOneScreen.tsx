import 'react-native-get-random-values';

import React, { createRef, useEffect, useState } from 'react';
import { StyleSheet, FlatList, View as ReactView } from 'react-native';
import { v4 as uuid } from 'uuid';

import { Entypo, Ionicons, FontAwesome } from '@expo/vector-icons';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { IMajorProps, IMinorProps, RootTabScreenProps } from '../types';
import useDimentions from '../hooks/useDimentions';
import { getValues } from '../api';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const { major, round } = getValues();

  return (
    <View style={styles.container}>
      <FlatList
        data={major.positions.flat()}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 10,
        }}
        listKey={uuid()}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        renderItem={({ index }) => (
          <MajorViews major={major} index={index} round={round} />
        )}
      />
    </View>
  );
}

const MajorViews: React.FC<IMajorProps> = ({ major, index, round }) => {
  const [dimention] = useDimentions('width');
  const vw = dimention as number;

  const {
    position: [line, col],
  } = round;

  const { minors } = major;
  const { status } = minors[index];

  const majorStatus = major.positions.flat()[index];

  const roundPos = 3 * line + col;
  const showAllDots = minors.some(
    ({ status }, idx) => status && idx === roundPos
  );

  const showDots = showAllDots
    ? roundPos !== index && !status
    : roundPos === index;

  return (
    <View style={[...getStyle(index)]}>
      {!!status && (
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
        data={minors[index].positions.flat()}
        listKey={uuid()}
        keyExtractor={(_, index) => index.toString()}
        style={{ padding: 5 }}
        numColumns={3}
        renderItem={({ item, index: idx }) => (
          <MinorViews
            status={status}
            showDots={showDots}
            item={item}
            index={idx}
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
  status,
}) => {
  const [dimention] = useDimentions('width');
  const vw = dimention as number;

  return (
    <View style={[...getStyle(index), styles.box, { height: 0.09 * vw }]}>
      {item ? (
        item === 'X' ? (
          <Ionicons
            name="md-close"
            size={vw * 0.09}
            color={!status ? '#FA212A' : '#2B2C3E'}
          />
        ) : (
          item === 'O' && (
            <FontAwesome
              name="circle-o"
              size={vw * 0.07}
              color={!status ? '#5C68D3' : '#2B2C3E'}
            />
          )
        )
      ) : (
        showDots && (
          <Entypo
            name="dot-single"
            size={24}
            color="#888EB6"
            onPress={handlePlacement}
          />
        )
      )}
    </View>
  );
};

const handlePlacement = () => {
  alert('Yay');
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
  container: {
    flex: 1,
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
  separator: {
    // flex: 1,
    // backgroundColor: '#fff'
  },
});
