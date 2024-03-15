//Farkle tests

import { describe, expect, it } from 'vitest';
import {
  HelloFarkleFact,
  GameStartedFact,
  RollGeneratedFact,
  DiePickedFact,
  LuckTriedFact,
  TurnEndedFact,
  GameEndedFact,
  CalculateScore,
  GenerateRoll,
  IsInGame,
  GetLastGameStartedIndex,
  GetTurnEndedCountSinceLastGameStart,
  GetCurrentPlayer,
  GetPlayersLuckTriedFacts,
  GetPlayerScores
} from './farkle.js';

describe('The fact', () => {
  it('GameStartedFact should correctly handle player count', () => {
    const validPlayerCount = 4;
    const gameStartedFactValid = new GameStartedFact(validPlayerCount);
    expect(gameStartedFactValid.playerCount).toBe(validPlayerCount);
  });

  it('RollGeneratedFact should correctly handle dice values', () => {
    const validDiceValues = [1, 2, 3, 4, 5];
    const rollGeneratedFactValid = new RollGeneratedFact(validDiceValues);
    expect(rollGeneratedFactValid.diceValues).toEqual(validDiceValues);

    const emptyDiceValues = [];
    const rollGeneratedFactEmpty = new RollGeneratedFact(emptyDiceValues);
    expect(rollGeneratedFactEmpty.diceValues).toEqual(emptyDiceValues);
  });

  it('DiePickedFact should correctly handle die index and roll source', () => {
    const validDieIndex = 3;
    const fromRoll = true;
    const diePickedFactValid = new DiePickedFact(validDieIndex, fromRoll);
    expect(diePickedFactValid.dieIndex).toBe(validDieIndex);
    expect(diePickedFactValid.fromRoll).toBe(fromRoll);

    const invalidDieIndex = -1;
    const diePickedFactInvalid = new DiePickedFact(invalidDieIndex, fromRoll);
    expect(diePickedFactInvalid.dieIndex).toBe(invalidDieIndex); // Assuming no validation on dieIndex in constructor

    const fromPicked = false;
    const diePickedFactFromPicked = new DiePickedFact(validDieIndex, fromPicked);
    expect(diePickedFactFromPicked.fromRoll).toBe(fromPicked);
  });

  it('LuckTriedFact should correctly handle dice rolled, meld kept arrays', () => {
    const diceRolledSample = [1, 2, 3, 4, 5];
    const meldKeptSample = [1, 5];
    const luckTriedFactSample = new LuckTriedFact(diceRolledSample, meldKeptSample);
    expect(luckTriedFactSample.diceRolled).toEqual(diceRolledSample);
    expect(luckTriedFactSample.meldKept).toEqual(meldKeptSample);


    const farkleDiceRolled = [2, 2, 3, 4, 6];
    const emptyMeldKept = [];
    const luckTriedFactEmpty = new LuckTriedFact(farkleDiceRolled, emptyMeldKept);
    expect(luckTriedFactEmpty.diceRolled).toEqual(farkleDiceRolled);
    expect(luckTriedFactEmpty.meldKept).toEqual(emptyMeldKept);
  });
});

