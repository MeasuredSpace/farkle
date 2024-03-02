//Farkle tests

import { describe, expect, it } from 'vitest';
import {
  HelloFarkleFact,
  GameStartedFact,
  DiceRolledFact,
  DicePickedFact,
  TurnEndedFact,
  GameEndedFact,
  CalculateScore,
  IsInGame,
  GetLastGameStartedIndex,
  GetLastTurnEndedsSinceLastGameStart,
  GetCurrentPlayer
} from './farkle.js';

describe('Fact tests', () => {
  it('GameStartedFact should return correct player count', () => {
    const playerCount = 4;
    const gameStartedFact = new GameStartedFact(playerCount);
    expect(gameStartedFact.getPlayerCount()).toBe(playerCount);
  });

  it('GameStartedFact should not accept negative player counts', () => {
    const playerCount = -1;
    const gameStartedFact = new GameStartedFact(playerCount);
    expect(gameStartedFact.getPlayerCount()).not.toBe(playerCount);
  });

  it('DiceRolledFact should return correct dice roll', () => {
    const diceRoll = [1, 2, 3, 4, 5];
    const diceRolledFact = new DiceRolledFact(diceRoll);
    expect(diceRolledFact.getDiceRoll()).toEqual(diceRoll);
  });

  it('DiceRolledFact should handle empty dice roll', () => {
    const diceRoll = [];
    const diceRolledFact = new DiceRolledFact(diceRoll);
    expect(diceRolledFact.getDiceRoll()).toEqual(diceRoll);
  });

  it('DicePickedFact should return correct dice', () => {
    const dice = [1, 2, 3];
    const dicePickedFact = new DicePickedFact(dice);
    expect(dicePickedFact.getDice()).toEqual(dice);
  });

  it('DicePickedFact should handle empty dice array', () => {
    const dice = [];
    const dicePickedFact = new DicePickedFact(dice);
    expect(dicePickedFact.getDice()).toEqual(dice);
  });

  it('DicePickedFact should handle non-array input by returning an empty array', () => {
    const dice = "not an array";
    const dicePickedFact = new DicePickedFact(dice);
    expect(dicePickedFact.getDice()).toEqual([]);
  });

  it('DicePickedFact should filter out invalid dice values', () => {
    const dice = [1, 2, 3, "four", 5];
    const expectedDice = [1, 2, 3, 5]; // Assuming "four" is invalid
    const dicePickedFact = new DicePickedFact(dice);
    expect(dicePickedFact.getDice()).toEqual(expectedDice);
  });

  it('TurnEndedFact should correctly return role points and prevent negative points', () => {
    const Fact1 = new TurnEndedFact(500);
    expect(Fact1.getRolePoints()).toBe(500);

    const Fact2 = new TurnEndedFact(1000);
    expect(Fact2.getRolePoints()).toBe(1000);

    const Fact3 = new TurnEndedFact(0);
    expect(Fact3.getRolePoints()).toBe(0);

    const Fact4 = new TurnEndedFact(-100); // Testing with negative points, now expecting it to return 0 instead of negative
    expect(Fact4.getRolePoints()).toBe(0);
  });
});

