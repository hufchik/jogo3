/**
 * namespace
 * @constructor
 */
function Game() {
}

/**
 * ������, ����������� ��� ���������� ���������� ��� ������������.
 * @constructor
 */
Game.NotImplementedError =  function() {
    this.name = 'NotImplementedError';
    this.message = 'Member has not implementation.';

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, Game.NotImplementedError);
    } else {
        this.stack = (new Error()).stack;
    }
};
Game.NotImplementedError.prototype = Object.create(Error.prototype);

Game.showError = function(message, error) {
    alert(message);
};

Game.isObject = function(object) {
    return object != null && typeof object === 'object';
};

/**
 * ��������� ���� ��������.
 * ���������� ����������. ��� ����� ���������� ������� ���������� ��������� ��������.
 * ����� ���������� ������ ������� �������, ��� ��� �� ������ ������ ������������ ������� ��������� �� ��������� �� ������� �������.
 * @param {object} object1 ������ ������ ��� ���������.
 * @param {object} object2 ������ ������ ��� ���������.
 * @returns {boolean} ����� �� �������.
 */
Game.deepEqual = function(object1, object2) {
    for (var prop in object1) {
        if (!object2.hasOwnProperty(prop)) {
            return false;
        }

        if (Game.isObject(object1[prop])) {
            return Game.deepEqual(object1[prop], object2[prop]);
        }

        if (object1[prop] !== object2[prop]) {
            return false;
        }
    }

    return true;
};

Game.applyMixin = function($class, mixin) {
    for (var key in mixin) {
        if ($class.hasOwnProperty(key)) {
            throw new Error('Class has mixin\'s member. It can\'t be replaced.');
        }

        $class.prototype[key] = mixin[key];
    }
};

Game.undoMixin = {
    currentActionIndex: -1,
    actionList: [],
    undo: function () {
        if (this.currentActionIndex < 0) {
            return;
        }

        var lastAction = this.actionList[this.currentActionIndex];
        this.applyAction(lastAction.oldValue, lastAction.refObject);
        this.currentActionIndex--;
    },
    redo: function () {
        if (this.currentActionIndex >= this.actionList.length - 1) {
            return;
        }

        this.currentActionIndex++;
        var lastAction = this.actionList[this.currentActionIndex];
        this.applyAction(lastAction.newValue, lastAction.refObject);
    },
    makeAction: function (oldValue, newValue, refObject) {
        if (Game.deepEqual(oldValue, newValue)) {
            return;
        }

        this.currentActionIndex++;
        this.actionList = this.actionList.splice(0, this.currentActionIndex);
        this.actionList.push(new Game.Action(oldValue, newValue, refObject));
    },
    applyAction: function (value, refObject) {
        throw new Game.NotImplementedError();
    },
    clearActions: function () {
        this.currentActionIndex = -1;
        this.actionList = [];
    }
};

Game.Action = function(oldValue, newValue, refObject) {
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.refObject = refObject;
};