describe('CalculateScore tests', () => {
  it('CalculateScore should return 0 for invalid inputs', () => {
    expect(CalculateScore("not an array").score).toBe(0);
    expect(CalculateScore([]).score).toBe(0);
    expect(CalculateScore([7, 8, 9]).score).toBe(0); // Assuming dice values should be between 1 and 6)
    expect(CalculateScore([1, 2, 3, 4, 5, 6, 7]).score).toBe(0); // More than 6 dice
  });

  it('CalculateScore should return 0 for single 3', () => {
    expect(CalculateScore([3]).score).toBe(0);
  });

  it('CalculateScore should ignore invalid inputs (non-scorable dice)', () => {
    expect(CalculateScore([1,2,3]).score).toBe(100);
    expect(CalculateScore([5,5,4]).score).toBe(100);
    expect(CalculateScore([5,5,5,3]).score).toBe(500);
    expect(CalculateScore([1,1,1,3]).score).toBe(1000);
    expect(CalculateScore([1,1,1,1,1,3]).score).toBe(2000);
    expect(CalculateScore([1,1,1,1,1,1]).score).toBe(3000);
  });

  it('CalculateScore should return 100 for single 1', () => {
    expect(CalculateScore([1]).score).toBe(100);
  });

  it('CalculateScore should return 50 for single 5', () => {
    expect(CalculateScore([5]).score).toBe(50);
  });

  it('CalculateScore should return 150 for single 1 and 5', () => {
    expect(CalculateScore([1,5]).score).toBe(150);
  });

  it('CalculateScore should return correct score for six of any number', () => {
    expect(CalculateScore([1, 1, 1, 1, 1, 1]).score).toBe(3000);
    expect(CalculateScore([2, 2, 2, 2, 2, 2]).score).toBe(3000);
    expect(CalculateScore([3, 3, 3, 3, 3, 3]).score).toBe(3000);
    expect(CalculateScore([4, 4, 4, 4, 4, 4]).score).toBe(3000);
    expect(CalculateScore([5, 5, 5, 5, 5, 5]).score).toBe(3000);
    expect(CalculateScore([6, 6, 6, 6, 6, 6]).score).toBe(3000);
  });

  it('CalculateScore should return correct score for five of any number', () => {
    expect(CalculateScore([1, 1, 1, 1, 1]).score).toBe(2000);
    expect(CalculateScore([2, 2, 2, 2, 2]).score).toBe(2000);
    expect(CalculateScore([3, 3, 3, 3, 3]).score).toBe(2000);
    expect(CalculateScore([4, 4, 4, 4, 4]).score).toBe(2000);
    expect(CalculateScore([5, 5, 5, 5, 5]).score).toBe(2000);
    expect(CalculateScore([6, 6, 6, 6, 6]).score).toBe(2000);
  });

  it('CalculateScore should return correct score for four of any number', () => {
    expect(CalculateScore([1, 1, 1, 1]).score).toBe(1000);
    expect(CalculateScore([2, 2, 2, 2]).score).toBe(1000);
    expect(CalculateScore([3, 3, 3, 3]).score).toBe(1000);
    expect(CalculateScore([4, 4, 4, 4]).score).toBe(1000);
    expect(CalculateScore([5, 5, 5, 5]).score).toBe(1000);
    expect(CalculateScore([6, 6, 6, 6]).score).toBe(1000);
  });

  it('CalculateScore should return correct score for three pairs', () => {
    expect(CalculateScore([1, 1, 2, 2, 3, 3]).score).toBe(1500);
  });

  it('CalculateScore should return correct score for one of every number from 1 to 6', () => {
    expect(CalculateScore([1, 2, 3, 4, 5, 6]).score).toBe(2500);
  });

  it('CalculateScore should return correct score for three of any number', () => {
    expect(CalculateScore([1, 1, 1, 5, 5, 5]).score).toBe(1500);
    expect(CalculateScore([2, 2, 2, 5, 5, 5]).score).toBe(700);
  });

  it('CalculateScore should return correct score for a wide range of combinations involving 1s and 5s', () => {
    expect(CalculateScore([1, 1, 1, 1]).score).toBe(1000); // Three 1s and an extra 1
    expect(CalculateScore([1, 1, 1, 5]).score).toBe(1050); // Three 1s and a 5
    expect(CalculateScore([5, 5, 5, 5]).score).toBe(1000); // Three 5s and an extra 5)
    expect(CalculateScore([5, 5, 5, 1]).score).toBe(600); // Three 5s and a 1
    expect(CalculateScore([1, 1, 5, 5]).score).toBe(300); // Two 1s and two 5s
    expect(CalculateScore([1, 5, 1, 5]).score).toBe(300); // Two 1s and two 5s in different order
    expect(CalculateScore([3, 3, 3, 5]).score).toBe(350); // Three of any number other than 1 or 5, plus a 5
    expect(CalculateScore([2, 2, 2, 5]).score).toBe(250); // Three of any number other than 1 or 5, plus a 5
    expect(CalculateScore([6, 6, 6, 5, 1, 1]).score).toBe(850); // Three 6s, a 5, and two 1s
    expect(CalculateScore([1, 1, 1, 5, 5, 5]).score).toBe(1500); // Three 1s and three 5s
    expect(CalculateScore([1, 5, 1, 5, 1, 5]).score).toBe(1500); // Alternating 1s and 5s
    expect(CalculateScore([1, 1, 1, 1, 5, 5]).score).toBe(1100); // Three 1s, an extra 1, and two 5s
    expect(CalculateScore([1, 1, 1, 1, 1, 5]).score).toBe(2050); // Four 1s and a 5
    expect(CalculateScore([5, 5, 5, 5, 5, 1]).score).toBe(2100); // Five 5s and a 1
    expect(CalculateScore([1, 1, 5, 5, 5, 5]).score).toBe(1200); // Two 1s and four 5s
    expect(CalculateScore([1, 5, 1, 5, 5, 5]).score).toBe(1200); // Two 1s and four 5s in different order
  });
});

