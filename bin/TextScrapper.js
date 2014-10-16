(function ($) {
    defaults = {
        maxLength: 0,
        prevIcon: 'glyphicon glyphicon-play',
        nextIcon: 'glyphicon glyphicon-play',
        onPrevCallBack: function (index, lastIndex) { },
        onNextCallBack: function (index, lastIndex) { },
    };

    var TextScrapperControl = function (element, optionsT) {
        this.$element = $(element);
        this.textChunks = [];
        this.index = 0;
        this.lastIndex = 0;
        this.init(optionsT);
    }
    TextScrapperControl.prototype = {
        constructor: TextScrapperControl,
        init: function (optionsT) {
            var self = this;
            self.options = $.extend(defaults, optionsT);
            var txt = self.$element.text();
            if (txt.length > self.options.maxLength) {
                self.textChunks = txt.chunkString([self.options.maxLength]);
                var imParent = self.$element.parent();
                self.$element.text(self.textChunks[0]);
                self.$element.prepend("<i class='" + self.options.prevIcon + " txtprev' title='Prev' style='display:none; line-height: 1.6; -webkit-transform: rotate(180deg); -moz-transform: rotate(180deg); -o-transform: rotate(180deg); -ms-transform: rotate(180deg);'></i>");
                self.$element.append("<i class='" + self.options.nextIcon + " txtnext' title='Next' style='display:none;'></i>");
                self.$element.find(".txtprev").click(function () { self.onPrev(); });
                self.$element.find(".txtnext").click(function () { self.onNext(); });
                self.$element.find(".txtnext").show();
                for (var x = 0; x < self.textChunks.length; x++) {
                    self.$element.append("<input class='txtscrap txtscrapid_" + x + "' type='hidden' value='" + self.textChunks[x] + "' />");
                }
            }
        },
        onPrev: function () {
            var self = this;
            self.lastIndex = self.index;
            if (--self.index < 0) self.index = (self.$element.find(".txtscrap").length - 1); // if prev is less than first to to last
            self.$element.contents()[1].nodeValue = self.$element.find(".txtscrapid_" + self.index).val();
            if (self.index == 0) {
                self.$element.find(".txtprev").hide();
            }
            if (self.onPrevCallBack) {
                self.options.onPrevCallBack.call(self.index, self.lastIndex);
            }
        },
        onNext: function () {
            var self = this;
            self.lastIndex = self.index;
            if (++self.index == self.$element.find(".txtscrap").length) self.index = 0; // if next is out of bounds go to first
            self.$element.contents()[1].nodeValue = self.$element.find(".txtscrapid_" + self.index).val();
            if (self.index > 0) {
                self.$element.find(".txtprev").show();
            }
            else {
                self.$element.find(".txtprev").hide();
            }
            if (self.onNextCallBack) {
                self.options.onNextCallBack.call(self.index, self.lastIndex);
            }

        }
    }

    $.fn.textscrapper = function (option) {
        var $this = this;
        var args = Array.prototype.slice.call(arguments, 1);
        return $this.each(function () {
            var that = this;
            var $that = $(that);
            var data = $that.data('textscrapper')
            , options = typeof option == 'object' && option

            if (!data) {
                $that.data('textscrapper', (data = new TextScrapperControl(that, options)));
            }
            else {
                if (typeof options != 'string') {
                    data.init(option)
                }
            }
            if (typeof option == 'string') data[option].apply(data, args);
        });
    }

    $.fn.textscrapper.Constructor = TextScrapperControl;

    String.prototype.chunkString = function (len) {
        var _ret;
        if (this.length < 1) {
            return [];
        }
        if (typeof len === 'number' && len > 0) {
            var _size = Math.ceil(this.length / len), _offset = 0;
            _ret = new Array(_size);
            for (var _i = 0; _i < _size; _i++) {
                _ret[_i] = this.substring(_offset, _offset = _offset + len);
            }
        }
        else if (typeof len === 'object' && len.length) {
            var n = 0, l = this.length, chunk, that = this;
            _ret = [];
            do {
                len.forEach(function (o) {
                    chunk = that.substring(n, n + o);
                    if (chunk !== '') {
                        _ret.push(chunk);
                        n += chunk.length;
                    }
                });
                if (n === 0) {
                    return undefined; // prevent an endless loop when len = [0]
                }
            } while (n < l);
        }
        return _ret;
    };
}(jQuery));

