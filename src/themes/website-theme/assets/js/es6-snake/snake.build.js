(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SnakeGame = function () {
    function SnakeGame(canvas) {
        var _this = this;

        var blockSize = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

        _classCallCheck(this, SnakeGame);

        if (typeof canvas === "string") canvas = document.getElementById(canvas);

        this.canvas = canvas;
        this.blockSize = blockSize;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.getAttribute("width");
        this.height = this.canvas.getAttribute("height");

        document.onkeydown = function (event) {
            _this.handleKeypress(event);
        };

        this.setup();
    }

    _createClass(SnakeGame, [{
        key: "setup",
        value: function setup() {
            clearTimeout(this.t);
            this.isPaused = true;
            this.isGameOver = false;

            this.player = {
                direction: "right",
                time: 0,
                speed: 1,
                score: 0,
                blocks: []
            };

            this.fruit = {
                value: 1,
                countdown: 0,
                position: { x: -1, y: -1 },
                interval: Math.sqrt(this.width * this.height) / 4 * 10 / this.blockSize
            };

            for (var i = 0; i < 5; i++) {
                this.player.blocks.push([this.blockSize, this.blockSize]);
            }

            this.drawBoard();
            this.drawPlayer();
            this.drawFruit();
            this.drawStart();
        }
    }, {
        key: "loop",
        value: function loop() {
            var _this2 = this;

            if (!this.isPaused && !this.isGameOver) {
                this.drawBoard();
                this.drawScoreboard();
                this.drawPlayer();
                this.drawFruit();
                this.movePlayer();
                this.detectCollision();

                this.t = setTimeout(function () {
                    _this2.loop();
                }, 70);
            }
        }
    }, {
        key: "handleKeypress",
        value: function handleKeypress(event) {
            switch (event.keyCode) {
                case 32:
                    // spacebar
                    if (this.isGameOver) {
                        this.setup();
                    } else if (this.isPaused) {
                        this.isPaused = false;
                        this.loop();
                    } else {
                        this.isPaused = true;
                        this.drawPause();
                    }
                    break;
                case 37:
                    // left arrow key
                    if (this.player.direction != "right") this.player.direction = "left";
                    break;
                case 38:
                    // up arrow key
                    if (this.player.direction != "down") this.player.direction = "up";
                    break;
                case 39:
                    // right arrow key
                    if (this.player.direction != "left") this.player.direction = "right";
                    break;
                case 40:
                    // down arrow key
                    if (this.player.direction != "up") this.player.direction = "down";
                    break;
            }
        }
    }, {
        key: "drawBoard",
        value: function drawBoard() {
            this.ctx.fillStyle = "rgb(0, 0, 0)";
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.clearRect(this.blockSize, this.blockSize, this.width - this.blockSize * 2, this.height - this.blockSize * 2);
        }
    }, {
        key: "drawScoreboard",
        value: function drawScoreboard() {
            var x = this.width / 2,
                y = this.height / 2 + 40;

            this.ctx.font = "150pt Lucida Console";
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "rgba(84, 84, 84, 0.5)";
            this.ctx.fillText(this.player.score, x, y);
        }
    }, {
        key: "drawPlayer",
        value: function drawPlayer() {
            for (var i in this.player.blocks) {
                var _player$blocks$i = _slicedToArray(this.player.blocks[i], 2);

                var x = _player$blocks$i[0];
                var y = _player$blocks$i[1];


                this.ctx.fillStyle = "rgb(238, 238, 238)";
                this.ctx.fillRect(x, y, this.blockSize, this.blockSize);

                this.ctx.fillStyle = "rgb(255, 0, 0)";
                this.ctx.fillRect(x + 1, y + 1, this.blockSize - 1, this.blockSize - 2);
            }
        }
    }, {
        key: "drawFruit",
        value: function drawFruit() {
            var x = this.fruit.position.x,
                y = this.fruit.position.y;

            if (this.fruit.countdown <= 0) {
                var notDone = true;

                while (notDone) {
                    x = this.randomFromTo(1, this.width / this.blockSize - 2) * this.blockSize;
                    y = this.randomFromTo(1, this.height / this.blockSize - 2) * this.blockSize;

                    // make sure fruit is not on an occupied position
                    for (var i in this.player.blocks) {
                        var _player$blocks$i2 = _slicedToArray(this.player.blocks[i], 2);

                        var px = _player$blocks$i2[0];
                        var py = _player$blocks$i2[1];


                        if (x != px && y != py) notDone = false;
                    }
                }

                this.fruit.position.x = x;
                this.fruit.position.y = y;
                this.fruit.countdown = this.fruit.interval;
            }

            this.fruit.countdown -= 1;
            this.ctx.fillStyle = "rgb(34, 139, 34)";
            this.ctx.fillRect(x, y, this.blockSize, this.blockSize);
        }
    }, {
        key: "drawCenteredText",
        value: function drawCenteredText(text) {
            var color = arguments.length <= 1 || arguments[1] === undefined ? "blue" : arguments[1];

            var x = this.width / 2,
                y = this.height / 2;

            this.ctx.font = 30 * (this.width / 400) + 'pt Calibri';
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = color;
            this.ctx.fillText(text, x, y);
        }
    }, {
        key: "drawStart",
        value: function drawStart() {
            this.drawCenteredText("Snake!");
        }
    }, {
        key: "drawPause",
        value: function drawPause() {
            this.drawCenteredText("Paused!");
        }
    }, {
        key: "drawGameOver",
        value: function drawGameOver() {
            this.drawCenteredText("Game Over!");
        }
    }, {
        key: "movePlayer",
        value: function movePlayer() {
            switch (this.player.direction) {
                case "left":
                    this.player.blocks.unshift([this.player.blocks[0][0] - this.blockSize, this.player.blocks[0][1]]);
                    break;
                case "right":
                    this.player.blocks.unshift([this.player.blocks[0][0] + this.blockSize, this.player.blocks[0][1]]);
                    break;
                case "up":
                    this.player.blocks.unshift([this.player.blocks[0][0], this.player.blocks[0][1] - this.blockSize]);
                    break;
                case "down":
                    this.player.blocks.unshift([this.player.blocks[0][0], this.player.blocks[0][1] + this.blockSize]);
                    break;
            }
            this.player.blocks.pop();
        }
    }, {
        key: "detectCollision",
        value: function detectCollision() {
            var _player$blocks$ = _slicedToArray(this.player.blocks[0], 2);

            var x = _player$blocks$[0];
            var y = _player$blocks$[1];

            // make sure user is with the bounds

            if (x >= this.width - this.blockSize || y >= this.height - this.blockSize || x < this.blockSize || y < this.blockSize) {
                this.isGameOver = true;
                this.drawGameOver();
            }

            // check if the player collided with the fruit
            if (x == this.fruit.position.x && y == this.fruit.position.y) {
                this.player.score += this.fruit.value;
                this.fruit.countdown = 0;
                this.player.blocks.push(this.player.blocks[this.player.blocks.length - 1]);
            }

            // check if player collided with self
            for (var i in this.player.blocks) {
                if (i == 0) continue;

                if (this.player.blocks[0][0] == this.player.blocks[i][0] && this.player.blocks[0][1] == this.player.blocks[i][1]) {
                    this.isGameOver = true;
                    this.drawGameOver();
                }
            }
        }
    }, {
        key: "randomFromTo",
        value: function randomFromTo(from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        }
    }]);

    return SnakeGame;
}();

var game = new SnakeGame("game-board");

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGpzXFxzbmFrZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0lDQU07QUFFRixhQUZFLFNBRUYsQ0FBWSxNQUFaLEVBQW9DOzs7WUFBaEIsa0VBQVksa0JBQUk7OzhCQUZsQyxXQUVrQzs7QUFDaEMsWUFBSSxPQUFPLE1BQVAsS0FBa0IsUUFBbEIsRUFBNEIsU0FBUyxTQUFTLGNBQVQsQ0FBd0IsTUFBeEIsQ0FBVCxDQUFoQzs7QUFFQSxhQUFLLE1BQUwsR0FBYyxNQUFkLENBSGdDO0FBSWhDLGFBQUssU0FBTCxHQUFpQixTQUFqQixDQUpnQztBQUtoQyxhQUFLLEdBQUwsR0FBVyxLQUFLLE1BQUwsQ0FBWSxVQUFaLENBQXVCLElBQXZCLENBQVgsQ0FMZ0M7QUFNaEMsYUFBSyxLQUFMLEdBQWEsS0FBSyxNQUFMLENBQVksWUFBWixDQUF5QixPQUF6QixDQUFiLENBTmdDO0FBT2hDLGFBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxDQUFZLFlBQVosQ0FBeUIsUUFBekIsQ0FBZCxDQVBnQzs7QUFTaEMsaUJBQVMsU0FBVCxHQUFxQixpQkFBUztBQUFFLGtCQUFLLGNBQUwsQ0FBb0IsS0FBcEIsRUFBRjtTQUFULENBVFc7O0FBV2hDLGFBQUssS0FBTCxHQVhnQztLQUFwQzs7aUJBRkU7O2dDQWdCTTtBQUNKLHlCQUFhLEtBQUssQ0FBTCxDQUFiLENBREk7QUFFSixpQkFBSyxRQUFMLEdBQWdCLElBQWhCLENBRkk7QUFHSixpQkFBSyxVQUFMLEdBQWtCLEtBQWxCLENBSEk7O0FBS0osaUJBQUssTUFBTCxHQUFjO0FBQ1YsMkJBQVcsT0FBWDtBQUNBLHNCQUFNLENBQU47QUFDQSx1QkFBTyxDQUFQO0FBQ0EsdUJBQU8sQ0FBUDtBQUNBLHdCQUFRLEVBQVI7YUFMSixDQUxJOztBQWFKLGlCQUFLLEtBQUwsR0FBYTtBQUNULHVCQUFPLENBQVA7QUFDQSwyQkFB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Q0FBd0IsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLE1BQW5CLEdBQTRCLENBQTVCLENBQTNDLEVBSDBEO2FBQTlEOzs7QUFkYyxpQkFxQlQsSUFBSSxDQUFKLElBQVMsS0FBSyxNQUFMLENBQVksTUFBWixFQUFvQjtBQUM5QixvQkFBSSxLQUFLLENBQUwsRUFBUSxTQUFaOztBQUVBLG9CQUFJLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsS0FBNEIsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUE1QixJQUF3RCxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEtBQTRCLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBNUIsRUFBc0Q7QUFDOUcseUJBQUssVUFBTCxHQUFrQixJQUFsQixDQUQ4RztBQUU5Ryx5QkFBSyxZQUFMLEdBRjhHO2lCQUFsSDthQUhKOzs7O3FDQVVTLE1BQU0sSUFBSTtBQUNuQixtQkFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsTUFBaUIsS0FBSyxJQUFMLEdBQVksQ0FBWixDQUFqQixHQUFrQyxJQUFsQyxDQUFsQixDQURtQjs7OztXQXZOckI7OztBQTROTixJQUFJLE9BQU8sSUFBSSxTQUFKLENBQWMsWUFBZCxDQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIFNuYWtlR2FtZVxyXG57XHJcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMsIGJsb2NrU2l6ZSA9IDEwKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYW52YXMgPT09IFwic3RyaW5nXCIpIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhcyk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgIHRoaXMuYmxvY2tTaXplID0gYmxvY2tTaXplO1xyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5jYW52YXMuZ2V0QXR0cmlidXRlKFwid2lkdGhcIik7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5nZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIik7XHJcblxyXG4gICAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IGV2ZW50ID0+IHsgdGhpcy5oYW5kbGVLZXlwcmVzcyhldmVudCkgfTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR1cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnQpO1xyXG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnBsYXllciA9IHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBcInJpZ2h0XCIsXHJcbiAgICAgICAgICAgIHRpbWU6IDAsXHJcbiAgICAgICAgICAgIHNwZWVkOiAxLFxyXG4gICAgICAgICAgICBzY29yZTogMCxcclxuICAgICAgICAgICAgYmxvY2tzOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZnJ1aXQgPSB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAxLFxyXG4gICAgICAgICAgICBjb3VudGRvd246IDAsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7IHg6IC0xLCB5OiAtMSB9LFxyXG4gICAgICAgICAgICBpbnRlcnZhbDogKChNYXRoLnNxcnQodGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0KSAvIDQpICogMTApIC8gdGhpcy5ibG9ja1NpemVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDU7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5ibG9ja3MucHVzaChbdGhpcy5ibG9ja1NpemUsIHRoaXMuYmxvY2tTaXplXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYXdCb2FyZCgpO1xyXG4gICAgICAgIHRoaXMuZHJhd1BsYXllcigpO1xyXG4gICAgICAgIHRoaXMuZHJhd0ZydWl0KCk7XHJcbiAgICAgICAgdGhpcy5kcmF3U3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBsb29wKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc1BhdXNlZCAmJiAhdGhpcy5pc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0JvYXJkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd1Njb3JlYm9hcmQoKTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3UGxheWVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0ZydWl0KCk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVBsYXllcigpO1xyXG4gICAgICAgICAgICB0aGlzLmRldGVjdENvbGxpc2lvbigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50ID0gc2V0VGltZW91dCgoKSA9PiB7IHRoaXMubG9vcCgpOyB9LCA3MCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUtleXByZXNzKGV2ZW50KSB7XHJcbiAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMzI6IC8vIHNwYWNlYmFyXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0dhbWVPdmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR1cCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzUGF1c2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9vcCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdQYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnQgYXJyb3cga2V5XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIuZGlyZWN0aW9uICE9IFwicmlnaHRcIikgdGhpcy5wbGF5ZXIuZGlyZWN0aW9uID0gXCJsZWZ0XCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzODogLy8gdXAgYXJyb3cga2V5XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIuZGlyZWN0aW9uICE9IFwiZG93blwiKSB0aGlzLnBsYXllci5kaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOTogLy8gcmlnaHQgYXJyb3cga2V5XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIuZGlyZWN0aW9uICE9IFwibGVmdFwiKSB0aGlzLnBsYXllci5kaXJlY3Rpb24gPSBcInJpZ2h0XCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvdyBrZXlcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYXllci5kaXJlY3Rpb24gIT0gXCJ1cFwiKSB0aGlzLnBsYXllci5kaXJlY3Rpb24gPSBcImRvd25cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3Qm9hcmQoKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMCwgMCwgMClcIjtcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KHRoaXMuYmxvY2tTaXplLCB0aGlzLmJsb2NrU2l6ZSwgdGhpcy53aWR0aCAtICh0aGlzLmJsb2NrU2l6ZSAqIDIpLCB0aGlzLmhlaWdodCAtICh0aGlzLmJsb2NrU2l6ZSAqIDIpKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3U2NvcmVib2FyZCgpIHtcclxuICAgICAgICBsZXQgeCA9IHRoaXMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICB5ID0gKHRoaXMuaGVpZ2h0IC8gMikgKyA0MDtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguZm9udCA9IFwiMTUwcHQgTHVjaWRhIENvbnNvbGVcIjtcclxuICAgICAgICB0aGlzLmN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmdiYSg4NCwgODQsIDg0LCAwLjUpXCI7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFRleHQodGhpcy5wbGF5ZXIuc2NvcmUsIHgsIHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdQbGF5ZXIoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiB0aGlzLnBsYXllci5ibG9ja3MpIHtcclxuICAgICAgICAgICAgbGV0IFsgeCwgeSBdID0gdGhpcy5wbGF5ZXIuYmxvY2tzW2ldO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMjM4LCAyMzgsIDIzOClcIjtcclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoeCwgeSwgdGhpcy5ibG9ja1NpemUsIHRoaXMuYmxvY2tTaXplKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwicmdiKDI1NSwgMCwgMClcIjtcclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoeCArIDEsIHkgKyAxLCB0aGlzLmJsb2NrU2l6ZSAtIDEsIHRoaXMuYmxvY2tTaXplIC0gMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXdGcnVpdCgpIHtcclxuICAgICAgICBsZXQgeCA9IHRoaXMuZnJ1aXQucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgeSA9IHRoaXMuZnJ1aXQucG9zaXRpb24ueTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZnJ1aXQuY291bnRkb3duIDw9IDApIHtcclxuICAgICAgICAgICAgbGV0IG5vdERvbmUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKG5vdERvbmUpIHtcclxuICAgICAgICAgICAgICAgIHggPSB0aGlzLnJhbmRvbUZyb21UbygxLCAodGhpcy53aWR0aCAvIHRoaXMuYmxvY2tTaXplIC0gMikpICogdGhpcy5ibG9ja1NpemU7XHJcbiAgICAgICAgICAgICAgICB5ID0gdGhpcy5yYW5kb21Gcm9tVG8oMSwgKHRoaXMuaGVpZ2h0IC8gdGhpcy5ibG9ja1NpemUgLSAyKSkgKiB0aGlzLmJsb2NrU2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgZnJ1aXQgaXMgbm90IG9uIGFuIG9jY3VwaWVkIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMucGxheWVyLmJsb2Nrcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBbIHB4LCBweSBdID0gdGhpcy5wbGF5ZXIuYmxvY2tzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoeCAhPSBweCAmJiB5ICE9IHB5KSBub3REb25lID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuZnJ1aXQucG9zaXRpb24ueCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMuZnJ1aXQucG9zaXRpb24ueSA9IHk7XHJcbiAgICAgICAgICAgIHRoaXMuZnJ1aXQuY291bnRkb3duID0gdGhpcy5mcnVpdC5pbnRlcnZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZnJ1aXQuY291bnRkb3duIC09IDE7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCJyZ2IoMzQsIDEzOSwgMzQpXCI7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoeCwgeSwgdGhpcy5ibG9ja1NpemUsIHRoaXMuYmxvY2tTaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3Q2VudGVyZWRUZXh0KHRleHQsIGNvbG9yID0gXCJibHVlXCIpIHtcclxuICAgICAgICBsZXQgeCA9IHRoaXMud2lkdGggLyAyLFxyXG4gICAgICAgICAgICB5ID0gdGhpcy5oZWlnaHQgLyAyO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5mb250ID0gKDMwICogKHRoaXMud2lkdGggLyA0MDApKSArICdwdCBDYWxpYnJpJztcclxuICAgICAgICB0aGlzLmN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdTdGFydCgpIHtcclxuICAgICAgICB0aGlzLmRyYXdDZW50ZXJlZFRleHQoXCJTbmFrZSFcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd1BhdXNlKCkge1xyXG4gICAgICAgIHRoaXMuZHJhd0NlbnRlcmVkVGV4dChcIlBhdXNlZCFcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0dhbWVPdmVyKCkge1xyXG4gICAgICAgIHRoaXMuZHJhd0NlbnRlcmVkVGV4dChcIkdhbWUgT3ZlciFcIik7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVBsYXllcigpIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMucGxheWVyLmRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuYmxvY2tzLnVuc2hpZnQoW3RoaXMucGxheWVyLmJsb2Nrc1swXVswXSAtIHRoaXMuYmxvY2tTaXplLCB0aGlzLnBsYXllci5ibG9ja3NbMF1bMV1dKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLmJsb2Nrcy51bnNoaWZ0KFt0aGlzLnBsYXllci5ibG9ja3NbMF1bMF0gKyB0aGlzLmJsb2NrU2l6ZSwgdGhpcy5wbGF5ZXIuYmxvY2tzWzBdWzFdXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcInVwXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5ibG9ja3MudW5zaGlmdChbdGhpcy5wbGF5ZXIuYmxvY2tzWzBdWzBdLCB0aGlzLnBsYXllci5ibG9ja3NbMF1bMV0gLSB0aGlzLmJsb2NrU2l6ZV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkb3duXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5ibG9ja3MudW5zaGlmdChbdGhpcy5wbGF5ZXIuYmxvY2tzWzBdWzBdLCB0aGlzLnBsYXllci5ibG9ja3NbMF1bMV0gKyB0aGlzLmJsb2NrU2l6ZV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGxheWVyLmJsb2Nrcy5wb3AoKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXRlY3RDb2xsaXNpb24oKSB7XHJcbiAgICAgICAgbGV0IFsgeCwgeSBdID0gdGhpcy5wbGF5ZXIuYmxvY2tzWzBdO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHN1cmUgdXNlciBpcyB3aXRoIHRoZSBib3VuZHNcclxuICAgICAgICBpZiAoeCA+PSAodGhpcy53aWR0aCAtIHRoaXMuYmxvY2tTaXplKVxyXG4gICAgICAgICAgICB8fCB5ID49ICh0aGlzLmhlaWdodCAtIHRoaXMuYmxvY2tTaXplKVxyXG4gICAgICAgICAgICB8fCB4IDwgdGhpcy5ibG9ja1NpemVcclxuICAgICAgICAgICAgfHwgeSA8IHRoaXMuYmxvY2tTaXplXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0dhbWVPdmVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjaGVjayBpZiB0aGUgcGxheWVyIGNvbGxpZGVkIHdpdGggdGhlIGZydWl0XHJcbiAgICAgICAgaWYgKHggPT0gdGhpcy5mcnVpdC5wb3NpdGlvbi54ICYmIHkgPT0gdGhpcy5mcnVpdC5wb3NpdGlvbi55KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnNjb3JlICs9IHRoaXMuZnJ1aXQudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZnJ1aXQuY291bnRkb3duID0gMDtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuYmxvY2tzLnB1c2godGhpcy5wbGF5ZXIuYmxvY2tzW3RoaXMucGxheWVyLmJsb2Nrcy5sZW5ndGggLSAxXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjaGVjayBpZiBwbGF5ZXIgY29sbGlkZWQgd2l0aCBzZWxmXHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiB0aGlzLnBsYXllci5ibG9ja3MpIHtcclxuICAgICAgICAgICAgaWYgKGkgPT0gMCkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXIuYmxvY2tzWzBdWzBdID09IHRoaXMucGxheWVyLmJsb2Nrc1tpXVswXSAmJiB0aGlzLnBsYXllci5ibG9ja3NbMF1bMV0gPT0gdGhpcy5wbGF5ZXIuYmxvY2tzW2ldWzFdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3R2FtZU92ZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByYW5kb21Gcm9tVG8oZnJvbSwgdG8pIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRvIC0gZnJvbSArIDEpICsgZnJvbSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxldCBnYW1lID0gbmV3IFNuYWtlR2FtZShcImdhbWUtYm9hcmRcIik7XHJcbiJdfQ==
