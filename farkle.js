
function GameStartedEvent(playerCount) {
  var _playerCount = playerCount < 0 ? 1 : playerCount;

  this.getPlayerCount = function() {
    return _playerCount;
  };
}
module.exports = GameStartedEvent;