describe('CalculateScore tests', () => {
  it('CalculateScore should return 0 for invalid inputs', () => {
    expect(CalculateScore("not an array")).toBe(0);
    expect(CalculateScore([])).toBe(0);
    expect(CalculateScore([7, 8, 9])).toBe(0); // Assuming dice values should be between 1 and 6
    expect(CalculateScore([1, 2, 3, 4, 5, 6, 7])).toBe(0); // More than 6 dice
  });

  it('CalculateScore should return correct score for six of any number', () => {
    expect(CalculateScore([1, 1, 1, 1, 1, 1])).toBe(3000);
    expect(CalculateScore([2, 2, 2, 2, 2, 2])).toBe(3000);
    expect(CalculateScore([3, 3, 3, 3, 3, 3])).toBe(3000);
    expect(CalculateScore([4, 4, 4, 4, 4, 4])).toBe(3000);
    expect(CalculateScore([5, 5, 5, 5, 5, 5])).toBe(3000);
    expect(CalculateScore([6, 6, 6, 6, 6, 6])).toBe(3000);
  });

  it('CalculateScore should return correct score for five of any number', () => {
    expect(CalculateScore([1, 1, 1, 1, 1])).toBe(2000);
    expect(CalculateScore([2, 2, 2, 2, 2])).toBe(2000);
    expect(CalculateScore([3, 3, 3, 3, 3])).toBe(2000);
    expect(CalculateScore([4, 4, 4, 4, 4])).toBe(2000);
    expect(CalculateScore([5, 5, 5, 5, 5])).toBe(2000);
    expect(CalculateScore([6, 6, 6, 6, 6])).toBe(2000);
  });

  it('CalculateScore should return correct score for four of any number', () => {
    expect(CalculateScore([1, 1, 1, 1])).toBe(1000);
    expect(CalculateScore([2, 2, 2, 2])).toBe(1000);
    expect(CalculateScore([3, 3, 3, 3])).toBe(1000);
    expect(CalculateScore([4, 4, 4, 4])).toBe(1000);
    expect(CalculateScore([5, 5, 5, 5])).toBe(1000);
    expect(CalculateScore([6, 6, 6, 6])).toBe(1000);
  });

  it('CalculateScore should return correct score for three pairs', () => {
    expect(CalculateScore([1, 1, 2, 2, 3, 3])).toBe(1500);
  });

  it('CalculateScore should return correct score for one of every number from 1 to 6', () => {
    expect(CalculateScore([1, 2, 3, 4, 5, 6])).toBe(2500);
  });

  it('CalculateScore should return correct score for three of any number', () => {
    expect(CalculateScore([1, 1, 1, 2, 3, 4])).toBe(1000);
    expect(CalculateScore([2, 2, 2, 3, 4, 5])).toBe(250);
  });

  it('CalculateScore should return correct score for a wide range of combinations involving 1s and 5s', () => {
    expect(CalculateScore([1, 1, 1, 1])).toBe(1000); // Three 1s and an extra 1
    expect(CalculateScore([1, 1, 1, 5])).toBe(1050); // Three 1s and a 5
    expect(CalculateScore([5, 5, 5, 5])).toBe(1000); // Three 5s and an extra 5
    expect(CalculateScore([5, 5, 5, 1])).toBe(600); // Three 5s and a 1
    expect(CalculateScore([1, 1, 5, 5])).toBe(300); // Two 1s and two 5s
    expect(CalculateScore([1, 5, 1, 5])).toBe(300); // Two 1s and two 5s in different order
    expect(CalculateScore([3, 3, 3, 5])).toBe(350); // Three of any number other than 1 or 5, plus a 5
    expect(CalculateScore([2, 2, 2, 5])).toBe(250); // Three of any number other than 1 or 5, plus a 5
    expect(CalculateScore([6, 6, 6, 5, 1, 1])).toBe(850); // Three 6s, a 5, and two 1s
    expect(CalculateScore([1, 1, 1, 5, 5, 5])).toBe(1500); // Three 1s and three 5s
    expect(CalculateScore([1, 5, 1, 5, 1, 5])).toBe(1500); // Alternating 1s and 5s
    expect(CalculateScore([1, 1, 1, 1, 5, 5])).toBe(1100); // Three 1s, an extra 1, and two 5s
    expect(CalculateScore([1, 1, 1, 1, 1, 5])).toBe(2050); // Four 1s and a 5
    expect(CalculateScore([5, 5, 5, 5, 5, 1])).toBe(2100); // Five 5s and a 1
    expect(CalculateScore([1, 1, 5, 5, 5, 5])).toBe(1200); // Two 1s and four 5s
    expect(CalculateScore([1, 5, 1, 5, 5, 5])).toBe(1200); // Two 1s and four 5s in different order
  });
});

