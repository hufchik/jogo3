(function($) {
    /**
     * JQuery плагин для отображения кнопки с прогрессом выполнения рядом.
     * @param {object} options настройки плагина.
     * @param {string} options.caption Текст кнопки.
     * @param {string} options.title Текст всплывающего tooltip'а при наведении.
     * @param {string} options.buttonClass Css-rласс для самой кнопки, для более детальной настройки.
     * @param {function} options.clickCallback Обработчик клика по кнопке.
     * @param {string} options.processGif Путь до gif-файла для отображения процесса выполения операции.
     * @returns {*|HTMLElement} JQuery объект сформированной кнопки.
     */
    $.fn.gameButton = function (options) {
        var settings = $.extend({
                caption: 'NewButton',
                title: '',
                buttonClass: null,
                clickCallback: null,
                processGif: 'process.gif'
            }, options),
            button = $('<input/>'),
            process = $('<img/>'),
            $this = $(this),
            PROCESS_SIZE = 20;

        function hideProcess() {
            var buttonMargin = +button.css('margin-right') || 0;
            button.css('margin-right', buttonMargin + PROCESS_SIZE + 'px');
            process.hide();
        }

        function showProcess() {
            var buttonMargin = +button.css('margin-right') || PROCESS_SIZE;
            button.css('margin-right', buttonMargin - PROCESS_SIZE + 'px');
            process.show();
        }

        function onClickButton() {
            if (!settings.clickCallback) {
                return;
            }

            showProcess();
            setTimeout(function () {
                settings.clickCallback();
                hideProcess();
            }, 10);
        }

        button.attr({
            value: settings.caption,
            title: settings.title,
            type: 'submit'
        });
        button.addClass(settings.buttonClass);
        button.on('click', onClickButton);
        process.attr('src', settings.processGif);
        process.css('float', 'right');
        process.css('height', PROCESS_SIZE + 'px');
        hideProcess();

        $this.append(button);
        $this.append(process);

        return $this;
    };
})( jQuery );
