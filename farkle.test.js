//Farkle tests

test('adds 2 + 2 to equal 4', () => {
    expect(2 + 2).toBe(4);
  });

  const GameStartedEvent = require('./farkle.js');

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
