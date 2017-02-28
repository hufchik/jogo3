Game.Cell = function(row, col, clickEventHandler) {
    Game.VisualComponent.call(this, document.createElement('div'));

    this.row = row;
    this.col = col;
    this._clickEventHandler = clickEventHandler;

    if (row > 0 && col % 3 == 0) {
        this.addClass('nextLine');
    }

    this._locked = false;
};

Game.Cell.prototype = Object.create(Game.VisualComponent.prototype);
Game.Cell.CURRENT_CELL_CLASS = 'currentCell';
Game.Cell.LOCKED_CELL_CLASS = 'lockedCell';
Game.Cell.MARK_CELL_CLASS = 'marks';

Game.Cell.prototype.init = function() {
    var cell = this;

    this.addClass('fieldCell');
    this.htmlElement.setAttribute('id', 'Cell' + this.row + this.col);
    this.htmlElement.onclick = function () {
        cell._clickEventHandler.call(this);
    }
};

Game.Cell.prototype.isCurrent = function() {
    return this.hasClass(Game.Cell.CURRENT_CELL_CLASS);
};

Game.Cell.prototype.isLocked = function() {
    return this._locked;
};

Game.Cell.prototype.isMark = function() {
    return this.hasClass(Game.Cell.MARK_CELL_CLASS);
};

Game.Cell.prototype.changeCurrent = function(current) {
    if (this._locked) {
        return;
    }

    if (current) {
        this.addClass(Game.Cell.CURRENT_CELL_CLASS);
    } else {
        this.removeClass(Game.Cell.CURRENT_CELL_CLASS);
    }
};

Game.Cell.prototype.changeMark = function(mark) {
    if (this._locked) {
        return;
    }

    if (mark) {
        this.addClass(Game.Cell.MARK_CELL_CLASS);
    } else {
        this.removeClass(Game.Cell.MARK_CELL_CLASS);
    }
};

Game.Cell.prototype.changeLocked = function(lock) {
    this._locked = lock;

    if (lock) {
        this.addClass(Game.Cell.LOCKED_CELL_CLASS);
    } else {
        this.removeClass(Game.Cell.LOCKED_CELL_CLASS);
    }
};

Game.Cell.prototype.refresh = function() {
    this.setValue(null);
    this.changeLocked(false);
    this.changeMark(false);
};

Game.Cell.prototype.changeValue = function(value, mark) {
    if (mark) {
        var currentValue = this.isMark() ? this.getRawValue() : '';

        if (currentValue.includes(value)) {
            value = currentValue.replace(value, '');
        } else {
            var marks = Array.from(currentValue).map(function (x) {
                    return +x;
                }),
                insertPosition = marks.length,
                i;

            for (i = 0; i < marks.length; i++) {
                if (marks[i] > value) {
                    insertPosition = i;
                    break;
                }
            }

            marks.splice(insertPosition, 0, value);
            value = marks.join('');
        }

        this.changeMark(true);
        this.setValue(value);
    } else {
        this.changeMark(false);
        this.setValue(value);
    }
};

Game.Cell.prototype.setValue = function(value) {
    this.htmlElement.innerHTML = value || '';
};

Game.Cell.prototype.getValue = function() {
    return this.isMark() ? null : +this.getRawValue();
};

Game.Cell.prototype.getRawValue = function() {
    return this.htmlElement.innerHTML;
};