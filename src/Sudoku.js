Game.Sudoku = function () {
    this.currentMatrix = null;
    this.field = new Game.Field('Field', this._showWin);
}

Game.Sudoku.HIDDEN_CLASS = 'hidden';
Game.Sudoku.MENU_BUTTON_CLASS = 'menuButton';
Game.Sudoku.KEYBOARD_BUTTON_CLASS = 'keyboardButton';
Game.Sudoku.PROCESS_GIF_SOURCE = 'resources/process.gif';

Game.Sudoku.prototype.init = function() {
    var keyboardValues = document.getElementById('KeyboardValues'),
        keyboardMarks = document.getElementById('KeyboardMarks'),
        keyboardAdditional = document.getElementById('KeyboardAdditional'),
        game = this;

    this.field.init();

    document.onkeypress = function (e) {
        e = e || window.event;

        if (!game.field.currentCell) {
            return;
        }
        if (e.keyCode >= 49 && e.keyCode <= 57) {
            game.field.changeCurrentValue(e.keyCode - 48);
        } else if (e.keyCode == 32) {
            game.field.changeCurrentValue(null);
        } else {
            var value;
            switch (e.keyCode) {
                case 33:
                    value = 1;
                    break;
                case 64:
                    value = 2;
                    break;
                case 35:
                    value = 3;
                    break;
                case 36:
                    value = 4;
                    break;
                case 37:
                    value = 5;
                    break;
                case 94:
                    value = 6;
                    break;
                case 38:
                    value = 7;
                    break;
                case 42:
                    value = 8;
                    break;
                case 40:
                    value = 9;
                    break;
            }

            if (value) {
                game.field.changeCurrentValue(value, true);
            }
        }
    };

    this._newGameButton = $('#NewGame');
    this._newGameButton.gameButton({
        caption: 'New game',
        title: 'Start new game',
        buttonClass: Game.Sudoku.MENU_BUTTON_CLASS,
        clickCallback: function () {
            game._fillField();
        },
        processGif: Game.Sudoku.PROCESS_GIF_SOURCE
    });

    this._refreshButton = $('#Refresh');
    this._refreshButton.gameButton({
        caption: 'Refresh',
        title: 'Refresh current game',
        buttonClass: Game.Sudoku.MENU_BUTTON_CLASS,
        clickCallback: function () {
            game._fillField(game.currentMatrix);
        },
        processGif: Game.Sudoku.PROCESS_GIF_SOURCE
    }).hide();

    function clickKeyboardButton(number, mark) {
        return function () {
            game.field.changeCurrentValue(number, mark);
        }
    }

    for (var i = 1; i < 10; i++) {
        var numberButton = document.createElement('div');
        numberButton.classList.add(Game.Sudoku.KEYBOARD_BUTTON_CLASS);
        numberButton.innerHTML = '' + i;
        numberButton.onclick = clickKeyboardButton(i);
        keyboardValues.appendChild(numberButton);

        var markButton = document.createElement('div');
        markButton.classList.add(Game.Sudoku.KEYBOARD_BUTTON_CLASS);
        markButton.innerHTML = '' + i;
        markButton.onclick = clickKeyboardButton(i, true);
        keyboardMarks.appendChild(markButton);
    }

    var undoButton = document.createElement('div'),
        redoButton = document.createElement('div'),
        clearButton = document.createElement('div');
    undoButton.classList.add(Game.Sudoku.KEYBOARD_BUTTON_CLASS);
    redoButton.classList.add(Game.Sudoku.KEYBOARD_BUTTON_CLASS);
    clearButton.classList.add(Game.Sudoku.KEYBOARD_BUTTON_CLASS);
    undoButton.innerHTML = '&#8592;';
    redoButton.innerHTML = '&#8594;';
    clearButton.innerHTML = '&#215;';
    undoButton.title = 'Undo last changes';
    clearButton.title = 'Clear current cell';
    redoButton.title = 'Redo last undo changes';
    keyboardAdditional.appendChild(undoButton);
    keyboardAdditional.appendChild(clearButton);
    keyboardAdditional.appendChild(redoButton);

    clearButton.onclick = function () {
        game.field.changeCurrentValue(null);
    };

    undoButton.onclick = function () {
        game.field.undo();
    };

    redoButton.onclick = function () {
        game.field.redo();
    };
};

Game.Sudoku.prototype._fillField = function(matrix) {
    this.field.clear();

    if (!matrix) {
        try {
            matrix = getSudoku().array;
        }
        catch (error) {
            Game.showError('Generation error. Please try again.', error);
            return;
        }
    }

    this.field.setValues(matrix);
    this.currentMatrix = matrix;
    this._refreshButton.show();
};

Game.Sudoku.prototype._showWin = function() {
    alert('Completed');
};