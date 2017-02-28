(function($) {
    /**
     * JQuery ������ ��� ����������� ������ � ���������� ���������� �����.
     * @param {object} options ��������� �������.
     * @param {string} options.caption ����� ������.
     * @param {string} options.title ����� ������������ tooltip'� ��� ���������.
     * @param {string} options.buttonClass Css-r���� ��� ����� ������, ��� ����� ��������� ���������.
     * @param {function} options.clickCallback ���������� ����� �� ������.
     * @param {string} options.processGif ���� �� gif-����� ��� ����������� �������� ��������� ��������.
     * @returns {*|HTMLElement} JQuery ������ �������������� ������.
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
