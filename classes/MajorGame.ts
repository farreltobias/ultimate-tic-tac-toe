import Game from './Game';

interface PositionCoordinates {
  x: number;
  y: number;
}

class MajorGame extends Game {
  private minorGames: Game[][];
  private activeMinorGame: PositionCoordinates;

  constructor() {
    super();

    this.minorGames = [];
    this.activeMinorGame = {} as PositionCoordinates;

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        this.minorGames[x][y] = new Game();
      }
    }
  }

  public play(x: number, y: number, game?: PositionCoordinates) {
    const { x: minorX, y: minorY } = this.activeMinorGame;

    const currentGame = this.minorGames[minorX][minorY];

    if (!game && (!minorX && !minorY))
      return;

    if (game) {
      if (currentGame.winner) {
        this.activeMinorGame = game;
      }
    }

    if (!currentGame.winner) {
      this.minorGames[minorX][minorY].markPosition(x, y);

      if (currentGame.winner) {
        this.markPosition(minorX, minorY);
      }
    }
  }
}

export default MajorGame;