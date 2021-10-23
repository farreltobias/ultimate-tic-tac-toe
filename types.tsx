/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  TabOne: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type status = '' | 'X' | 'O' | 'D';
export type player = 'X' | 'O' | '';

export interface IMinor {
  positions: player[][];
  status: status;
}

export interface IMajor {
  positions: status[][];
  status: '' | 'X' | 'O';
  minors: IMinor[];
}

export interface IRound {
  position: number[];
  player: player;
}

export interface IMajorProps {
  major: IMajor;
  index: number;
  round: IRound;
}
export interface IMinorProps {
  item: string;
  index: number;
  showDots: boolean;
  status: status;
}
