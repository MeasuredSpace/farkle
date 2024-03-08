class HelloFarkleFact {
  constructor(dateTime) {
    this.helloTime = dateTime;
  }
}

class GameStartedFact {
  constructor(playerCount) {
    this.playerCount = playerCount;
  }
}

class DiceRolledFact {
  constructor(numberOfDice) {
    this.numberOfDice = numberOfDice;
  }
}

class RollGeneratedFact {
  constructor(diceValues) {
    this.diceValues = Array.isArray(diceValues) ? diceValues : [];
  }
}

class DiePickedFact {
  constructor(dieIndex, fromRoll) {
    this.dieIndex = dieIndex;
    this.fromRoll = fromRoll;
  }
}

class TurnEndedFact {
  constructor(pointsBanked, player) {
    this.pointsBanked = pointsBanked < 0 ? 0 : pointsBanked;
    this.player = player;
  }
}

class FarkleFact {
    constructor() {
        this.farkle = true;
    }
}

class GameEndedFact {
  constructor(winner, finalScore) {
    this.winner = winner;
    this.finalScore = finalScore;
  }
}
class HotDiceFact {
  constructor() {
    this.hotDice = true;
  }
}

class Dice {
  constructor(roll) {
    this.roll = Array.isArray(roll) ? roll : [];
    this.scorableDice = [];
    this.unscorableDice = [];
    this.score = 0;
  }
}

function CalculateScore(diceToScore) {
    let dice = new Dice(diceToScore);
    if (!Array.isArray(dice.roll) || dice.roll.length < 1 || dice.roll.length > 6) {
      dice.score = 0;
      return dice;
    }

    const countsOfNumber = {};
    for (const num of dice.roll) {
      if (countsOfNumber[num]) {
        countsOfNumber[num] += 1;
      } else {
        countsOfNumber[num] = 1;
      }
    }

    // Function to remove counted dice
    const removeCountedDice = (number, howManyToRemove) => {
      countsOfNumber[number] -= howManyToRemove;
      if (countsOfNumber[number] <= 0) {
        delete countsOfNumber[number];
      } else {
        dice.unscorableDice.push(...Array(howManyToRemove).fill(parseInt(number)));
      }
    };

    // Check for six of any number
    for (const number in countsOfNumber) {
      if (countsOfNumber[number] === 6) {
        removeCountedDice(number, 6);
        dice.score += 3000;
        dice.scorableDice.push(...Array(6).fill(parseInt(number)));
        break; // Ensure no further checks if this condition is met
      }
    }

    // Check for five of any number
    for (const number in countsOfNumber) {
      if (countsOfNumber[number] === 5) {
        removeCountedDice(number, 5);
        dice.score += 2000;
        dice.scorableDice.push(...Array(5).fill(parseInt(number)));
        break; // Ensure no further checks if this condition is met
      }
    }

    // Check for four of any number
    for (const number in countsOfNumber) {
      if (countsOfNumber[number] === 4) {
        removeCountedDice(number, 4);
        dice.score += 1000;
        dice.scorableDice.push(...Array(4).fill(parseInt(number)));
        break; // Ensure no further checks if this condition is met
      }
    }

    // Check for three pairs
    if (Object.values(countsOfNumber).filter(count => count === 2).length === 3) {
      Object.keys(countsOfNumber).forEach(number => {
        removeCountedDice(number, 2);
        dice.scorableDice.push(...Array(2).fill(parseInt(number)));
      });
      dice.score += 1500;
    } else if (Object.keys(countsOfNumber).length === 6) { // Ensure this check only runs if the previous condition wasn't met
      // Check for one of every number from 1 to 6
      Object.keys(countsOfNumber).forEach(number => {
        removeCountedDice(number, 1);
        dice.scorableDice.push(parseInt(number));
      });
      dice.score += 2500;
    }

    // Calculate score for three of any number
    Object.keys(countsOfNumber).forEach(number => {
      if (countsOfNumber[number] === 3) {
        dice.score += number === '1' ? 1000 : parseInt(number) * 100;
        removeCountedDice(number, 3);
        dice.scorableDice.push(...Array(3).fill(parseInt(number)));
      }
    });

    // Calculate score for extra 1s
    if (countsOfNumber['1']) {
      dice.score += countsOfNumber['1'] * 100;
      removeCountedDice('1', countsOfNumber['1']);
      dice.scorableDice.push(...Array(countsOfNumber['1']).fill(1));
    }

    // Calculate score for extra 5s
    if (countsOfNumber['5']) {
      dice.score += countsOfNumber['5'] * 50;
      removeCountedDice('5', countsOfNumber['5']);
      dice.scorableDice.push(...Array(countsOfNumber['5']).fill(5));
    }

    if(Object.keys(countsOfNumber).length > 0) {
      dice.unscorableDice.push(...Object.keys(countsOfNumber).map(num => parseInt(num)));
    }

    return dice;
}

function GenerateRoll(diceCount) {
  const rollResults = [];
  for (let i = 0; i < diceCount; i++) {
    rollResults.push(Math.floor(Math.random() * 6) + 1);
  }
  return rollResults;
}

function IsInGame(events) {
  const inGame =
      events 
      && events.length > 0 
      && (events[events.length - 1].constructor.name !== "GameEndedFact")
      && (events[events.length - 1].constructor.name !== "HelloFarkleFact");

  return inGame;
}

function GetLastGameStartedIndex(events) {
  return events.map(event => event.constructor.name).lastIndexOf('GameStartedFact');
}

function GetLastTurnEndedsSinceLastGameStart(events) {
  const startIndex = GetLastGameStartedIndex(events);
  if (startIndex === -1) return 0;
  const eventsSinceLastGameStart = events.slice(startIndex + 1); // Adjust to not include the game start event itself
  const turnEndedsSinceLastGameStart = eventsSinceLastGameStart.filter(event => event.constructor.name === 'TurnEndedFact');
  return turnEndedsSinceLastGameStart.length;
}

function GetCurrentPlayer(playerCount, events) {
  return (GetLastTurnEndedsSinceLastGameStart(events) % playerCount) + 1;
}

export { 
  CalculateScore, 
  GenerateRoll,
  GameEndedFact, 
  TurnEndedFact, 
  DiePickedFact, 
  DiceRolledFact,
  FarkleFact,
  HotDiceFact,
  RollGeneratedFact,
  GameStartedFact, 
  HelloFarkleFact,
  IsInGame,
  GetLastGameStartedIndex,
  GetLastTurnEndedsSinceLastGameStart,
  GetCurrentPlayer
};
