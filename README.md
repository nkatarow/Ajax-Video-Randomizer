Ajax-Video-Randomizer
=====================
**A javascript component for AJAX loading, randomization and playing of background video clips.**

###Author
Nick Katarow (<http://github.com/nkatarow>)

###What it does
- Tests current browser's level of video support. Then if video is supported...
- Fetches a variable number of videos(queueTotal) from a pool of videos(totalVids) and drops them into an array using randomized nubmers between queueTotal and totalVids.
- Checks position of currently playing video and performs appropriate action:
	- If less than total and the next video has not been loaded: loads next video, advances counter
	- If the current video is the last in queue and the first one is not loaded: load the first video, set counter to zero
	- If less than total and next is loaded: embed next video, advances counter
	- If on last video and the first is already loaded: embed first video, set counter to 0
- On the first play through of the queue, while a clip is playing, the following video will be loaded via AJAX (if AJAX load fails, video will just stream when playback begins).
- Checks to see if next video has already been loaded, if it has, just play it and don't bother loading it again

###Dependencies
- jQuery 1.9.1

###Other Requirements
- Videos must be saved in three formats (webm, mp4, ogg)
- Videos filenames should be saves using consecutive numbers (e.g. "1.webm", "1.mp4", "1.ogg", "2.webm", "2.mp4", "2.ogg", etc.)

###Example Markup and Styling
**Markup**

	<div class="bg-video">
		<!-- Leave this empty -->
	</div> 

**CSS (SASS)**

	.bg-video video {
		/* 	
			Whatever styling you like. 
			This is an example of my use, which was full width and a minimum of 575px tall. 
		*/ 
		
		left: 0;
		min-height: 576px;
		position: absolute;
		top: 0;
		width: 100%;
	
	    &:first-child {
	        /* 
	        	I had a parent element with a background image as a backup. 
	        	This makes sure that the video stacks above it and sets the initial video's stacking order. 
	        */
	        
	        z-index: 2;
	    }
	}
	
###Potential Improvements
- Error supression in case that AJAX load fails as to not clog up console/error log