describe('IsInGame', () => {
  
  it('should return true if the last GameStartedFact is not followed by a GameEndedFact', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new RollGeneratedFact(GenerateRoll(5)),
      new DiePickedFact([5, 5, 5]),
      new LuckTriedFact([2, 5, 5, 4, 5, 6], [5,5,5])
    ];
    expect(IsInGame(events)).toBe(true);
  });

  it('should return false if the last GameStartedFact is followed by a GameEndedFact', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new GameEndedFact()
    ];
    expect(IsInGame(events)).toBe(false);
  });

  it('should return false if theere is no GameStartedFact', () => {
    const events = [
      new HelloFarkleFact(new Date()),
    ];
    expect(IsInGame(events)).toBe(false);
  });

  it('should return false if there are no events', () => {
    const events = [];
    expect(IsInGame(events)).toBe(false);
  });
});

describe('GetLastGameStartedIndex', () => {
  it('should return the index of the last GameStartedFact event', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new DiePickedFact([5, 5, 5]),
    ];
    expect(GetLastGameStartedIndex(events)).toBe(1);
  });

  it('should return the index of the last GameStartedFact ewhere more than one exists', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([5]),
      new LuckTriedFact([2, 3, 5, 4, 5, 6], [5]),
      new RollGeneratedFact(GenerateRoll(5)),
      new DiePickedFact([1]),
      new LuckTriedFact([4, 6, 1, 2, 2], [1]),
      new GameStartedFact(3),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([1]),
      new LuckTriedFact([4, 5, 3, 5, 1, 6], [1]),
    ];
    expect(GetLastGameStartedIndex(events)).toBe(8);
  });

  it('should return -1 if there are no GameStartedFact events', () => {
    const events = [
      new HelloFarkleFact(new Date())
    ];
    expect(GetLastGameStartedIndex(events)).toBe(-1);
  });

  it('should handle an empty array', () => {
    const events = [];
    expect(GetLastGameStartedIndex(events)).toBe(-1);
  });
});

describe('GetLastTurnEndedsSinceLastGameStart', () => {
  it(' should return the correct number of LuckTriedFacts where turnEnded is true since the last GameStartedFact event', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([5]),
      new DiePickedFact([5]),
      new DiePickedFact([5]),
      new LuckTriedFact([2, 5, 5, 4, 5, 6], [5,5,5]),
      new TurnEndedFact(true),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([1]),
      new LuckTriedFact([4, 6, 1, 2, 2, 1], [1]),
      new RollGeneratedFact(GenerateRoll(5)),
      new DiePickedFact([1]),
      new LuckTriedFact([2, 5, 3, 1, 6], [1]),
    ];
    expect(GetTurnEndedCountSinceLastGameStart(events)).toBe(1);
  });

  it('should return 0 if there are no turn ended facts since last game start', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([5]),
      new LuckTriedFact([2, 3, 5, 4, 5, 6], [5]),
      new RollGeneratedFact(GenerateRoll(5)),
      new DiePickedFact([1]),
      new LuckTriedFact([4, 6, 1, 2, 2], [1])
    ];
    expect(GetTurnEndedCountSinceLastGameStart(events)).toBe(0);
  });

  it('should return 0 if there are no GameStartedFact events', () => {
    const events = [
      new HelloFarkleFact(new Date()),
    ];
    expect(GetTurnEndedCountSinceLastGameStart(events)).toBe(0);
  });

  it('should handle an empty array', () => {
    const events = [];
    expect(GetTurnEndedCountSinceLastGameStart(events)).toBe(0);
  });
});

