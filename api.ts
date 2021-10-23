import { IMajor, IMinor, IRound, player, status } from './types';

// @adrianoapj, ta tudo randomico isso, muda pls hehe

const getValues = () => {
  const round: IRound = {
    position: [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)],
    player: 'X',
  };

  const minors: IMinor[] = [...Array(9).keys()].map((index) => ({
    positions: [...Array(3).keys()].map(() =>
      [...Array(3).keys()].map(
        () => ['', 'X', 'O'][Math.floor(Math.random() * 3)]
      )
    ) as player[][],
    status: ['', 'X', 'O', 'D'][Math.floor(Math.random() * 4)] as status,
  }));

  const major: IMajor = {
    positions: [
      [...minors.slice(0,3).map(({ status }) => status)],
      [...minors.slice(3,6).map(({ status }) => status)],
      [...minors.slice(6,9).map(({ status }) => status)],
    ],
    minors,
    status: '',
  };
  

  return { major, round };
};

export { getValues };
