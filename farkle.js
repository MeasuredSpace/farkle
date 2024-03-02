function HelloFarkleFact(dateTime) {
  var _helloTime = dateTime;

  this.getHelloTime = function() {
    return _helloTime;
  };
}

function GameStartedFact(playerCount) {
  var _playerCount = playerCount < 0 ? 1 : playerCount;

  this.getPlayerCount = function() {
    return _playerCount;
  };
}

function DiceRolledFact(diceRoll) {
  var _diceRoll = diceRoll;

  this.getDiceRoll = function() {
    return _diceRoll;
  };
}

function DicePickedFact(dice) {
  var _dice = Array.isArray(dice) && dice.length >= 1 ? dice : [];
  
  this.getDice = function() {
    return _dice.filter(Number.isInteger);
  };
}

function TurnEndedFact(rolePoints) {
  var _rolePoints = rolePoints;

  this.getRolePoints = function() {
    return _rolePoints < 0 ? 0 : _rolePoints;
  };
}

function GameEndedFact(winner, finalScore) {
  var _winner = winner;
  var _finalScore = finalScore;

  this.getWinner = function() {
    return _winner;
  };

  this.getFinalScore = function() {
    return _finalScore;
  };
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

    return score;
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
  GameEndedFact, 
  TurnEndedFact, 
  DicePickedFact, 
  DiceRolledFact, 
  GameStartedFact, 
  HelloFarkleFact,
  IsInGame,
  GetLastGameStartedIndex,
  GetLastTurnEndedsSinceLastGameStart,
  GetCurrentPlayer
};
