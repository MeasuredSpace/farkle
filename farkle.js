class HelloFarkleFact {
  constructor(dateTime) {
    this.helloTime = dateTime;
  }
}

class GameStartedFact {
  constructor(playerCount) {
    this.playerCount = playerCount < 0 ? 1 : playerCount;
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
  constructor(pointsBanked) {
    this.pointsBanked = pointsBanked < 0 ? 0 : pointsBanked;
  }
}

class GameEndedFact {
  constructor(winner, finalScore) {
    this.winner = winner;
    this.finalScore = finalScore;
  }
}

function CalculateScore(dice) {
    if (!Array.isArray(dice) || dice.length < 1 || dice.length > 6) {
      return 0;
    }

    let score = 0;
    const counts = {};
    for (const num of dice) {
      if (counts[num]) {
        counts[num] += 1;
      } else {
        counts[num] = 1;
      }
    }

    // Function to remove counted dice
    const removeCountedDice = (number, countToRemove) => {
      counts[number] -= countToRemove;
      if (counts[number] <= 0) {
        delete counts[number];
      }
    };

    // Check for six of any number
    for (const number in counts) {
      if (counts[number] === 6) {
        removeCountedDice(number, 6);
        score += 3000;
        break; // Ensure no further checks if this condition is met
      }
    }

    // Check for five of any number
    for (const number in counts) {
      if (counts[number] === 5) {
        removeCountedDice(number, 5);
        score += 2000;
        break; // Ensure no further checks if this condition is met
      }
    }

    // Check for four of any number
    for (const number in counts) {
      if (counts[number] === 4) {
        removeCountedDice(number, 4);
        score += 1000;
        break; // Ensure no further checks if this condition is met
      }
    }

    // Check for three pairs
    if (Object.values(counts).filter(count => count === 2).length === 3) {
      Object.keys(counts).forEach(number => removeCountedDice(number, 2));
      score += 1500;
    } else if (Object.keys(counts).length === 6) { // Ensure this check only runs if the previous condition wasn't met
      // Check for one of every number from 1 to 6
      Object.keys(counts).forEach(number => removeCountedDice(number, 1));
      score += 2500;
    }

    // Calculate score for three of any number
    Object.keys(counts).forEach(number => {
      if (counts[number] === 3) {
        score += number === '1' ? 1000 : number * 100;
        removeCountedDice(number, 3);
      }
    });

    // Calculate score for extra 1s
    if (counts['1']) {
      score += counts['1'] * 100;
      removeCountedDice('1', counts['1']);
    }

    // Calculate score for extra 5s
    if (counts['5']) {
      score += counts['5'] * 50;
      removeCountedDice('5', counts['5']);
    }

    if(Object.keys(counts).length > 0) {
      return 0;
    }

    return score;
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
  RollGeneratedFact,
  GameStartedFact, 
  HelloFarkleFact,
  IsInGame,
  GetLastGameStartedIndex,
  GetLastTurnEndedsSinceLastGameStart,
  GetCurrentPlayer
};