describe('GetCurrentPlayer', () => {
  it('should return the correct current player index based on the number of turns since the last game started', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([5]),
      new DiePickedFact([5]),
      new DiePickedFact([5]),
      new LuckTriedFact([2, 5, 5, 4, 5, 6], [5,5,5]),
      new TurnEndedFact(true),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([1]),
      new LuckTriedFact([4, 6, 1, 2, 2, 1], [1]),
      new RollGeneratedFact(GenerateRoll(5)),
      new DiePickedFact([1]),
      new LuckTriedFact([2, 5, 3, 1, 6], [1]),
    ];
    expect(GetCurrentPlayer(3, events)).toBe(2);
  });

  it('should return 1 if no turns have ended since the last game start', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(4)
    ];
    expect(GetCurrentPlayer(4, events)).toBe(1);
  });

  it('should return the correct player in a new round of turns', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(2),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([5]),
      new DiePickedFact([5]),
      new DiePickedFact([5]),
      new LuckTriedFact([2, 5, 5, 4, 5, 6], [5,5,5]),
      new TurnEndedFact(true),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([1]),
      new LuckTriedFact([4, 6, 1, 2, 2, 1], [1]),
      new RollGeneratedFact(GenerateRoll(5)),
      new DiePickedFact([1]),
      new DiePickedFact([5]),
      new LuckTriedFact([2, 5, 3, 1, 6], [1,5]),
      new TurnEndedFact(true),
    ];
    expect(GetCurrentPlayer(2, events)).toBe(1); // 4 turns in a game with 4 players should return to the first player
  });

  it('should return the correct player after multiple GameStartedFacts', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([5]),
      new DiePickedFact([5]),
      new DiePickedFact([5]),
      new LuckTriedFact([2, 5, 5, 4, 5, 6], [5,5,5]),
      new TurnEndedFact(true),
      new GameEndedFact(1, 10150),
      new GameStartedFact(3),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([1]),
      new DiePickedFact([1]),
      new DiePickedFact([1]),
      new LuckTriedFact([4, 6, 1, 1, 2, 1], [1,1,1]),
      new TurnEndedFact(true),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([1]),
      new DiePickedFact([5]),
      new LuckTriedFact([2, 5, 3, 1, 6], [1,5]),
      new TurnEndedFact(true),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([1]),
      new LuckTriedFact([2, 5, 3, 1, 6], [1])
    ];
    expect(GetCurrentPlayer(3, events)).toBe(3); // After 2 turns in a game with 3 players, it should be the third player's turn
  });

  it(' should correctly calculate the current player index with multiple GameStartedFacts and uneven turns', () => {
    const events = [

        new HelloFarkleFact(new Date()),
        new GameStartedFact(4),
        new RollGeneratedFact(GenerateRoll(6)),
        new DiePickedFact([5]),
        new DiePickedFact([5]),
        new DiePickedFact([5]),
        new LuckTriedFact([2, 5, 5, 4, 5, 6], [5,5,5], true),
        new RollGeneratedFact(GenerateRoll(6)),
        new DiePickedFact([1]),
        new DiePickedFact([1]),
        new DiePickedFact([1]),
        new LuckTriedFact([4, 6, 1, 1, 2, 1], [1,1,1], true),
        new RollGeneratedFact(GenerateRoll(6)),
        new DiePickedFact([1]),
        new DiePickedFact([5]),
        new LuckTriedFact([2, 5, 3, 1, 6], [1,5], true),
        new RollGeneratedFact(GenerateRoll(6)),
        new DiePickedFact([1]),
        new LuckTriedFact([2, 5, 3, 1, 6], [1], true)
    ];
    expect(GetCurrentPlayer(4, events)).toBe(1); // After 3 turns in a game with 4 players, it should loop back to the first player
  });
});

describe('GenerateRoll function', () => {
  it('should return an array that is the same length as the input', () => {
    const diceCount = 4;
    const result = GenerateRoll(diceCount);
    expect(result.length).toBe(diceCount);
  });

  it('should only contain numbers between 1 and 6', () => {
    for (let i = 0; i < 100; i++) {
      const randomDiceCount = Math.floor(Math.random() * 6) + 1; // Generates a random number between 1 and 6
      const result = GenerateRoll(randomDiceCount);
      result.forEach(die => {
        expect(die).toBeGreaterThanOrEqual(1);
        expect(die).toBeLessThanOrEqual(6);
      });
    }
  });

  it('should return an empty array if diceCount is 0', () => {
    const result = GenerateRoll(0);
    expect(result).toEqual([]);
  });

  it('should handle negative numbers by returning an empty array', () => {
    const result = GenerateRoll(-3);
    expect(result).toEqual([]);
  });
});

