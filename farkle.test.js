//Farkle tests

test('adds 2 + 2 to equal 4', () => {
    expect(2 + 2).toBe(4);
  });

  var GameStartedEvent = require('./farkle').GameStartedEvent;
  var DiceRolledEvent = require('./farkle').DiceRolledEvent;

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
