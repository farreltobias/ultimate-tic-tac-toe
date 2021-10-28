import {
  coordinates,
  IWinner,
  Outcome,
  Player,
  winningConditions,
} from '../types';

class Game {
  private plays: number;
  private winner: IWinner;
  private positions: Outcome[][];

  constructor() {
    this.plays = 0;
    this.winner = { winner: undefined, index: -1 };
    this.positions = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => '' as Outcome)
    );
  }

  public markPosition({ x, y }: coordinates, outcome: Outcome): void {
    this.positions[x][y] = outcome;
    this.plays++;

    this.defineWinner();
  }

  private checkPosition(x: number, y: number, letter: string) {
    return this.positions[x][y] === letter;
  }

  private checkIfWinner = (letter: Player) =>
    winningConditions.reduce(
      (acc, condition, index) => {
        const isWinner = condition.every(([x, y]) =>
          this.checkPosition(x, y, letter)
        );

        if (isWinner) return { isWinner, index };

        return acc;
      },
      { isWinner: false, index: -1 }
    );

  public getWinner = () => this.winner;

  public getPlays = () => this.plays;
  protected addPlays = () => {
    this.plays++;
  };

  public getPositions = () => this.positions;

  public defineWinner() {
    const isDraw = this.plays === 9;

    const { winner, index } = ['O', 'X'].reduce(
      (acc, letter) => {
        const { isWinner, index } = this.checkIfWinner(letter as Player);
        if (isWinner) return { winner: letter as Outcome, index };
        return acc;
      },
      { winner: undefined as Outcome | undefined, index: -1 }
    );

    this.winner = { winner: winner ? winner : isDraw ? 'D' : undefined, index };
  }
}

export default Game;
