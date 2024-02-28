//Farkle tests

var GameStartedEvent = require('./farkle').GameStartedEvent;
var DiceRolledEvent = require('./farkle').DiceRolledEvent;
var DicePickedEvent = require('./farkle').DicePickedEvent;
var CalculateScore = require('./farkle').CalculateScore;


test('adds 2 + 2 to equal 4', () => {
    expect(2 + 2).toBe(4);
  });

  test('GameStartedEvent should return correct player count', () => {
    const playerCount = 4;
    const gameStartedEvent = new GameStartedEvent(playerCount);
    expect(gameStartedEvent.getPlayerCount()).toBe(playerCount);
  });
  
  test('GameStartedEvent should not accept negative player counts', () => {
    const playerCount = -1;
    const gameStartedEvent = new GameStartedEvent(playerCount);
    expect(gameStartedEvent.getPlayerCount()).not.toBe(playerCount);
  });

  test('DiceRolledEvent should return correct dice roll', () => {
    const diceRoll = [1, 2, 3, 4, 5];
    const diceRolledEvent = new DiceRolledEvent(diceRoll);
    expect(diceRolledEvent.getDiceRoll()).toEqual(diceRoll);
  });

  test('DiceRolledEvent should handle empty dice roll', () => {
    const diceRoll = [];
    const diceRolledEvent = new DiceRolledEvent(diceRoll);
    expect(diceRolledEvent.getDiceRoll()).toEqual(diceRoll);
  });

  test('DicePickedEvent should return correct dice', () => {
    const dice = [1, 2, 3];
    const dicePickedEvent = new DicePickedEvent(dice);
    expect(dicePickedEvent.getDice()).toEqual(dice);
  });

  test('DicePickedEvent should handle empty dice array', () => {
    const dice = [];
    const dicePickedEvent = new DicePickedEvent(dice);
    expect(dicePickedEvent.getDice()).toEqual(dice);
  });

  test('DicePickedEvent should handle non-array input by returning an empty array', () => {
    const dice = "not an array";
    const dicePickedEvent = new DicePickedEvent(dice);
    expect(dicePickedEvent.getDice()).toEqual([]);
  });

  test('DicePickedEvent should filter out invalid dice values', () => {
    const dice = [1, 2, 3, "four", 5];
    const expectedDice = [1, 2, 3, 5]; // Assuming "four" is invalid
    const dicePickedEvent = new DicePickedEvent(dice);
    expect(dicePickedEvent.getDice()).toEqual(expectedDice);
  });

  test('CalculateScore should return 0 for invalid inputs', () => {
    expect(CalculateScore("not an array")).toBe(0);
    expect(CalculateScore([])).toBe(0);
    expect(CalculateScore([7, 8, 9])).toBe(0); // Assuming dice values should be between 1 and 6
    expect(CalculateScore([1, 2, 3, 4, 5, 6, 7])).toBe(0); // More than 6 dice
  });

  test('CalculateScore should return correct score for six of any number', () => {
    expect(CalculateScore([1, 1, 1, 1, 1, 1])).toBe(3000);
    expect(CalculateScore([2, 2, 2, 2, 2, 2])).toBe(3000);
    expect(CalculateScore([3, 3, 3, 3, 3, 3])).toBe(3000);
    expect(CalculateScore([4, 4, 4, 4, 4, 4])).toBe(3000);
    expect(CalculateScore([5, 5, 5, 5, 5, 5])).toBe(3000);
    expect(CalculateScore([6, 6, 6, 6, 6, 6])).toBe(3000);
  });

  test('CalculateScore should return correct score for five of any number', () => {
    expect(CalculateScore([1, 1, 1, 1, 1])).toBe(2000);
    expect(CalculateScore([2, 2, 2, 2, 2])).toBe(2000);
    expect(CalculateScore([3, 3, 3, 3, 3])).toBe(2000);
    expect(CalculateScore([4, 4, 4, 4, 4])).toBe(2000);
    expect(CalculateScore([5, 5, 5, 5, 5])).toBe(2000);
    expect(CalculateScore([6, 6, 6, 6, 6])).toBe(2000);
  });

  test('CalculateScore should return correct score for four of any number', () => {
    expect(CalculateScore([1, 1, 1, 1])).toBe(1000);
    expect(CalculateScore([2, 2, 2, 2])).toBe(1000);
    expect(CalculateScore([3, 3, 3, 3])).toBe(1000);
    expect(CalculateScore([4, 4, 4, 4])).toBe(1000);
    expect(CalculateScore([5, 5, 5, 5])).toBe(1000);
    expect(CalculateScore([6, 6, 6, 6])).toBe(1000);
  });

  test('CalculateScore should return correct score for three pairs', () => {
    expect(CalculateScore([1, 1, 2, 2, 3, 3])).toBe(1500);
  });

  test('CalculateScore should return correct score for one of every number from 1 to 6', () => {
    expect(CalculateScore([1, 2, 3, 4, 5, 6])).toBe(2500);
  });

  test('CalculateScore should return correct score for three of any number', () => {
    expect(CalculateScore([1, 1, 1, 2, 3, 4])).toBe(1000);
    expect(CalculateScore([2, 2, 2, 3, 4, 5])).toBe(250);
  });

  test('CalculateScore should return correct score for a wide range of combinations involving 1s and 5s', () => {
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
