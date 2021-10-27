import Game, { Position } from './Game';

interface PositionCoordinates {
  x: number;
  y: number;
}

class MajorGame extends Game {
  private minorGames: Game[][];
  private activeMinorGame: PositionCoordinates;
  private minorTurns: number;

  constructor() {
    super();

    this.minorGames = [];
    this.minorTurns = 0;
    this.activeMinorGame = {} as PositionCoordinates;

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        this.minorGames[x][y] = new Game();
      }
    }
  }

  private playOnMinorGame(x: number, y: number, minorY: number, minorX: number, letter?: Position) {    
    const currentGame = this.minorGames[minorX][minorY];
    
    currentGame.markPosition(x, y, letter);
    
    if (currentGame.winner) {
      this.markPosition(x, y);
    }
  }

  public play(x: number, y: number, game?: PositionCoordinates) {
    const letterToPlay = this.minorTurns % 2 ? 'X' : 'O';
    const { x: minorX, y: minorY } = this.activeMinorGame;

    if (!minorX && !minorY) {
      if (!game)
        return;

      this.activeMinorGame = game;

      this.playOnMinorGame(x, y, game.y, game.x, letterToPlay);

      return;
    }

    const currentGame = this.minorGames[minorX][minorY];

    if (game && currentGame.winner) {
      this.activeMinorGame = game;

      this.playOnMinorGame(x, y, minorY, minorX, letterToPlay);

      return;
    }

    if (!currentGame.winner) {
      this.playOnMinorGame(x, y, minorY, minorX);
    }
  }
}

export default MajorGame;