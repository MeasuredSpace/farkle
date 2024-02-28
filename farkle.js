function GameStartedEvent(playerCount) {
  var _playerCount = playerCount < 0 ? 1 : playerCount;

  this.getPlayerCount = function() {
    return _playerCount;
  };
}

function DiceRolledEvent(diceRoll) {
  var _diceRoll = diceRoll;

  this.getDiceRoll = function() {
    return _diceRoll;
  };
}

function DicePickedEvent(dice) {
  var _dice = Array.isArray(dice) && dice.length >= 1 ? dice : [];
  
  this.getDice = function() {
    return _dice.filter(Number.isInteger);
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

module.exports.CalculateScore = CalculateScore;
module.exports.GameStartedEvent = GameStartedEvent;
module.exports.DiceRolledEvent = DiceRolledEvent;
module.exports.DicePickedEvent = DicePickedEvent;