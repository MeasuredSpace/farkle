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

module.exports.GameStartedEvent = GameStartedEvent;
module.exports.DiceRolledEvent = DiceRolledEvent;