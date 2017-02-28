Game.Field = function(fieldElementId, winCallBack) {
    Game.VisualComponent.call(this, document.getElementById(fieldElementId));
    this.cells = [];
    this.collisionCell = null;
    this.currentCell = null;
    this._winCallback = winCallBack;

    for (var i = 0; i < 9; i++) {
        this.cells[i] = new Array(9);
    }
};

Game.Field.prototype = Object.create(Game.VisualComponent.prototype);
Game.applyMixin(Game.Field, Game.undoMixin);
Game.Field.COLLISION_CELL_CLASS = 'collisionCell';

Game.Field.prototype.init = function() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            this.htmlElement.appendChild(this._createRec(i, j));
        }
    }
};

Game.Field.prototype.setValues = function(matrix) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (matrix[i][j] > 0 && matrix[i][j] < 10) {
                this.cells[i][j].setValue(matrix[i][j]);
                this.cells[i][j].changeLocked(true);
            }
        }
    }
};

Game.Field.prototype.clear = function() {
    this.clearActions();
    this._clearCollisionCell();

    if (this.currentCell) {
        this.currentCell.changeCurrent(false);
        this.currentCell = null;
    }

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            this.cells[i][j].refresh();
        }
    }
};

Game.Field.prototype.changeCurrentCell = function(newCurrentCell) {
    if (newCurrentCell == this.currentCell) {
        return;
    }

    if (this.currentCell) {
        this.currentCell.changeCurrent(false);
    }

    this.currentCell = newCurrentCell;

    if (newCurrentCell) {
        newCurrentCell.changeCurrent(true);
    }
};

Game.Field.prototype.changeCurrentValue = function(value, mark) {
    if (!this.currentCell) {
        return;
    }

    this._clearCollisionCell();

    if (!mark) {
        var collisionPostion = this._getCollisionPositionByCell(this.currentCell, value);

        if (collisionPostion) {
            this.collisionCell = this.cells[collisionPostion.row][collisionPostion.col];
            this.collisionCell.addClass(Game.Field.COLLISION_CELL_CLASS);
            return;
        }
    }

    var oldValue = {
        value: this.currentCell.getRawValue(),
        mark: this.currentCell.isMark()
    };

    this.currentCell.changeValue(value, mark);

    if (this._isSolved()) {
        this._winCallback();
    }

    var newValue = {
        value: this.currentCell.getRawValue(),
        mark: this.currentCell.isMark()
    };
    this.makeAction(oldValue, newValue, this.currentCell);
};

Game.Field.prototype.applyAction = function(value, refObjerct) {
    // Для начала устанавливаем пустое значение, чтобы логика с добавлением меток перестала работать в этом случае.
    refObjerct.setValue(null);

    refObjerct.changeValue(value.value, value.mark);
};

Game.Field.prototype._isSolved = function() {
    var matrix = this._getMatrix();

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (!matrix[i][j] || this._getCollisionPosition(matrix, i, j, matrix[i][j])) {
                return false;
            }
        }
    }

    return true;
};

Game.Field.prototype._getMatrix = function() {
    var matrix = [];

    for (var i = 0; i < 9; i++) {
        matrix[i] = new Array(9);

        for (var j = 0; j < 9; j++) {
            matrix[i][j] = this.cells[i][j].getValue();
        }
    }

    return matrix;
};

Game.Field.prototype._clearCollisionCell = function() {
    if (this.collisionCell) {
        this.collisionCell.removeClass(Game.Field.COLLISION_CELL_CLASS);
        this.collisionCell = null;
    }
};

Game.Field.prototype._getCollisionPosition = function(matrix, row, col, value) {
    if (!value) {
        return null;
    }

    var i, j;

    // Checking row.
    for (j = 0; j < 9; j++) {
        if (j != col && matrix[row][j] == value) {
            return {row: row, col: j};
        }
    }

    // Checking column.
    for (i = 0; i < matrix.length; i++) {
        if (i != row && matrix[i][col] == value) {
            return {row: i, col: col};
        }
    }

    // Checking rectangle.
    var currentRow, currentCol,
        startingRow = Math.floor(row / 3) * 3,
        startingCol = Math.floor(col / 3) * 3;

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            currentRow = startingRow + i;
            currentCol = startingCol + j;

            if (currentRow != row && currentCol != col && matrix[currentRow][currentCol] == value) {
                return {row: currentRow, col: currentCol};
            }
        }
    }

    return null;
};

Game.Field.prototype._getCollisionPositionByCell = function(cell, value) {
    var matrix = this._getMatrix();
    return this._getCollisionPosition(matrix, cell.row, cell.col, value);
};

Game.Field.prototype._createRec = function (row, col) {
    var i, j,
        rec = document.createElement('div');
    rec.classList.add('fieldRec');

    if (row > 0 && col % 3 == 0) {
        rec.classList.add('nextLine');
    }

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            var cell = this._createCell(row * 3 + i, col * 3 + j);
            this.cells[row * 3 + i][col * 3 + j] = cell;
            rec.appendChild(cell.htmlElement);
            cell.init();
        }
    }

    return rec;
};

Game.Field.prototype._createCell = function (row ,col) {
    var field = this,
        cell = new Game.Cell(row, col, function () {
            if (cell.isLocked()) {
                return;
            }

            field.changeCurrentCell(cell);
        });
    return cell;
};