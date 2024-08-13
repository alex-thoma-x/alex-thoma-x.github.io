simplyCountdown = function (elt, args) {
    var parameters = extend({
            year: 2020, // Start year
            month: 8, // Start month (August, which is 8)
            day: 14, // Start day
            hours: 0,
            minutes: 0,
            seconds: 0,
            words: {
                days: 'day',
                hours: 'hour',
                minutes: 'minute',
                seconds: 'second',
                pluralLetter: 's'
            },
            plural: true,
            inline: false,
            enableUtc: false, // Consider local time
            onEnd: function () {
                return;
            },
            refresh: 1000,
            inlineClass: 'simply-countdown-inline',
            sectionClass: 'simply-section',
            amountClass: 'simply-amount',
            wordClass: 'simply-word',
            zeroPad: true // Zero-pad numbers for consistency
        }, args),
        interval,
        targetDate,
        now,
        nowUtc,
        secondsLeft,
        days,
        hours,
        minutes,
        seconds,
        cd = document.querySelectorAll(elt);

    // Set the target date to August 14, 2020
    targetDate = new Date(
        parameters.year,
        parameters.month - 1, // Months are 0-based
        parameters.day,
        parameters.hours,
        parameters.minutes,
        parameters.seconds
    );

    Array.prototype.forEach.call(cd, function (countdown) {
        var fullCountDown = createElements(parameters, countdown),
            refresh;

        refresh = function () {
            var dayWord,
                hourWord,
                minuteWord,
                secondWord;

            now = new Date();
            if (parameters.enableUtc) {
                nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
                    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
                secondsLeft = (nowUtc.getTime() - targetDate.getTime()) / 1000;
            } else {
                secondsLeft = (now.getTime() - targetDate.getTime()) / 1000;
            }

            if (secondsLeft > 0) {
                days = parseInt(secondsLeft / 86400, 10);
                secondsLeft = secondsLeft % 86400;

                hours = parseInt(secondsLeft / 3600, 10);
                secondsLeft = secondsLeft % 3600;

                minutes = parseInt(secondsLeft / 60, 10);
                seconds = parseInt(secondsLeft % 60, 10);
            } else {
                days = 0;
                hours = 0;
                minutes = 0;
                seconds = 0;
                window.clearInterval(interval);
                parameters.onEnd();
            }

            if (parameters.plural) {
                dayWord = days > 1 ? parameters.words.days + parameters.words.pluralLetter : parameters.words.days;
                hourWord = hours > 1 ? parameters.words.hours + parameters.words.pluralLetter : parameters.words.hours;
                minuteWord = minutes > 1 ? parameters.words.minutes + parameters.words.pluralLetter : parameters.words.minutes;
                secondWord = seconds > 1 ? parameters.words.seconds + parameters.words.pluralLetter : parameters.words.seconds;
            } else {
                dayWord = parameters.words.days;
                hourWord = parameters.words.hours;
                minuteWord = parameters.words.minutes;
                secondWord = parameters.words.seconds;
            }

            if (parameters.inline) {
                countdown.innerHTML =
                    days + ' ' + dayWord + ', ' +
                    hours + ' ' + hourWord + ', ' +
                    minutes + ' ' + minuteWord + ', ' +
                    seconds + ' ' + secondWord + '.';
            } else {
                fullCountDown.days.amount.textContent = (parameters.zeroPad && days.toString().length < 2 ? '0' : '') + days;
                fullCountDown.days.word.textContent = dayWord;

                fullCountDown.hours.amount.textContent = (parameters.zeroPad && hours.toString().length < 2 ? '0' : '') + hours;
                fullCountDown.hours.word.textContent = hourWord;

                fullCountDown.minutes.amount.textContent = (parameters.zeroPad && minutes.toString().length < 2 ? '0' : '') + minutes;
                fullCountDown.minutes.word.textContent = minuteWord;

                fullCountDown.seconds.amount.textContent = (parameters.zeroPad && seconds.toString().length < 2 ? '0' : '') + seconds;
                fullCountDown.seconds.word.textContent = secondWord;
            }
        };

        // Refresh immediately to prevent a Flash of Unstyled Content
        refresh();
        interval = window.setInterval(refresh, parameters.refresh);
    });
};