describe('GetPlayersLuckTriedFacts function', () => {
  it('should correctly distribute LuckTriedFacts among players', () => {
    const events = [
      new GameStartedFact(2),
      new LuckTriedFact([2, 5, 5, 4, 5, 6], [5,5,5]),
      new TurnEndedFact(true),
      new LuckTriedFact([2, 1, 3, 4, 5, 6], [1]),
      new LuckTriedFact([4, 6, 1, 1, 2, 1], [1,1,1]),
      new TurnEndedFact(true),
      new LuckTriedFact([2, 5, 3, 1, 6], [1,5]),
      new TurnEndedFact(true),
      new LuckTriedFact([2, 5, 3, 1, 6], [1]),
      new TurnEndedFact(true),
      new GameEndedFact()
    ];
    const playerCount = 2;
    const playersLuckTriedFacts = GetPlayersLuckTriedFacts(playerCount, events);
    expect(playersLuckTriedFacts.length).toBe(playerCount);
    expect(playersLuckTriedFacts[0].length).toBe(2); // Player 1 should have 2 LuckTriedFacts
    expect(playersLuckTriedFacts[1].length).toBe(3); // Player 2 should have 2 LuckTriedFacts
  });

  it('should return empty array for all players with no points banked', () => {
    const events = [
      new GameStartedFact(3),
      new GameEndedFact()
    ];
    const playerCount = 3;
    const playersLuckTriedFacts = GetPlayersLuckTriedFacts(playerCount, events);
    expect(playersLuckTriedFacts.every(playerFact => playerFact.length === 0)).toBe(true);
  });

  it('should return 0 if a player has not banked any points', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([5]),
      new DiePickedFact([5]),
      new DiePickedFact([5]),
      new LuckTriedFact([2, 5, 5, 4, 5, 6], [5,5,5]),
      new TurnEndedFact(true),
      new RollGeneratedFact(GenerateRoll(6)),
      new DiePickedFact([1]),
      new LuckTriedFact([4, 6, 1, 2, 2, 1], [1]),
      new RollGeneratedFact(GenerateRoll(5)),
      new DiePickedFact([1]),
      new LuckTriedFact([2, 5, 3, 1, 6], [1])
    ];
    const playerCount = 3;
    const playersLuckTriedFacts = GetPlayersLuckTriedFacts(playerCount, events);
    expect(playersLuckTriedFacts[0].length).toBe(1); // Player 1 should have 1 LuckTriedFacts
    expect(playersLuckTriedFacts[1].length).toBe(2); // Player 1 should have 2 LuckTriedFacts
    expect(playersLuckTriedFacts[2].length).toBe(0); // Player 2 should have 0 LuckTriedFacts
  });
});

describe('GetPlayersScore', () => {
  it('should correctly calculate players scores based on LuckTriedFacts and TurnEndedFacts', () => {
    const events = [
      new GameStartedFact(2),
      new LuckTriedFact([1, 2, 6, 3, 4, 5], [1, 5]), // Player 1 scores 150
      new LuckTriedFact([2, 2, 3, 2, 5], [2, 2, 2, 5]), // Player 1 scores 250
      new TurnEndedFact(true),
      new LuckTriedFact([1, 1, 1, 2, 3], [1, 1, 1]), // Player 2 scores 1000
      new TurnEndedFact(true),
      new LuckTriedFact([5, 5, 5, 2, 3], [5, 5, 5]), // Player 1 scores 500
      new TurnEndedFact(true),
      new LuckTriedFact([5, 5, 2, 2, 3, 3], [5, 5, 2, 2, 3, 3]), // Player 2 scores 1500
      new LuckTriedFact([1, 2, 4, 2, 1, 6], [1, 1]), // Player 2 scores 200
      new LuckTriedFact([6, 2, 1, 5], [1, 5]), // Player 2 scores 150
      new TurnEndedFact(true),
      new GameEndedFact()
    ];
    const playerCount = 2;
    const playersScores = GetPlayerScores(playerCount, events);
    expect(playersScores.length).toBe(playerCount);
    expect(playersScores[0]).toBe(900); // Player 1 total score
    expect(playersScores[1]).toBe(2850); // Player 2 total score
  });

  it('should return 0 for all players if no points are banked', () => {
    const events = [
      new GameStartedFact(3),
      new LuckTriedFact([2, 3, 4, 6], [2]), // No points banked
      new TurnEndedFact(true, 0),
      new LuckTriedFact([2, 3, 4, 6], [3]), // No points banked
      new TurnEndedFact(true, 0),
      new GameEndedFact()
    ];
    const playerCount = 3;
    const playersScores = GetPlayerScores(playerCount, events);
    expect(playersScores.every(score => score === 0)).toBe(true);
  });

  it('should correctly handle multiple games in the same event list', () => {
    const events = [
      new GameStartedFact(2),
      new LuckTriedFact([1, 5], [1, 5]), // Player 1 scores 150
      new TurnEndedFact(true, 150),
      new GameEndedFact(),
      new GameStartedFact(2),
      new LuckTriedFact([1, 1, 1], [1, 1, 1]), // Player 1 scores 1000 in a new game
      new TurnEndedFact(true, 1000),
      new GameEndedFact()
    ];
    const playerCount = 2;
    const playersScores = GetPlayerScores(playerCount, events);
    expect(playersScores[0]).toBe(1000); // Player 1 total score across games
    expect(playersScores[1]).toBe(0); // Player 2 did not play in the second game
  });
});