// JavaScript Document
var windowScalarTimer, fullWidth, parse;
function init(){
	'use strict';
	
	// Setup background
	DocsJS.apply(function(doc){
		doc.querySelector('[docsjs-tag="bg"]').setAttribute('style','background-image:url(/docsjs/example/backgrounds/'+Math.round(Math.random()*20)+'.jpg) !important;');
	});
	
	// Set up examples where the user edits code to an iframe
	parse = function(el){
		var html = '<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Example</title><script src="https://hailiax.io/docsjs/src/docs.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.8/ace.js"></script><script>function init(){DocsJS.apply(function(doc){doc.querySelector("[docsjs-tag="+"bg"+"]").setAttribute("style","background-image:url(https://hailiax.io/docsjs/example/backgrounds/"+Math.round(Math.random()*20)+".jpg);");});}</script></head><body onload="init()">'+DocsJS.cd.getEditor(el).getValue()+'<script defer>DocsJS.init();</script></body></html>';
		document.getElementsByClassName(el.className.split(' ')[0]+' dest')[0].src = 'data:text/html,'+html;
	};
	var bindParse = function(){
		document.querySelectorAll('.parse').forEach(function(el){
			var timeout;
			DocsJS.addEvent(el, 'keydown', function(){
				document.getElementsByClassName(el.className.split(' ')[0]+' dest')[0].src = '';
				clearTimeout(timeout);
			});
			DocsJS.addEvent(el, 'keyup', function(){
				timeout = window.setTimeout(function(){parse(el);},100);
			});
			parse(el);
		});
	};
	DocsJS.events.cdRefreshed = bindParse;
	bindParse();
	
	// Set up shrinking window example
	var scaleWindow = function(percent){
		document.querySelector('[docsjs-tag="column-left"]').style.marginLeft = '0';
		document.getElementById('windowScalarPlus').style.color = document.getElementById('windowScalarMinus').style.color = "#000";
		if (percent < 101 && percent/100*fullWidth > 200){
			var startingHeight = document.body.scrollHeight;
			
			DocsJS.window.width = function(){
				return fullWidth*percent/100;
			};
			document.getElementById('windowScalarPercent').innerHTML = percent + '%';
			document.getElementById('windowScalarPixels').innerHTML = DocsJS.window.width() + 'px Wide';
			DocsJS.resized();
			document.querySelector('[docsjs-tag="'+DocsJS.superparent+'"]').style.width = percent + '%';
			var difference = fullWidth*(100-percent)/200;
			
			document.querySelector('[docsjs-tag="column-right"]').style.marginLeft = -1*document.querySelector('[docsjs-tag="column-right"]').clientWidth + (document.querySelector('[docsjs-tag="column-right"]').style.position === 'absolute'? difference : -1*difference) + 'px';
			document.querySelector('[docsjs-tag="column-left"]').style.marginLeft = difference + 'px';
			document.querySelectorAll('main > [docsjs-tag="s-c"]').forEach(function(el){
				el.style.marginLeft = parseInt(el.style.marginLeft) + difference + 'px';
			});
			document.getElementsByClassName('baseground')[0].style.width = difference + 'px';
			document.getElementsByClassName('baseground')[1].style.width = difference + 'px';
			
			var scrollDiff = document.body.scrollHeight - startingHeight;
			window.scrollTo(0,document.body.scrollTop + scrollDiff/2);
		} else{
			clearInterval(windowScalarTimer);
			if (percent >= 100){
				DocsJS.window.width = function(){
					return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
				};
				document.getElementById('windowScalarPlus').style.color = "#909090";
			} else{
				document.getElementById('windowScalarMinus').style.color = "#909090";
			}
		}
	};
	
	document.getElementById('windowScalarMinus').onmousedown = document.getElementById('windowScalarMinus').ontouchstart = function(){
		clearInterval(windowScalarTimer);
		windowScalarTimer = window.setInterval(function(){
			if (parseInt(document.getElementById('windowScalarPercent').innerHTML) === 100){
				fullWidth = DocsJS.window.width();
			}
			var percent = parseInt(document.getElementById('windowScalarPercent').innerHTML) - 3;
			scaleWindow(percent);
		},15);
	};
	document.getElementById('windowScalarMinus').onmouseup = document.getElementById('windowScalarMinus').onmouseout = document.getElementById('windowScalarMinus').ontouchend = document.getElementById('windowScalarMinus').ontouchcancel = function(){
		clearInterval(windowScalarTimer);
	};
	document.getElementById('windowScalarPlus').onmousedown = document.getElementById('windowScalarPlus').ontouchstart = function(){
		clearInterval(windowScalarTimer);
		windowScalarTimer = window.setInterval(function(){
			if (parseInt(document.getElementById('windowScalarPercent').innerHTML) === 100){
				fullWidth = DocsJS.window.width();
			}
			var percent = parseInt(document.getElementById('windowScalarPercent').innerHTML) + 3;
			scaleWindow(percent);
		},15);
	};
	document.getElementById('windowScalarPlus').onmouseup = document.getElementById('windowScalarPlus').onmouseout = document.getElementById('windowScalarPlus').ontouchend = document.getElementById('windowScalarPlus').ontouchcancel = function(){
		clearInterval(windowScalarTimer);
	};
	
	DocsJS.addEvent(window,'resize',function(){
		DocsJS.window.width = function(){
			return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		};
		document.getElementById('windowScalarPercent').innerHTML = '100%';
		document.getElementById('windowScalarPixels').innerHTML = DocsJS.window.width() + 'px Wide';
		document.querySelector('[docsjs-tag="column-left"]').style.marginLeft = '0';
		document.getElementById('windowScalarPlus').style.color = "#909090";
		document.getElementById('windowScalarMinus').style.color = "#000";
		document.body.style.width = '';
		document.getElementsByClassName('baseground')[0].style.width = '0px';
		document.getElementsByClassName('baseground')[1].style.width = '0px';
	});
	
	DocsJS.events.columnResize = function(){
		scaleWindow(parseInt(document.getElementById('windowScalarPercent').innerHTML));
	};
}