describe('Read Model tests', () => {
  it('should return true if the last event is not GameEndedFact or HelloFarkleFact', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new DiceRolledFact([1, 2, 3, 5, 5, 5]),
      new DicePickedFact([5, 5, 5]),
      new TurnEndedFact(500)
    ];
    expect(IsInGame(events)).toBe(true);
  });

  it('should return false if the last event is GameEndedFact', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new GameEndedFact()
    ];
    expect(IsInGame(events)).toBe(false);
  });

  it('should return false if the last event is HelloFarkleFact', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new HelloFarkleFact(new Date())
    ];
    expect(IsInGame(events)).toBe(false);
  });

  it('should return false if there are no events', () => {
    const events = [];
    expect(IsInGame(events)).toBe(false);
  });

  it('GetLastGameStartedIndex should return the index of the last GameStartedFact event', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new DiceRolledFact([1, 2, 3, 5, 5, 5]),
      new DicePickedFact([5, 5, 5]),
      new TurnEndedFact(500)
    ];
    expect(GetLastGameStartedIndex(events)).toBe(1);
  });

  it('GetLastGameStartedIndex should return the index of the last GameStartedFact event where more than one exists', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new DiceRolledFact([1, 2, 3, 5, 5, 5]),
      new DicePickedFact([5, 5, 5]),
      new TurnEndedFact(500),
      new DiceRolledFact([6, 2, 3, 2, 4, 3]),
      new TurnEndedFact(0),
      new GameStartedFact(3),
      new DiceRolledFact([1, 2, 3, 3, 5, 5]),
      new DicePickedFact([5]),
    ];
    expect(GetLastGameStartedIndex(events)).toBe(7);
  });

  it('GetLastGameStartedIndex should return -1 if there are no GameStartedFact events', () => {
    const events = [
      new HelloFarkleFact(new Date())
    ];
    expect(GetLastGameStartedIndex(events)).toBe(-1);
  });

  it('GetLastGameStartedIndex should handle an empty array', () => {
    const events = [];
    expect(GetLastGameStartedIndex(events)).toBe(-1);
  });

  it('GetLastTurnEndedsSinceLastGameStart should return the correct number of TurnEndedFact events since the last GameStartedFact event', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new DiceRolledFact([1, 2, 3, 5, 5, 5]),
      new DicePickedFact([5, 5, 5]),
      new TurnEndedFact(500),
      new GameStartedFact(4),
      new DiceRolledFact([1, 2, 3, 6, 6, 6]),
      new DicePickedFact([5, 5, 5]),
      new TurnEndedFact(600),
      new DiceRolledFact([2, 2, 3, 4, 6, 6]),
      new TurnEndedFact(0)
    ];
    expect(GetLastTurnEndedsSinceLastGameStart(events)).toBe(2);
  });

  it('GetLastTurnEndedsSinceLastGameStart should return 0 if there are no TurnEndedFact events after the last GameStartedFact event', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(3),
      new DiceRolledFact([1, 2, 3, 5, 5, 5]),
      new DicePickedFact([5, 5, 5]),
      new DiceRolledFact([1, 4, 5]),
      new DicePickedFact([1]),
    ];
    expect(GetLastTurnEndedsSinceLastGameStart(events)).toBe(0);
  });

  it('GetLastTurnEndedsSinceLastGameStart should return 0 if there are no GameStartedFact events', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new TurnEndedFact(500),
      new TurnEndedFact(100)
    ];
    expect(GetLastTurnEndedsSinceLastGameStart(events)).toBe(0);
  });

  it('GetLastTurnEndedsSinceLastGameStart should handle an empty array', () => {
    const events = [];
    expect(GetLastTurnEndedsSinceLastGameStart(events)).toBe(0);
  });

  it('GetCurrentPlayer should return the correct current player index based on the number of turns since the last game started', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(4),
      new TurnEndedFact(100),
      new TurnEndedFact(200),
      new TurnEndedFact(300)
    ];
    expect(GetCurrentPlayer(4, events)).toBe(4);
  });

  it('GetCurrentPlayer should return 0 if no turns have ended since the last game started', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(4)
    ];
    expect(GetCurrentPlayer(4, events)).toBe(1);
  });

  it('GetCurrentPlayer should return the correct player index in a new round of turns', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(4),
      new TurnEndedFact(100),
      new TurnEndedFact(200),
      new TurnEndedFact(300),
      new TurnEndedFact(400)
    ];
    expect(GetCurrentPlayer(4, events)).toBe(1); // 4 turns in a game with 4 players should return to the first player
  });

  it('GetCurrentPlayer should return the correct player index after multiple GameStartedFacts', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(4),
      new TurnEndedFact(100),
      new TurnEndedFact(200),
      new GameStartedFact(3), // New game starts with 3 players
      new TurnEndedFact(300),
      new TurnEndedFact(400)
    ];
    expect(GetCurrentPlayer(3, events)).toBe(3); // After 2 turns in a game with 3 players, it should be the third player's turn
  });

  it('GetCurrentPlayer should handle multiple GameStartedFacts with no turns ended after the last start', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(4),
      new TurnEndedFact(100),
      new TurnEndedFact(200),
      new GameStartedFact(2) // New game starts with 2 players, no turns ended yet
    ];
    expect(GetCurrentPlayer(2, events)).toBe(1); // No turns ended after the last game started, so it should be the first player's turn
  });

  it('GetCurrentPlayer should correctly calculate the current player index with multiple GameStartedFacts and uneven turns', () => {
    const events = [
      new HelloFarkleFact(new Date()),
      new GameStartedFact(5),
      new TurnEndedFact(100),
      new TurnEndedFact(200),
      new GameStartedFact(4), // New game starts with 4 players
      new TurnEndedFact(300),
      new TurnEndedFact(400),
      new TurnEndedFact(500)
    ];
    expect(GetCurrentPlayer(4, events)).toBe(4); // After 3 turns in a game with 4 players, it should loop back to the first player
  });
});