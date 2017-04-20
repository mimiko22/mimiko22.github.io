(function() {
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var game = (function() {
		var canvas;
		var score = 0;
		var running = 0;
		var moles = [];
		var moleCount = 12;
		var hypes = [
			"big data consultant",
			"secret agent",
			"value architect",
			"italian guru",
			"iot king",
			"ux expert",
			"bla bla blaa",
			"master of things",
			"creme de la creme",
			"cloud engineer",
			"evangelist",
			"software ninja"			
		];
		
		
		createClickHandler = function(i)
		{
			return function() {
				var mole = moles[i];
				if (mole.state == "alive")
				{
					score++;
					$("#score").html(score);
					mole.state = "dead";
					mole.element.removeClass("visible").addClass("dead");
					mole.whack.addClass("visible");
					mole.whackTtl = 150;
					mole.timer = getRandomInt(1000, 6000);
				}
			};
		};
		
		init = function(parentId)
		{
			canvas = $("#" + parentId);
		
			for (var i = 0; i < moleCount; i++)
			{				
				// Create mole container
				var moleContainer = $("<div class='mole_container'/>",  {id:"MoleContainer_"+i });
				moleContainer.appendTo(canvas);
		  
				// Create image
				var moleImg = $("<img></img>", {id: "Mole_"+i, class:'mole hidden', src:'images/mole' + i + '.jpg'})
				moleImg.bind('dragstart', function(){ return false; });
				moleImg.click(createClickHandler(i));					
				moleImg.appendTo(moleContainer);
							
				// Add a hype
				var molehype = $("<div class='hype'>" + hypes[i] + "</div>",  {id:"MoleHype"+i });
				molehype.appendTo(moleContainer);

				// Add the whack =)
				var whackImg = $("<img></img>", {id: "Whack_" + 1, class:'whack', src:"images/whack.png"});
				whackImg.appendTo(moleContainer);
				
				// Create the mole
				var mole = {
					id: i,
					state: "dead",
					element: moleImg,
					whack: whackImg,
					whackTtl: 0,
					timer: getRandomInt(0, 4000)
				};
				moles.push(mole);
			}    
	  };

	  start = function()
	  {
		running = 1;
		delta = 0;
		lastFrameTimeMs = 0;
		requestAnimationFrame(gameloop);    
	  };  
	  
	  stop = function()
	  {
		running = 0;
	  };
	  
	  update = function(step)
	  {
		for (var i=0; i<moleCount; i++)
		{
			var mole = moles[i];

			// Hide the whack
			if (mole.whackTtl > 0)
			{
				mole.whackTtl -= step;
				if (mole.whackTtl <= 0)
				{
					mole.whack.removeClass("visible");
					mole.whackTtl = 0;
				}
			}

			// Mole lifetime events
			mole.timer -=step;
			if (mole.timer <= 0)
			{				
				if (mole.state == "dead")
				{
					$("#Mole_" + mole.id).attr("src", 'images/mole' + getRandomInt(0, moleCount-1) + '.jpg');
					mole.state = "alive";
					mole.element.removeClass("hidden").removeClass("dead").addClass("visible");
					mole.timer = getRandomInt(500, 1000);					
				} else {
					mole.state = "dead";
					mole.element.removeClass("visible").addClass("hidden");
					mole.timer = getRandomInt(500, 3000);										
				}								
			}			
		}
	  };
	  
	  render = function()
	  {
	  };
	  
	  var timestep = 1000 / 25;
	  var lastFrameTimeMs = 0;
	  var delta = 0;
	  gameloop = function(timestamp)
	  {
		delta += timestamp - lastFrameTimeMs;    
		lastFrameTimeMs = timestamp;    
		while(delta >= timestep)
		{
			update(timestep);
			delta =- timestep;
		}    
		//render();
		if (running)
			requestAnimationFrame(gameloop);
	  };
	  
	  
		
	  return {
		initialize : init,
		start : start,
		stop: stop
	  };
	  
	})();	
	
	
	$(function() {
		$(".mole").click(function() {
			$(this).removeClass("visible").addClass("hidden");
		});
		
		game.initialize("canvas");
		game.start();
		
	});
	
})();