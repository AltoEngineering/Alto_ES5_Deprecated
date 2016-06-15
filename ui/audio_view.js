alto_require('frameworks/shared/altojs/ui/core_view.js');
alto_require('frameworks/shared/altojs/ui/utilities/dom.js');

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2015 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Description of table view

 @module UI
 @class Alto.AudioView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Miguel Chateloin
 */

Alto.AudioView = Alto.CoreView.extend({

    data: '',

    sourcePaths: [],

    //default html5 controls
    controls: false,

    autoplay: false,

    viewWillLoad: function () {
        var node = document.createElement('div'),
            audio = document.createElement('audio'),
            playButton = document.createElement('div'),
            pauseButton = document.createElement('div'),
            progress = document.createElement('div'),
            time = document.createElement('div');

        node.__alto_object__ = this;

        this.viewDidLoad(node, audio, playButton, pauseButton, progress, time);

    },

    viewDidLoad: function (node, audio, playButton, pauseButton, progress, time) {
        var that = this,
            sources = this.get('data.arrayContent') ? this.get('data.arrayContent') : this.get('sourcePaths'),
            contentType = this.get('data.contentType');

        node.className = "audio-view";
        audio.className = "audio-frame";
        progress.className = "progress-bar";
        time.className = 'timer';

        if (this.get('autoplay')) {
            audio.setAttribute('autoplay');
        }

        if(this.get('controls')) {
            audio.setAttribute('controls');
        } else {
            that._addControls(playButton, pauseButton);

            node.appendChild(playButton);
            node.appendChild(pauseButton);
        }

        sources.forEach(function (src) {
            that._addSourceToNode(src, contentType, audio);
        });

        node.appendChild(audio);
        node.appendChild(progress);
        node.appendChild(time);

        that._updateProgress(node);

        this.viewWillAppear(node);
    },

    _addControls: function (play, pause) {
        play.className = 'images-play';
        pause.className = 'images-pause';

        //preset pause to hidden
        pause.classList.add('hide');

        this.addClickHandler(play, 'play');
        this.addClickHandler(pause, 'pause');
    },

    _addSourceToNode: function (src, type, node) {
        var source = document.createElement('source');

        source.src = src.get('url');
        source.type = type;

        node.appendChild(source);
    },

    addClickHandler: function (node) {
        var that = this;

        node.addEventListener("click", function () {
            that.click(node);
        }, false);
    },

    click: function (node) {
        var that = this;

        if (Alto.isEqual(node.className, 'images-play')) {
            that._play();
        } else if (Alto.isEqual(node.className, 'images-pause')) {
            that._pause();
        }
    },

    _play: function () {
        this._showPauseButton();
        this.node.children[2].play()
    },

    _pause: function () {
        this._showPlayButton();
        this.node.children[2].pause()
    },

    _showPlayButton: function () {
        //switch styling for pause/play
        this.node.children[1].classList.add('hide');
        this.node.children[0].classList.remove('hide');
    },

    _showPauseButton: function () {
        //switch styling for pause/play
        this.node.children[0].classList.add('hide');
        this.node.children[1].classList.remove('hide');
    },

    _updateProgress: function  (node) {
        var that = this,
            player = node.children[2],
            progress = node.children[3],
            timer = node.children[4],
            value = 0, width;

        //if duration = infinity set value to 100
        if (player.duration == 'Infinity') {
            value = 100;
        } else if (player.currentTime > 0) {
            //else if it is > 0 calculate percentage to highlight
            value = Math.floor((100 / player.duration) * player.currentTime);

            //width base on the length of the progress bar being 198px.. can be changed
            width = 198 * (value * .01);
        }

        //set the width of the progress bar
        progress.style.width = '%@px'.fmt(width);
        //progress.stop().animate({'width': value + '%'}, 500)

        //set the new timestamp
        timer.innerText = that.formatTime(player.currentTime);

        player.ontimeupdate = function () { that._updateProgress(node); };
        player.onended = function () { that._showPlayButton(); }
    },

    //format the audio tag's time stamp
    formatTime: function (seconds) {
        var minutes, min, sec;

        minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);

        min = (minutes >= 10) ? minutes : "" + minutes;
        sec = (seconds >= 10) ? seconds : "0" + seconds;

        return '%@:%@'.fmt(min, sec);
    }
})