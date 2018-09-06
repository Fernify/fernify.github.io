(function ($) {
    $.fn.GhostType = function (options) {
        var settings = $.extend(true, {
            words: ["Daniel Fernandez", "a Web Developer", "Fernify"],
            showWordTime: 1.5,
            hideWordTime: .5,
            cursor: true,
            cursorChar: "|",
            cursorTime: 0.5,
            stutter: false,
            stutterErase: false,
            stutterProbability: 0.5
        }, options);

        return this.each(function () {
            var timeInterval = 100;
            var showTimeInterval = (settings.showWordTime * 1000) / timeInterval;
            var hideTimeInterval = (settings.hideWordTime * 1000) / timeInterval;
            var cursorInterval = (settings.cursorTime * 1000) / timeInterval;
            var keyWords = settings.words;
            var cursorShow = settings.cursor;
            var stutterWrite = settings.stutter;
            var stutterErase = settings.stutterErase;
            var stutterProbability = settings.stutterProbability;

            $(this).append("<span id=\"gttext\"></span>");
            if (cursorShow) {
                $(this).append("<span id=\"gtcursor\">" + settings.cursorChar + "</span>");
            }

            var mode = 4;
            var intervalCount = 0;
            var wordIndex = 0;
            var letterIndex = 0;
            var cursorCount = 0;

            setInterval($.proxy(ghoster, this), timeInterval);

            function ghoster() {
                var inWord = $("#gttext").text();
                var currWord = keyWords[wordIndex];
                var inWordLength = inWord.length;
                var stutterProbOutcome, stutter = true, stutterOnClear = true;
                if((stutterWrite && mode == 1) || (stutterErase && mode == 3)){
                    stutterProbOutcome = !(Math.random() < stutterProbability);
                    stutter = (stutterProbOutcome && stutterWrite);
                    stutterOnClear = (stutterProbOutcome && stutterErase);
                }
                if (cursorShow) {
                    cursorCount++;
                    if (cursorCount == cursorInterval) {
                        if ($("#gtcursor").is(":visible") && ((mode != 1 && stutter)||(mode != 3 && stutterOnClear))) {
                            $("#gtcursor").hide();
                        } else {
                            $("#gtcursor").show();
                        }
                        cursorCount = 0;
                    }
                }
                if (mode == 1 && stutter) {
                    letterIndex++;
                    $("#gttext").text(currWord.substring(0, letterIndex));
                    if (letterIndex == currWord.length) {
                        mode++;
                        letterIndex = inWordLength + 1;
                        wordIndex++;
                        if (wordIndex == keyWords.length) {
                            wordIndex = 0;
                        }
                    }
                }
                else if (mode == 2) {
                    intervalCount++;
                    if (intervalCount == showTimeInterval) {
                        mode++;
                        intervalCount = 0;
                    }
                }
                else if (mode == 3 && stutterOnClear) {
                    letterIndex--;
                    $("#gttext").text(inWord.substring(0, letterIndex));
                    if (letterIndex == 0) {
                        mode++;
                    }
                }
                else if (mode == 4) {
                    intervalCount++;
                    if (intervalCount == hideTimeInterval) {
                        mode = 1;
                        intervalCount = 0;
                    }
                }
            }
        });
    };
}(jQuery));