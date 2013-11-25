/*

    FILE: VIDEO.JS
    DESCRIPTION: Various video functions
    AUTHOR(S): Nick Katarow

    REQUIREMENTS: jQuery 1.9.1

*/

var NAMESPACE = window.NAMESPACE || {};

NAMESPACE.video = {

    init: function (options) {
        var self = this,
            current = 0,
            defaults,
            option;

        defaults = {
            // Path to where all the videos are stored
            videoPath: 'https://videopath.com/stuff/videos',

            // Total number videos available to choose from
            totalVids: 30,

            // Number of videos to queue up
            queueTotal: 5
        };

        for (option in options) {
            defaults[option] = options[option] || defaults[option];
        }

        self.options = defaults;

        if (Modernizr.video) {
            // If so, embed video using extension determined by videoTest
            var queue = self.assembleQueue();

            // Embed the first video before starting the loop
            self.videoEmbed(queue[0].src);

            // Start video loop
            self.playQueue(queue, current);
        } else {
            $('.bg-video').css('display', 'none');
        }

    }, // END: init

    numberGenerate: function (queueLength, available) {
        // Generates (queueLength) random unique numbers between 1 and (available)
        var randomSelected = [];

        while (randomSelected.length < queueLength) {
            var randomNumber = Math.round(Math.random()*(available - 1) + 1);

            if (randomSelected.indexOf(randomNumber) == -1) {
                randomSelected.push( randomNumber );
            }
        }

        return randomSelected;
    }, // END: numberGenerate

    assembleQueue: function () {
        // Take each selected video and create an array containing the source for each video

        var self = this,
            queue = [],
            selectedVideos = self.numberGenerate(self.options.queueTotal, self.options.totalVids);

        for (var i = 0; i < selectedVideos.length; i++) {
            queue.push({
                src: self.options.videoPath + selectedVideos[i] + self.videoTest(),
                loaded: false
            });
        }

        return queue;
    }, // END: assembleQueue

    playQueue: function (queue, current) {
        var self = this;

        if ($('.bg-video').children('video').length) {
            $('.bg-video video')[0].play();


            // If less than total and the next video has not been loaded
            if (current < self.options.queueTotal - 1 && (!queue[current+1].loaded)) {

                // Load the next
                self.loadVideo(queue[current + 1], queue);

                current ++;

            // If the current video is the last in queue and the first one is not loaded
            } else if (current === self.options.queueTotal - 1 && (!queue[0].loaded)) {

                // Load the first one
                self.loadVideo(queue[0], queue);

                current = 0;

            // If less than total and next is loaded
            } else if (current < self.options.queueTotal - 1 && (queue[current+1].loaded)) {

                self.videoEmbed(queue[current + 1].src);
                current ++;

            // If on last video and the first is already loaded
            } else if (current === self.options.queueTotal - 1 && (queue[0].loaded)) {

                self.videoEmbed(queue[0].src);
                current = 0;
            }

            // Listen for the currently playing video to end
            self.videoEnded(queue, current);
        }

    }, // END: playQueue

    videoEmbed: function (video) {
        // Get the video src from the data-video attribute and assign it to src
        var self = this,
            format;

        // Check which file extension was select, make sure source type is set correctly
        if (self.videoTest() === '.webm') {
            format = 'video/webm';
        } else if (self.videoTest() === '.mp4') {
            format = 'video/mp4';
        } else {
            format = 'video/ogg ogv';
        }

        // Append appropriate source, extension and format to the video tag
        $('.bg-video').append('<video muted="muted" volume="0"><source src="' + video + '" type="' + format + '"></video>');
        $('.bg-video').css('display', 'block');

    }, // END: videoEmbed

    videoTest: function () {
        // Check support of video format on this browser and set extension accordingly
        videoExt =  Modernizr.video.webm ? '.webm' :
                    Modernizr.video.h264 ? '.mp4' :
                    '.ogg';

        return videoExt;
    }, // END: videoTest

    loadVideo: function (video, queue) {
        var self = this;

        $.ajax({
            cache: true,
            timeout: 2500,
            url: video.src,
            error: function() {
                video.loaded = false;
            },
            success: function() {
                video.loaded = true;
            },
            complete: function() {
                self.videoEmbed(video.src);
            }
        });

        return video;
    }, // END: loadVideo

    videoEnded: function (queue, current) {
        var self = this;

        // Listen for the end of the video, remove it and play the next
        $('.bg-video video').bind("ended", function(){
            self.removeVideo($('.bg-video').children("video:first"));

            $('.bg-video video')[0].play();
            self.playQueue(queue, current);
        });
    }, // END: videoEnded

    removeVideo: function (currentVideo) {
        // Remove video if it's already been embedded
        var self = this;

        currentVideo.remove();
    }, // END: removeVideo

    stopLoop: function() {
        var self = this,
            queue = [];

        if ($('.bg-video').children('video').length){
            $('.bg-video').empty();
        }

        return queue;
    } // END: stopLoop
};