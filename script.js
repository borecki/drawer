(function() {
	var drawer = {
		brushActions: function() {
			ctx.lineWidth = range.value;
			ctx.strokeStyle = currentColor;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";
		},
		rubberActions: function() {
			ctx.strokeStyle = "white";
			ctx.lineWidth = 15;
		},
		changePenSize: function(widthValue) {
			ctx.lineWidth = widthValue;	
		},
		changeCurrentColor: function() {
			if(rubberButton.classList.contains("current")) return;
			con.querySelector(".current").classList.remove("current");
			this.classList.add("current");
			ctx.strokeStyle = this.dataset.color;
			currentColor = ctx.strokeStyle;
		},
		changeStatusToTrue: function(e) {
			canvas.LMBstatus = true;
			ctx.beginPath();
			ctx.moveTo(drawer.getX(e), drawer.getY(e));
		},
		changeStatusToFalse: function() { 
			canvas.LMBstatus = false; 
		},
		getX: function(e) {
			canvasBoundries = canvas.getBoundingClientRect();
			if(e.offsetX) {
				return e.offsetX;
			} else if(e.clientX) {
				return e.clientX - canvasBoundries.left;	
			}
		},
		getY: function(e) {
			canvasBoundries = canvas.getBoundingClientRect();
			if(e.offsetY) {
				return e.offsetY;
			} else if(e.clientX) {
				return e.clientY - canvasBoundries.top;	
			}
		},
		drawLines: function(e) {
			if(!canvas.LMBstatus) return;
			ctx.lineTo(drawer.getX(e), drawer.getY(e));
			ctx.stroke();	
		},
		setupCanvas: function() {
			ctx = canvas.getContext("2d");
			canvas.LMBstatus = false;
			ctx.lineWidth = range.value;
			ctx.strokeColor = con.querySelector(".current").dataset.color;
			
			canvas.onmousemove = drawer.drawLines;
			canvas.onmousedown = drawer.changeStatusToTrue;
			canvas.onmouseup = drawer.changeStatusToFalse;
		},
		setupColors: function() {
			[].forEach.call(colors, function(color) {
				color.style.background = color.dataset.color;
				color.onclick = drawer.changeCurrentColor;
			})
			
			range.onchange = function(e) {
				rangeOutput.innerHTML = e.target.value;
				drawer.changePenSize(e.target.value);
			}
		},
		setupCanvasSize: function() {
			canvas.setAttribute("width", canvasCon.offsetWidth);
			canvas.setAttribute("height", canvasCon.offsetHeight);
		},
		clearCanvasSpace: function() {
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvasCon.offsetWidth, canvasCon.offsetHeight);
		},
		setupModalSize: function() {
			modalCon.style.setProperty("width", canvasCon.offsetWidth+5+"px", "important");
		},
		saveCanvasAsImage: function() {
			modalBody.innerHTML = "";
			var img = new Image();
			img.src = canvas.toDataURL("image/png");
			modalBody.appendChild(img);	
		},
		toolActions: function(tool) {
			con.querySelector(".tools .current").classList.remove("current");
			this.classList.add("current");
			switch(this.dataset.tool) {
				case "brush":
					canvas.style.setProperty("cursor", "url(icons/brush.png) 0 20, auto", "important");
					drawer.brushActions();
					break;
				case "rubber":
					canvas.style.setProperty("cursor", "url(icons/rubber.png) 0 20, auto", "important");
					drawer.rubberActions();
					break;		
			}
		},
		setupTools: function() {
			[].forEach.call(tools, function(tool) {
				tool.onclick = drawer.toolActions;
				tool.style.setProperty("background", "url(icons/"+tool.dataset.tool+".png) no-repeat", "important");
				tool.style.setProperty("background-color", "white", "important");
				tool.style.setProperty("background-position", "center center", "important");
			})
		},
		init: function() {
			currentColor = "black";
			bodyEl = document.querySelector('body');
			con = document.querySelector("#drawer");	
			canvasCon = con.querySelector(".canvas");
			canvas = con.querySelector("canvas");
		
			colors = con.querySelectorAll(".colors div");
			range = con.querySelector("input[type='range']");
			rangeOutput = con.querySelector("output strong");
			
			tools = con.querySelectorAll(".tools div");
			brushButton = con.querySelectorAll(".tools div[data-tool=\"brush\"]")[0];
			rubberButton = con.querySelectorAll(".tools div[data-tool=\"rubber\"]")[0];
			tools.onclick = drawer.toolSelected;
			
			clearButton = con.querySelector("#clear");
			clearButton.onclick = drawer.clearCanvasSpace;
			
			saveButton = con.querySelector("#save");
			saveButton.onclick = drawer.saveCanvasAsImage;
			
			modalCon = document.querySelector(".modal-dialog");
			modalBody = modalCon.querySelector(".modal-body");
			
			drawer.setupColors();
			drawer.setupCanvas();
			drawer.setupCanvasSize();
			drawer.setupModalSize();
			drawer.setupTools();	
			drawer.clearCanvasSpace();
			drawer.brushActions();
		}	
	}
	drawer.init();
	window.onresize = function(event) {
		currentColor =  ctx.strokeStyle;
		var imgData=ctx.getImageData(0, 0, canvasCon.offsetWidth, canvasCon.offsetHeight);
		drawer.setupCanvasSize();
		ctx.putImageData(imgData,0,0);
		drawer.setupModalSize();
		ctx.strokeStyle = currentColor;
		ctx.lineWidth = range.value;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
	};
})();