$(function () {

    function Paper() {
        var DEF_KAMIKIRE_MAX = 200;

        var kamikire_array = [];
        var cvs;
        var ctx;
        var stageWidth, stageHeight;
        var resizeFlg = true;
        var colorFlag = true;
        var colorList = ['#ffffff', '#c4b543', '#e2c72b', '#f7eaad'];
        var colorListLength = colorList.length;

        //
        window.onload = function () {
            init();
        };

        //åˆæœŸå‡¦ç†
        function init() {

            cvs = $('.js-Paper')[0];

            //ã‚¦ã‚£ãƒ³ãƒ‰ã‚¦ã‚µã‚¤ã‚ºè¨­å®š
            stageWidth = window.innerWidth ? window.innerWidth : $(window).width();
            stageHeight = window.innerHeight ? window.innerHeight : $(window).height();
            cvs.width = stageWidth;
            cvs.height = stageHeight;

            ctx = cvs.getContext("2d");
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, cvs.width, cvs.height);

            //ç”Ÿæˆ
            for (var i = 0; i < DEF_KAMIKIRE_MAX; i++) {
                var color = colorList[Math.floor(Math.random() * (colorListLength - 0))];
                var kami = new Kamikire(3 + Math.floor(Math.random() * 8), color);

                kami.x = Math.random() * stageWidth;
                kami.y = Math.random() * stageHeight;

                ctx.fillStyle = "#" + kami._r + kami._g + kami._b;
                ctx.fillRect(kami.x, kami.y, kami.SIZE, kami.SIZE);

                //
                kamikire_array.push(kami);
            }

            setInterval(EnterFrame, 30);
        }

        //ç´™ãµã¶ã
        function Kamikire(_size, _color) {
            this.SIZE = _size;
            this.color = _color
            this.x = 0;
            this.y = 0;
            this.alpha = 1;

            var t = Math.random() * Math.PI * 2;

            var hue = 100;
            var sat = 60;
            var val = Math.round(Math.random() * 50) + 50;

            if (colorFlag) {
                this._r = 255;
                this._g = 215;
                this._b = 0;
                colorFlag = false;
            } else {
                this._r = 0;
                this._g = 255;
                this._b = 127;
                colorFlag = true;
            }

            this._backColor = 0x010101 * Math.floor(127 + Math.random() * 64);
            this._omega = (Math.random() * 2 - 1) * Math.PI / 4;
            this._fallTheta = 0;
            //this._fallSpeed = 1+Math.random()*2;
            this._fallSpeed = 2 + Math.random() * 2;

            this._theta = Math.random() * Math.PI * 2;
            this._Ax = 1;
            this._Ay = Math.random();
            this._Az = Math.random() * 2 - 1;
            var _l = Math.sqrt(this._Ax * this._Ax + this._Ay * this._Ay + this._Az * this._Az);
            this._Ax /= _l;
            this._Ay /= _l;
            this._Az /= _l;
            var _s = Math.sqrt(this._Ax * this._Ax + this._Ay * this._Ay);
            if (_s == 0) { // then A == ( 0, 0, -1 );
                this._Bx = 1.0;
                this._By = 0.0;
                this._Bz = 0.0;
                this._Cx = 0.0;
                this._Cy = 1.0;
                this._Cz = 0.0;
            } else {
                this._Bx = this._Ay;
                this._By = -this._Ax;
                this._Bz = 0;
                this._Cx = this._Ax * this._Az;
                this._Cy = this._Ay * this._Az;
                this._Cz = -(_s * _s);
                this._Bx /= _s;
                this._By /= _s;
                this._Cx /= _s * _l;
                this._Cy /= _s * _l;
                this._Cz /= _s * _l;
            }
        }

        Kamikire.prototype = {
            getrotation3D: function() {
                return this._theta - (Math.PI * 2) * Math.floor(this._theta / (Math.PI * 2));
            },
            setrotation3D: function(theta) {
                this._theta = theta - (Math.PI * 2) * Math.floor(theta / (Math.PI * 2));
                var _cos = Math.cos(this._theta);
                var _sin = Math.sin(this._theta);

                // vector F is the rotated image of (1,0,0);
                var _Fx = this._Ax * this._Ax + (this._Bx * this._Bx + this._Cx * this._Cx) * _cos;
                var _Fy = this._Ax * this._Ay + (this._Bx * this._By + this._Cx * this._Cy) * _cos + (this._Bx * this._Cy - this._Cx * this._By) * _sin;
                var _Fz = this._Ax * this._Az + (this._Bx * this._Bz + this._Cx * this._Cz) * _cos - (this._Bx * this._Cz - this._Cx * this._Bz) * _sin;

                // vector G is the rotated image of (0,1,0);
                var _Gx = this._Ax * this._Ay + (this._By * this._Bx + this._Cy * this._Cz) * _cos + (this._By * this._Cx - this._Cy * this._Bx) * _sin;
                var _Gy = this._Ay * this._Ay + (this._By * this._By + this._Cy * this._Cy) * _cos;
                var _Gz = this._Ay * this._Az + (this._By * this._Bz + this._Cy * this._Cz) * _cos + (this._By * this._Cz - this._Cy * this._Bz) * _sin;

                var divide = 1.8;
                ctx.fillStyle = this.color;

                ctx.beginPath();
                ctx.lineTo(this.x - _Fx * this.SIZE / divide + _Gx * this.SIZE / divide, this.y - _Fy * this.SIZE / divide + _Gy * this.SIZE / divide);
                ctx.lineTo(this.x - _Fx * this.SIZE / divide - _Gx * this.SIZE / divide, this.y - _Fy * this.SIZE / divide - _Gy * this.SIZE / divide);
                ctx.lineTo(this.x + _Fx * this.SIZE / 2 + _Gx * this.SIZE / 2, this.y + _Fy * this.SIZE / 2 + _Gy * this.SIZE / 2);
                ctx.closePath();
                ctx.fill();
            },
            fall: function () {
                this.setrotation3D(this.getrotation3D() + this._omega);

                this.x += this._fallSpeed * Math.sin(this._fallTheta);
                this.y += this._fallSpeed * Math.cos(this._fallTheta);
                this._fallTheta += (Math.random() * 2 - 1) * Math.PI / 12;
                if (this._fallTheta < -Math.PI / 2) {
                    this._fallTheta = -Math.PI - this._fallTheta;
                }
                if (this._fallTheta > Math.PI / 2) {
                    this._fallTheta = Math.PI - this._fallTheta;
                }
            }
        }


        //enterframe
        function EnterFrame() {
            //åˆæœŸåŒ–
            if (resizeFlg) {
                resizeFlg = false;
                cvs.width = stageWidth;
                cvs.height = stageHeight;
            }
            ctx.clearRect(0, 0, stageWidth, stageHeight);

            //è¡¨ç¤ºæ›´æ–°
            for (var i = 0; i < DEF_KAMIKIRE_MAX; ++i) {
                if (kamikire_array[i].y > 0) {
                    var par = kamikire_array[i].y / stageHeight;
                    par = 1 - par;

                    kamikire_array[i].alpha = par;
                }

                if (kamikire_array[i].x - kamikire_array[i].SIZE / Math.SQRT2 > stageWidth) {
                    kamikire_array[i].x -= stageWidth;
                }
                if (kamikire_array[i].x + kamikire_array[i].SIZE / Math.SQRT2 < 0) {
                    kamikire_array[i].x += stageWidth;
                }
                if (kamikire_array[i].y - kamikire_array[i].SIZE / Math.SQRT2 > stageHeight) {
                    kamikire_array[i].y -= stageHeight;
                }

                kamikire_array[i].fall();
            }
        }

        /**
         * ãƒªã‚µã‚¤ã‚º
         */
        $(window).resize(function () {
            resizeFlg = true;
            stageWidth = window.innerWidth ? window.innerWidth : $(window).width();
            stageHeight = window.innerHeight ? window.innerHeight : $(window).height();
        });
    }

    function RollOver(element) {
        var $element = $(element);
        var off = $element.attr('src');
        var on = off.replace(/(\.gif|\.jpg|\.png)/, '_on' + '$1');

        init();
        eventify();

        function init() {
            $('<img />').attr('src', on);
        }

        function overHandler(e) {
            $element.attr('src', on);
        }

        function normalHandler(e) {
            $element.attr('src', off);
        }

        function eventify() {
            $element.on('mouseenter focus', overHandler);
            $element.on('mouseleave blur', normalHandler);
        }
    }

    function Tab(element) {
        var $element = $(element);
        var $btn = $element.find('.js-Tab__button');
        var $j = $btn.filter(function () {
            return $(this).data('tab') === 'japanese'
        });
        var $c = $btn.filter(function () {
            return $(this).data('tab') === 'chinese'
        });
        var $content = $element.find('.js-Tab__content');

        init();
        eventify();

        function init() {
            $j.addClass('is-active');
            open(0);
        }

        function clickHandler(e) {
            var $this = $(this);

            if ($this.hasClass('is-active')) return;

            $btn.removeClass('is-active');
            if ($this.data('tab') === 'japanese') {
                $j.addClass('is-active');
                open(0);
            } else {
                $c.addClass('is-active');
                open(1);
            }
        }

        function open(index) {
            $content.hide().eq(index).show();
        }

        function eventify() {
            $btn.on('click', clickHandler);
        }

    }

    if(!Detector.webgl) {
        $('.js-Start').each(function() {
            var $this = $(this);
            var $button = $this.find('.js-Start__button');
            var $image = $button.find('img');
            var $text = $this.find('.js-Start__text');

            $button.addClass('is-Disabled');
            $button.removeAttr('href');
            $image.removeClass('js-Rollover');
            $text.show();
        })
    } else {
        Paper();
    }

    $('.js-Rollover').each(function () {
        RollOver(this);
    });

    $('.js-Tab').each(function () {
        Tab(this);
    });

});