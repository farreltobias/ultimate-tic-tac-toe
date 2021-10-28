import { coordinates, Player } from '../types';
import Game from './Game';

class Major extends Game {
  private turn: Player;
  private minors: Game[][];
  private activeMinor: coordinates;

  constructor(coordinates: coordinates) {
    super();

    this.turn = 'O';
    this.activeMinor = coordinates;
    this.minors = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => new Game())
    );
  }

  public getActiveMinor = () => this.activeMinor;
  public getMinors = () => this.minors;
  public getTurn = () => this.turn;

  public play(coordinates: coordinates, { x: refX, y: refY }: coordinates) {
    const { x: minorX, y: minorY } = this.activeMinor;
    const { winner: currentWinner } = this.minors[minorX][minorY].getWinner();

    const [x, y] = currentWinner ? [refX, refY] : [minorX, minorY];

    const currentGame = this.minors[x][y];
    currentGame.markPosition(coordinates, this.turn);

    const { winner: minorWinner } = currentGame.getWinner();

    if (minorWinner) this.markPosition({ x, y }, minorWinner);

    this.activeMinor = coordinates;
    this.turn = this.turn === 'X' ? 'O' : 'X';

    return {
      winner: currentGame.getWinner(),
      activeMinor: this.activeMinor,
      turn: this.turn,
    };
  }
}

export default Major;
