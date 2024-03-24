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
  constructor(diceRolled, meldKept, turnEnded) {
    this.diceRolled = Array.isArray(diceRolled) ? diceRolled : [];
    this.meldKept = Array.isArray(meldKept) ? meldKept : [];
    this.turnEnded = turnEnded;
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

export function GenerateRoll(diceCount) {
  const rollResults = [];
  for (let i = 0; i < diceCount; i++) {
    rollResults.push(Math.floor(Math.random() * 6) + 1);
  }
  return rollResults;
}

export function IsInGame(facts) {
  let inGame = false;  
  if (facts && facts.length > 0) {
    const lastGameStartedIndex = GetLastGameStartedIndex(facts);
    const lastGameEndedIndex = GetLastGameEndedIndex(facts);
    if (lastGameStartedIndex !== -1) {
      inGame = lastGameStartedIndex > lastGameEndedIndex;
    } else {
      inGame = false;
    }
  }
  return inGame;
}   

export function GetLastGameStartedIndex(facts) {
  return facts.map(event => event.constructor.name).lastIndexOf('GameStartedFact');
}

export function GetLastGameEndedIndex(facts) {
  return facts.map(event => event.constructor.name).lastIndexOf('GameEndedFact');
}

export function GetLastGameStartedPlayerCount(facts) {
  const lastGameStartedIndex = GetLastGameStartedIndex(facts);
  if (lastGameStartedIndex !== -1) {
    const lastGameStartedFact = facts[lastGameStartedIndex];
    return lastGameStartedFact.playerCount;
  }
  return null; // or appropriate default/fallback value, such as 0 or undefined, depending on further usage
}

export function GetLastTurnEndedIndex(facts) {
  return facts
    .filter(event => event.constructor.name === 'LuckTriedFact' && event.turnEnded)
    .map(event => event.constructor.name).lastIndexOf('LuckTriedFact');
}

export function GetTurnEndedCountSinceLastGameStart(facts) {
  // Find the index of the last GameStartedFact event to consider only events after this.
  const lastGameStartedIndex = facts.reduce((lastIndex, event, index) => 
    event.constructor.name === 'GameStartedFact' ? index : lastIndex, -1);

  // Filter and count LuckTriedFacts where turnEnded is true, occurring after the last GameStartedFact.
  const turnEndedCount = facts.slice(lastGameStartedIndex + 1).reduce((count, event) => 
    event.constructor.name === 'LuckTriedFact' && event.turnEnded ? count + 1 : count, 0);

  return turnEndedCount;
}

export function GetCurrentPlayer(playerCount, facts) {
  const lastGameStartedIndex = GetLastGameStartedIndex(facts);
  const turnEndedCount = facts.slice(lastGameStartedIndex + 1).filter(event => event.constructor.name === 'LuckTriedFact' && event.turnEnded).length;
  return (turnEndedCount % playerCount) + 1;
}

export function GetPlayersLuckTriedFacts(playerCount, facts) {
  const playersLuckTriedFacts = Array.from({ length: playerCount }, () => []);
  facts.forEach(event => {
    if (event.constructor.name === 'LuckTriedFact') {
      const currentPlayer = GetCurrentPlayer(playerCount, facts.slice(0, facts.indexOf(event)));
      playersLuckTriedFacts[currentPlayer - 1].push(event);
    }
  });
  return playersLuckTriedFacts;
}

export function GetLuckTriedFactsSinceLastTurn(facts) {
  const turnStartIndex = Math.max(
    facts.map(fact => fact.constructor.name).lastIndexOf('GameStartedFact'),
    facts.map(fact => fact.constructor.name === 'LuckTriedFact' && fact.turnEnded === true).lastIndexOf(true)
  ) + 1;
  const luckTriedFactsThisTurn = facts.slice(turnStartIndex).filter(fact => fact.constructor.name === 'LuckTriedFact');
  return luckTriedFactsThisTurn;
}

export function GetHotDiceIndexesForLuckTriedFactsInTurn(facts) {
  const luckTriedFactsThisTurn = GetLuckTriedFactsSinceLastTurn(facts);
  const hotDiceIndexes = [];
  luckTriedFactsThisTurn.forEach((fact, index) => {
    if (fact.diceRolled.length === fact.meldKept.length) hotDiceIndexes.push(index);
  });
  return hotDiceIndexes;
}

export function GetPlayerScores(playerCount, facts) {
  const playersLuckTriedFacts = GetPlayersLuckTriedFacts(playerCount, facts);

  //log out player luck tried facts
  /* 
  playersLuckTriedFacts.forEach((playerFacts, index) => {
    console.log(`Player ${index + 1} LuckTriedFacts:`, playerFacts);
  }); 
  */

  const playersTurns = 
    playersLuckTriedFacts.map(playerFacts => {
        const turns = [];
        let currentTurn = [];

        playerFacts.forEach(fact => { 
          currentTurn.push(fact);
          // End of a turn
          if (fact.turnEnded) {
            turns.push(currentTurn);
            currentTurn = [];
          }
        });

        return turns;
      });

    //log out player turns
    /* 
    playersTurns.forEach((playerTurns, playerIndex) => {
      playerTurns.forEach((turn, turnIndex) => {
        console.log(`Player ${playerIndex + 1}, Turn ${turnIndex + 1}:`);
        turn.forEach(fact => {
          console.log(fact);
        });
      });
    }); */

    const scorablePlayerTurns = playersTurns.map(playerTurns => 
      playerTurns.filter(turn => {
        const lastFact = turn[turn.length - 1];
        return !(lastFact.turnEnded && lastFact.meldKept.length === 0);
      })
    );

    //log out sorable player turns
    /* scorablePlayerTurns.forEach((scorablePlayerTurns, playerIndex) => {
      scorablePlayerTurns.forEach((turn, turnIndex) => {
        console.log(`Player ${playerIndex + 1}, Turn ${turnIndex + 1}:`);
        turn.forEach(fact => {
          console.log(fact);
        });
      });
    }); */

    const playersTurnScores = scorablePlayerTurns.map(playerTurns => 
      playerTurns.map(turn => {
        return turn.reduce((turnScore, fact) => {
          if (fact.meldKept.length > 0) {
            const scoreResult = CalculateScore(fact.meldKept);
            return turnScore + scoreResult.score;
          }
          return turnScore;
        }, 0);
      })
    );

    // Log out player turn scores for debugging
    /* 
    playersTurnScores.forEach((playerScores, playerIndex) => {
      playerScores.forEach((score, turnIndex) => {
        console.log(`Player ${playerIndex + 1}, Turn ${turnIndex + 1}: Score ${score}`);
      });
    }); 
    */

    const totalPlayerScores = playersTurnScores.map(playerScores => 
      playerScores.reduce((totalScore, turnScore) => totalScore + turnScore, 0)
    );

    // Log out total player scores for debugging
    /* 
    totalPlayerScores.forEach((score, playerIndex) => {
      console.log(`Player ${playerIndex + 1}: Total Score ${score}`);
    });
     */

    return totalPlayerScores;
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
    const countOfNumberOne = countsOfNumber['1'];
    dice.score += countOfNumberOne * 100;
    removeCountedDice('1', countOfNumberOne);
    dice.scorableDice.push(...Array(countOfNumberOne).fill(1));
  }

  // Calculate score for extra 5s
  if (countsOfNumber['5']) {
    const countOfNumberFive = countsOfNumber['5'];
    dice.score += countOfNumberFive * 50;
    removeCountedDice('5', countOfNumberFive);
    dice.scorableDice.push(...Array(countOfNumberFive).fill(5));
  }

  if(Object.keys(countsOfNumber).length > 0) {
    dice.unscorableDice.push(...Object.keys(countsOfNumber).map(num => parseInt(num)));
  }

  return dice;
}
