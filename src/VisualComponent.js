Game.VisualComponent = function(htmlElement) {
    this.htmlElement = htmlElement;
};

Game.VisualComponent.prototype.init = function() {
    throw new Game.NotImplementedError();
};

Game.VisualComponent.prototype.addClass = function(newClass) {
    this.htmlElement.classList.add(newClass);
};

Game.VisualComponent.prototype.removeClass = function(removingClass) {
    this.htmlElement.classList.remove(removingClass);
};

Game.VisualComponent.prototype.hasClass = function(checkingClass) {
    return this.htmlElement.classList.contains(checkingClass);
};