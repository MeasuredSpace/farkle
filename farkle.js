export class HelloFarkleFact {
  constructor(dateTime) {
    this.helloTime = dateTime;
  }
}

export class GameStartedFact {
  constructor(playerCount) {
    this.playerCount = playerCount;
  }
}

export class RollGeneratedFact {
  constructor(diceValues) {
    this.diceValues = Array.isArray(diceValues) ? diceValues : [];
  }
}

export class DiePickedFact {
  constructor(dieIndex, fromRoll) {
    this.dieIndex = dieIndex;
    this.fromRoll = fromRoll;
  }
}

export class LuckTriedFact {
  constructor(diceRolled, meldKept) {
    this.diceRolled = Array.isArray(diceRolled) ? diceRolled : [];
    this.meldKept = Array.isArray(meldKept) ? meldKept : [];
  }
}

export class TurnEndedFact {
  constructor(bankedPoints) {
    this.bankedPoints = bankedPoints === true;
  }
}

export class GameEndedFact {
  constructor(winner, finalScore) {
    this.winner = winner;
    this.finalScore = finalScore;
  }
}

export class Dice {
  constructor(roll) {
    this.roll = Array.isArray(roll) ? roll : [];
    this.scorableDice = [];
    this.unscorableDice = [];
    this.score = 0;
  }
}

export function CalculateScore(diceToScore) {
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

export function GenerateRoll(diceCount) {
  const rollResults = [];
  for (let i = 0; i < diceCount; i++) {
    rollResults.push(Math.floor(Math.random() * 6) + 1);
  }
  return rollResults;
}

export function IsInGame(events) {
  let inGame = false;  
  if (events && events.length > 0) {
    const lastGameStartedIndex = GetLastGameStartedIndex(events);
    const lastGameEndedIndex = GetLastGameEndedIndex(events);
    if (lastGameStartedIndex !== -1) {
      inGame = lastGameStartedIndex > lastGameEndedIndex;
    } else {
      inGame = false;
    }
  }
  return inGame;
}   

export function GetLastGameStartedIndex(events) {
  return events.map(event => event.constructor.name).lastIndexOf('GameStartedFact');
}

export function GetLastGameEndedIndex(events) {
  return events.map(event => event.constructor.name).lastIndexOf('GameEndedFact');
}

export function GetLastTurnEndedIndex(events) {
  return events
    .filter(event => event.constructor.name === 'LuckTriedFact' && event.turnEnded)
    .map(event => event.constructor.name).lastIndexOf('LuckTriedFact');
}

export function GetTurnEndedCountSinceLastGameStart(events) {
  const lastGameStartedIndex = GetLastGameStartedIndex(events);
  let turnEndedCount = 0;
  turnEndedCount += events.slice(lastGameStartedIndex + 1).filter(event => event.constructor.name === 'TurnEndedFact').length;
  return turnEndedCount;
}

export function GetCurrentPlayer(playerCount, events) {
  const lastGameStartedIndex = GetLastGameStartedIndex(events);
  const turnEndedCount = events.slice(lastGameStartedIndex + 1).filter(event => event.constructor.name === 'TurnEndedFact').length;
  return (turnEndedCount % playerCount) + 1;
}

export function GetPlayersLuckTriedFacts(playerCount, events) {
  const playersLuckTriedFacts = Array.from({ length: playerCount }, () => []);
  events.forEach(event => {
    if (event.constructor.name === 'LuckTriedFact') {
      const currentPlayer = GetCurrentPlayer(playerCount, events.slice(0, events.indexOf(event) + 1));
      playersLuckTriedFacts[currentPlayer - 1].push(event);
    }
  });
  return playersLuckTriedFacts;
}

export function GetPlayerScores(playerCount, events) {
  let scores = new Array(playerCount).fill(0);
  let currentPlayer = 0;
  let gameActive = false;

  events.forEach(event => {
    if (event.constructor.name === 'GameStartedFact') {
      // Reset for a new game
      if (!gameActive) {
        scores = new Array(playerCount).fill(0); // Reset scores if starting a new game
        currentPlayer = 0; // Reset to the first player
        gameActive = true;
      }
    } else if (event.constructor.name === 'GameEndedFact') {
      gameActive = false; // Mark the current game as ended
    } else if (gameActive && event.constructor.name === 'TurnEndedFact') {
      currentPlayer = (currentPlayer + 1) % playerCount; // Move to the next player
    } else if (gameActive && event.constructor.name === 'LuckTriedFact') {
      // Assuming a function to calculate score based on dice from a LuckTriedFact
      let scoreToAdd = CalculateScore(event.meldKept).score;
      scores[currentPlayer] += scoreToAdd;
    }
  });

  return scores;
}




