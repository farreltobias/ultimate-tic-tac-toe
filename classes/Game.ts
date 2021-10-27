const winningConditions = [
  [
    [0, 0],
    [0, 1],
    [0, 2]
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2]
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2]
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0]
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1]
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2]
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2]
  ],
  [
    [0, 2],
    [1, 1],
    [3, 1]
  ]
];

export type Position = 'O' | 'X' | 'D';

class Game {
  winner?: Position;
  private firstTurn?: Position;
  private positions: Position[][];
  private turns: number;

  constructor() {
    this.turns = 0;
    this.positions = [];

    for (let x = 0; x < 3; x++) {
      this.positions[x] = [];
      for (let y = 0; y < 3; y++) {
        this.positions[x][y] = '' as Position;
      }
    }
  }

  public markPosition(x: number, y: number, letter?: Position): void {
    if (letter) {
      this.positions[x][y] = letter;
      this.turns++;

      this.firstTurn = this.firstTurn ? this.firstTurn : letter;

      this.defineWinner();

      return;
    }

    if (this.positions[x][y])
      return;

    this.positions[x][y] = this.turns % 2 ? this.firstTurn === 'X' ? 'O' : 'X' : 'X';
    this.turns++;

    this.defineWinner();
  }

  private checkPosition(x: number, y: number, letter: string) {
    return this.positions[x][y] === letter;
  }

  private isLetterAWinner(letter: string) {
    let isWinner = false;
    let winningCondition = -1;

    winningConditions.forEach((condition, index) => {
      let isConditionValid = true;
      
      condition.forEach(position => {
        const [x, y] = position;
        if (!this.checkPosition(x, y, letter))
          isConditionValid = false;
      });

      if (isConditionValid) {
        isWinner = true;
        winningCondition = index;
      }
    });

    return {isWinner, winningCondition};
  }

  public getWinner() {
    return this.winner;
  }

  public defineWinner() {
    let winner: 'O' | 'X' | '' = '';

    for (let i = 0; i < 2; i++) {
      const letter = i ? 'O' : 'X';

      this.isLetterAWinner(letter) && (winner = letter);
    }

    this.winner = winner ? winner : this.turns === 9 ? 'D' : undefined;
  }
}

export default Game;