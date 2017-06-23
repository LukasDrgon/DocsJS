// JavaScript Document
var DocsJS = {
	apply: function (func){
		'use strict';
		var docs = document.querySelectorAll('[docsjs-tag="'+DocsJS.superparent+'"]');
		for (var docIndex = 0; docIndex < docs.length; docIndex++){
			func(docs[docIndex], docIndex);
		}
	},
	init: function(callback){
		'use strict';
		// Add essential compenents
		DocsJS.apply(function(doc){
			doc.outerHTML = doc.outerHTML
				.slice(0,-6) +
				'<div docsjs-tag="menu" style="display: none;"></div>' +
				'<div docsjs-tag="column-left">'+DocsJS.column.choice(-1)+'</div>' +
				'<div docsjs-tag="column-right" style="left:100%;">'+DocsJS.column.choice(1)+'</div>' +
				'<div docsjs-extras="learnmore" style="position: relative; width: 100%; height: 1.25em; line-height:1.25em; text-align: center; font-size: 0.75em; opacity: 0.5; text-shadow: -0.04em -0.04em 0.12em #fff,0.04em 0.04em 0.12em #fff,-0.04em 0.04em 0.12em #fff,0.04em -0.04em 0.12em #fff;"><a href="https://hailiax.io/docsjs" target="_blank" style="text-decoration: none; color: #000; line-height: 1.25em;">– Powered by Docs.JS –</a></div>' +
				'</div>';
		});
		DocsJS.apply(function(doc){
			doc.querySelector('[docsjs-tag="column-left"]').style.position = 'fixed';
			doc.querySelector('[docsjs-tag="column-right"]').style.position = 'fixed';
			doc.innerHTML = '<div docsjs-tag="bg" docsjs-extra="invert"></div>' + doc.innerHTML;
		});
		
		// Process DocsJS syntax
		DocsJS.refresh(function(){
			// Watch events
			DocsJS.addEvent(window,'scroll',DocsJS.scrolled);
			DocsJS.addEvent(window,'resize',function(){
				DocsJS.apply(function(doc){
					DocsJS.correctColumnHeight(doc);
				});
				DocsJS.resized();
			});
			var hashChange = function(){
				DocsJS.jumpTo(decodeURIComponent(window.location.hash.substr(1)));
			};
			DocsJS.addEvent(window,'hashchange',hashChange);
			
			// Watch column drags
			DocsJS.apply(function(doc){
				var exposeClose = function(d){
					if (DocsJS.column.state[0] !== 'none' && DocsJS.cache.events.oncolumn < 0){
						DocsJS.animate({
							from: parseFloat(doc.querySelector('[docsjs-tag="column-left"]').lastChild.style.marginLeft),	to:-1*(100+DocsJS.cache.extraWidth)*(1-d),	duration: DocsJS.animation.duration, easing: DocsJS.easings.easeOutQuart, step: function(now){
								if (DocsJS.column.state[0] !== 'none'){
									doc.querySelector('[docsjs-tag="column-left"]').lastChild.style.marginLeft = now +'px';
								}
							}
						});
					} else if (DocsJS.column.state[1] !== 'none' && DocsJS.cache.events.oncolumn > 0){
						DocsJS.animate({
							from: parseFloat(doc.querySelector('[docsjs-tag="column-right"]').lastChild.style.marginRight),	to:-1*(100+DocsJS.cache.extraWidth)*(1-d),	duration: DocsJS.animation.duration, easing: DocsJS.easings.easeOutQuart, step: function(now){
								if (DocsJS.column.state[1] !== 'none'){
									doc.querySelector('[docsjs-tag="column-right"]').lastChild.style.marginRight = now +'px';
								}
							}
						});
					}
				};
				
				var mousedown = function(e){
					if (DocsJS.cache.events.oncolumn !== 0){
						DocsJS.removeEvent(doc,'mousedown',mousedown);
						exposeClose(1);
						var start = e.clientX;
						var mousemove = function(e){
							var delta = DocsJS.cache.events.oncolumn*(start - e.clientX);
							start = e.clientX;
							DocsJS.columnOffsets[(DocsJS.cache.events.oncolumn < 0 ? 'left' : 'right')] += delta;
							DocsJS.resized();
						};
						DocsJS.addEvent(doc,'mousemove',mousemove);
						var mouseup = function(){
							exposeClose(0);
							DocsJS.correctColumnHeight(doc);
							DocsJS.removeEvent(doc,'mousemove',mousemove);
							DocsJS.removeEvent(doc,'mouseup',mouseup);
							DocsJS.checkColumns(doc);
							DocsJS.cache.events.oncolumn = 0;
							DocsJS.addEvent(doc,'mousedown',mousedown);
						};
						DocsJS.addEvent(doc,'mouseup',mouseup);
					}
				};
				DocsJS.addEvent(doc,'mousedown',mousedown);
				
				var touchstart = function(e){
					if (DocsJS.cache.events.oncolumn !== 0){
						DocsJS.removeEvent(doc,'touchstart',touchstart);
						exposeClose(1);
						var start = e.touches[0].pageX;
						var touchmove = function(e){
							var delta = DocsJS.cache.events.oncolumn*(start - e.touches[0].pageX);
							start = e.touches[0].pageX;
							DocsJS.columnOffsets[(DocsJS.cache.events.oncolumn < 0 ? 'left' : 'right')] += delta;
							DocsJS.resized();
						};
						DocsJS.addEvent(doc,'touchmove',touchmove);
						var touchend = function(){
							exposeClose(0);
							DocsJS.correctColumnHeight(doc);
							DocsJS.removeEvent(doc,'touchmove',touchmove);
							DocsJS.removeEvent(doc,'touchend',touchend);
							DocsJS.checkColumns(doc);
							DocsJS.cache.events.oncolumn = 0;
							doc.ontouchstart = touchstart;
						};
						DocsJS.addEvent(doc,'touchend',touchend);
					}
				};
				DocsJS.addEvent(doc,'touchstart',touchstart);
			});
			
			// Prefire events onready.
			DocsJS.addEvent(document,'readystatechange',function(){
				DocsJS.cache.events.load++;
				if (DocsJS.cache.events.load > DocsJS.readystatechangemax){
					DocsJS.fontsize = parseInt(DocsJS.getStyle(document.querySelector('[docsjs-tag="'+DocsJS.superparent+'"]'),'font-size'));
					DocsJS.scrolled();
					DocsJS.resized();
					hashChange();
					
					// Check for min and max
					var duration = DocsJS.animation.duration;
					DocsJS.animation.duration = 0;
					DocsJS.apply(function(doc){
						doc.querySelectorAll('[docsjs-state="max"]').forEach(function(el){
							if (el.docsjs.tag === 'ex' || el.docsjs.tag === 'eg'){
								DocsJS.rotate(el.previousSibling.querySelector('[docsjs-tag="button-ebefore"]'),90);
							}
						});
						doc.querySelectorAll('[docsjs-state="min"]').forEach(function(el){
							if (el.docsjs.tag === 'tp' || el.docsjs.tag === 'hd'){
								el.docsjs.state = 'max';
								el.querySelector('[docsjs-tag="tl"]').onclick({target:{docsjs:{tag:'tl'}}});
							}
							if (el.docsjs.tag === 'sc'){
								el.docsjs.state = 'max';
								el.querySelector('[docsjs-tag="hd"]').querySelector('[docsjs-tag="tl"]').querySelector('[docsjs-tag="button-minimize"]').onclick();
							}
						});
					});
					DocsJS.animation.duration = duration;
					
					if (callback === undefined){callback = function(){};}
					callback();
				}
			});
		});
	},
	checkColumns: function(doc){
		'use strict';
		if (DocsJS.columnOffsets.left > 0 && DocsJS.column.state[0] === 'none'){
			doc.querySelector('[docsjs-tag="column-left"]').innerHTML = DocsJS.column.generate(DocsJS.cache.events.columnchoice,doc);
			doc.querySelector('[docsjs-tag="column-left"]').lastChild.style.marginLeft = '-'+(100+DocsJS.cache.extraWidth)+'px';
			if (DocsJS.cache.events.columnchoice !== 'menu'){
				doc.querySelector('[docsjs-tag="column-left"]').style.position = 'absolute';
			} else{
				DocsJS.bindPrefs();
			}
			DocsJS.column.state[0] = DocsJS.cache.events.columnchoice;
			DocsJS.correctColumnHeight(doc);
			DocsJS.correctColumnHeight(doc);
			DocsJS.cache.events.columnchoice = 0;
		} else if (DocsJS.columnOffsets.left <= 0 && DocsJS.column.state[0] !== 'none'){
			doc.querySelector('[docsjs-tag="column-left"]').style.position = 'fixed';
			doc.querySelector('[docsjs-tag="column-left"]').innerHTML = DocsJS.column.choice(-1);
			if (DocsJS.column.state[0] !== 'menu'){
				doc.querySelectorAll('[docsjs-tag="'+DocsJS.column.state[0]+'"]').forEach(function(el){
					el.previousSibling.style.display = '';
					el.style.display = '';
				});
				doc.querySelectorAll('[docsjs-tag="efiller"][docsjs-side="left"]').forEach(function(el){
					el.style.height = '0px';
				});
			}
			DocsJS.column.state[0] = 'none';
			DocsJS.cache.events.columnchoice = 0;
		}
		if (DocsJS.columnOffsets.right > 0 && DocsJS.column.state[1] === 'none'){
			doc.querySelector('[docsjs-tag="column-right"]').style.position = 'absolute';
			doc.querySelector('[docsjs-tag="column-right"]').innerHTML = DocsJS.column.generate(DocsJS.cache.events.columnchoice,doc);
			doc.querySelector('[docsjs-tag="column-right"]').lastChild.style.marginRight = '-'+(100+DocsJS.cache.extraWidth)+'px';
			DocsJS.column.state[1] = DocsJS.cache.events.columnchoice;
			DocsJS.correctColumnHeight(doc);
			DocsJS.correctColumnHeight(doc);
			if (DocsJS.column.state[0] === 'none'){
				doc.querySelector('[docsjs-tag="column-left"]').innerHTML = DocsJS.column.choice(-1);
			}
			DocsJS.cache.events.columnchoice = 0;
		} else if (DocsJS.columnOffsets.right <= 0 && DocsJS.column.state[1] !== 'none'){
			doc.querySelector('[docsjs-tag="column-right"]').style.position = 'fixed';
			doc.querySelector('[docsjs-tag="column-right"]').innerHTML = DocsJS.column.choice(1);
			doc.querySelectorAll('[docsjs-tag="'+DocsJS.column.state[1]+'"]').forEach(function(el){
				el.previousSibling.style.display = '';
				el.style.display = '';
			});
			doc.querySelectorAll('[docsjs-tag="efiller"][docsjs-side="right"]').forEach(function(el){
				el.style.height = '0px';
			});
			DocsJS.column.state[1] = 'none';
			if (DocsJS.column.state[0] === 'none'){
				doc.querySelector('[docsjs-tag="column-left"]').innerHTML = DocsJS.column.choice(-1);
			}
			DocsJS.cache.events.columnchoice = 0;
		}
		if (DocsJS.cache.events.columnchoice !== 0){
			var drag = document.createElement('div');
			drag.style.position = 'absolute';
			drag.style.top = 0;
			drag.style.opacity = 0;
			drag.style.height = '100%';
			drag.style.width = '100%';
			drag.style.pointerEvents = 'none';
			drag.setAttribute('docsjs-tag','column-filler');
			drag.innerHTML = '<div style="position:absolute;line-height:50px;top:50%;margin-top:-25px;width:100%;text-align:center;font-size:25px;opacity:0.8;white-space:nowrap;"><span style="display:inline-block;">&gt;</span> Drag <span style="display:inline-block;">&gt;</span></div>';
			DocsJS.rotate(drag.firstChild,(DocsJS.cache.events.oncolumn===1?90:90));
			DocsJS.rotate(drag.firstChild.querySelectorAll('span')[0],(DocsJS.cache.events.oncolumn===1?90:270));
			DocsJS.rotate(drag.firstChild.querySelectorAll('span')[1],(DocsJS.cache.events.oncolumn===1?90:270));
			doc.querySelector('[docsjs-tag="column-'+(DocsJS.cache.events.oncolumn===1?'right':'left')+'"]').appendChild(drag);
			DocsJS.animate({
				from: -2, to: 2, duration: DocsJS.animation.duration*4, easing: DocsJS.easings.linear,
				step: function(now){
					drag.style.opacity = 2-Math.abs(now);
				},
				callback: function(){
					drag.parentNode.removeChild(drag);
				}
			});
		}
	},
	scrolled: function(){
		'use strict';
		if (Date.now()-DocsJS.cache.lastscrolled > 30){
			DocsJS.cache.lastscrolled = Date.now();
			DocsJS.apply(function(doc){
				var posHit = false;
				doc.querySelectorAll('[docsjs-tag="tp"]').forEach(function(el){
					var top = (el.querySelector('[docsjs-tag="tl"]').getBoundingClientRect().top+el.querySelector('[docsjs-tag="tl"]').getBoundingClientRect().bottom)/2;
					if (top > 0 && el.parentElement.docsjs.state === 'max' && !posHit){
						posHit = true;
						if (el.querySelector('[docsjs-tag="button-menu"]').style.opacity === '0'){
							DocsJS.animate({
								from: 0,	to: 1,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutCubic,	pass: el,
								step: function(now, pass){
									pass.querySelector('[docsjs-tag="button-menu"]').style.opacity = now;
								}
							});
						}
					} else{
						if (el.querySelector('[docsjs-tag="button-menu"]').style.opacity === '1'){
							DocsJS.animate({
								from: parseInt(el.querySelector('[docsjs-tag="button-menu"]').style.opacity),	to: 0,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutCubic,	pass: el,
								step: function(now, pass){
									pass.querySelector('[docsjs-tag="button-menu"]').style.opacity = now;
								}
							});
						}
					}
				});
			});
		}
	},
	resized: function(){
		'use strict';
		var docWidth, docMargin, rc, lc;
		DocsJS.apply(function(doc){
			rc = doc.querySelector('[docsjs-tag="column-right"]');
			lc = doc.querySelector('[docsjs-tag="column-left"]');
		});
		DocsJS.cache.extraWidth = 0;
		if (window.innerWidth > DocsJS.width.max + 200){
			DocsJS.apply(function(doc){
				doc.style.fontSize = DocsJS.fontsize+'px';
				var width = (window.innerWidth - DocsJS.width.max)/2;
				DocsJS.cache.extraWidth = width-100;
				lc.style.width = width+DocsJS.columnOffsets.left+'px';
				rc.style.width = width+DocsJS.columnOffsets.right+'px';
				rc.style.marginLeft = -1*width-DocsJS.columnOffsets.right+'px';
				doc.querySelectorAll(':scope > [docsjs-tag="sc"]').forEach(function(el){
					el.style.width = doc.querySelector('[docsjs-extras="learnmore"]').style.width = docWidth = DocsJS.width.max-DocsJS.columnOffsets.left-DocsJS.columnOffsets.right+'px';
					el.style.marginLeft = doc.querySelector('[docsjs-extras="learnmore"]').style.marginLeft = docMargin = width+DocsJS.columnOffsets.left+'px';
				});
			});
			if (DocsJS.width.max-DocsJS.columnOffsets.left-DocsJS.columnOffsets.right < DocsJS.width.min){
				if (DocsJS.columnOffsets.left > DocsJS.columnOffsets.right){
					DocsJS.columnOffsets.left-=DocsJS.width.min - DocsJS.width.max+DocsJS.columnOffsets.left+DocsJS.columnOffsets.right;
				} else{
					DocsJS.columnOffsets.right-=DocsJS.width.min - DocsJS.width.max+DocsJS.columnOffsets.left+DocsJS.columnOffsets.right;
				}
			}
			if (DocsJS.columnOffsets.left < -50){
				DocsJS.columnOffsets.left = -50;
			}
			if (DocsJS.columnOffsets.right < -50){
				DocsJS.columnOffsets.right = -50;
			}
		} else if (window.innerWidth > DocsJS.width.min + 200){
			if (DocsJS.columnOffsets.left === 0 && DocsJS.columnOffsets.right === 0 && window.innerWidth-DocsJS.width.min < 400){
				DocsJS.columnOffsets.left = DocsJS.columnOffsets.right = -49.87656421;
			}
			DocsJS.apply(function(doc){
				doc.style.fontSize = DocsJS.fontsize+'px';
				lc.style.width = 100+DocsJS.columnOffsets.left+'px';
				rc.style.width = 100+DocsJS.columnOffsets.right+'px';
				rc.style.marginLeft = -1*100-DocsJS.columnOffsets.right+'px';
				doc.querySelectorAll(':scope > [docsjs-tag="sc"]').forEach(function(el){
					el.style.width = window.innerWidth-200-DocsJS.columnOffsets.left-DocsJS.columnOffsets.right+'px';
					el.style.marginLeft = 100+DocsJS.columnOffsets.left+'px';
				});
			});
			if (window.innerWidth-DocsJS.columnOffsets.left-DocsJS.columnOffsets.right < DocsJS.width.min + 200){
				if (DocsJS.columnOffsets.left > DocsJS.columnOffsets.right){
					DocsJS.columnOffsets.left-=DocsJS.width.min + 200 - window.innerWidth+DocsJS.columnOffsets.left+DocsJS.columnOffsets.right;
				} else{
					DocsJS.columnOffsets.right-=DocsJS.width.min + 200 - window.innerWidth+DocsJS.columnOffsets.left+DocsJS.columnOffsets.right;
				}
			}
			if (DocsJS.columnOffsets.left < -50){
				DocsJS.columnOffsets.left = -50;
			}
			if (DocsJS.columnOffsets.right < -50){
				DocsJS.columnOffsets.right = -50;
			}
		} else{
			DocsJS.apply(function(doc){
				doc.style.fontSize = DocsJS.fontsize*Math.sqrt(window.innerWidth/(DocsJS.width.min+200))+'px';
				lc.style.width = rc.style.width = rc.style.marginLeft = '0';
				doc.querySelectorAll(':scope > [docsjs-tag="sc"]').forEach(function(el){
					el.style.width = '100%';
					el.style.marginLeft = '0';
				});
			});
		}
		DocsJS.apply(function(doc){
			doc.querySelectorAll('[docsjs-internal="extraWidthCorrect"]').forEach(function(el){
				el.style.width = DocsJS.cache.extraWidth+100+'px';
			});
		});
		DocsJS.scrolled();
		var scrollTop = document.body.scrollTop;
		scrollTop = document.body.scrollTop;
	},
	refresh: function(callback){
		'use strict';
		// Process varible tags
		DocsJS.apply(function(doc){
			doc.outerHTML = doc.outerHTML
				.replace(/<vr (.*?)\W/g,'<div docsjs-tag="vr" docsjs-name="$1"')
				.replace(/<var (.*?)\W/g,'<div docsjs-tag="var" docsjs-name="$1"')
				.replace(new RegExp('</vr>|</var>','g'),'</div>');
		});
		DocsJS.apply(function(doc){
			var varHolder = {};
			doc.querySelectorAll('[docsjs-tag="vr"],[docsjs-tag="var"]').forEach(function(el){
				if (JSON.stringify(el.innerHTML).replace(/\\[\s\S]/g,'').length > 2){
					varHolder[el.docsjs.name] = el.innerHTML;
					el.style.display = 'none';
				} else{
					el.outerHTML = varHolder[el.docsjs.name];
				}
			});
		});
		
		// Convert to div soup
		DocsJS.apply(function(doc){
			doc.outerHTML = doc.outerHTML
				.replace(/<sc/g,'<div docsjs-tag="sc"')
				.replace(/<hd/g,'<div docsjs-tag="hd"')
				.replace(/<tp/g,'<div docsjs-tag="tp"')
				.replace(/<tl/g,'<div docsjs-tag="tl"')
				.replace(/<tx/g,'<div docsjs-tag="tx"')
				.replace(/<eg/g,'<div docsjs-tag="eg"')
				.replace(/<ex/g,'<div docsjs-tag="ex"')
				.replace(new RegExp('</sc>|</hd>|</tp>|</tl>|</tx>|</eg>|</ex>','g'),'</div>');
		});
		
		// Add buttons and formatting
		DocsJS.apply(function(doc){
			doc.querySelectorAll('[docsjs-tag="hd"] > [docsjs-tag="tl"]').forEach(function(el){
				var minimizeButton = document.createElement('div');
				minimizeButton.setAttribute('docsjs-tag','button-minimize');
				minimizeButton.innerHTML = DocsJS.buttons.minimize.html();
				el.appendChild(minimizeButton);
			});
			doc.querySelectorAll('[docsjs-tag="tp"] > [docsjs-tag="tl"]').forEach(function(el){
				var minimizeButton = document.createElement('div');
				minimizeButton.setAttribute('docsjs-tag','button-menu');
				minimizeButton.setAttribute('docsjs-state','max');
				minimizeButton.setAttribute('style','opacity:0;');
				minimizeButton.innerHTML = DocsJS.buttons.menu.html();
				el.appendChild(minimizeButton);
			});
			doc.querySelectorAll('[docsjs-tag="eg"]').forEach(function(el){
				if (el.docsjs.state === undefined){
					el.setAttribute('docsjs-state',DocsJS.eg.default);
				}
				if (el.previousSibling.docsjs === undefined || el.previousSibling.docsjs.tag !== 'ebefore'){
					el.outerHTML = '<div docsjs-tag="ebefore"><div docsjs-tag="button-ebefore">'+DocsJS.buttons.eg.html()+'</div>'+(el.docsjs.name === undefined? DocsJS.eg.name : el.docsjs.name)+'</div>'+el.outerHTML;
				}
			});
			doc.querySelectorAll('[docsjs-tag="ex"]').forEach(function(el){
				if (el.docsjs.state === undefined){
					el.setAttribute('docsjs-state',DocsJS.ex.default);
				}
				if (el.previousSibling.docsjs === undefined || el.previousSibling.docsjs.tag !== 'ebefore'){
					el.outerHTML = '<div docsjs-tag="ebefore"><div docsjs-tag="button-ebefore">'+DocsJS.buttons.ex.html()+'</div>'+(el.docsjs.name === undefined? DocsJS.ex.name : el.docsjs.name)+'</div>'+el.outerHTML;
				}
			});
			doc.querySelectorAll('[docsjs-tag="sc"] [docsjs-tag="tp"],[docsjs-tag="sc"] [docsjs-tag="hd"]').forEach(function(el){
				el.innerHTML += '<div docsjs-tag="efiller" docsjs-side="left"></div><div docsjs-tag="efiller" docsjs-side="right"></div>';
				if (el.docsjs.state === undefined){
					el.setAttribute('docsjs-state','max');
				}
			});
			doc.querySelectorAll('[docsjs-tag="tp"] [docsjs-tag="tp"],[docsjs-tag="tp"] [docsjs-tag="hd"]').forEach(function(el){
				el.innerHTML += '<div docsjs-tag="efiller" docsjs-side="left"></div><div docsjs-tag="efiller" docsjs-side="right"></div>';
				if (el.docsjs.state === undefined){
					el.setAttribute('docsjs-state','max');
				}
			});
			doc.querySelectorAll('[docsjs-tag="sc"]').forEach(function(el){
				if (el.docsjs.state === undefined){
					el.setAttribute('docsjs-state','max');
				}
			});
		});
		
		// Generate menu
		DocsJS.apply(function(doc,index){
			var menu = doc.querySelector('[docsjs-tag="menu"]');
			var readStructure = function(parent, location){
				var structure = '';
				var contents = parent.querySelectorAll(':scope>[docsjs-tag="sc"],:scope>[docsjs-tag="tp"]');
				if (contents.length !== 0){
					for (var i = 0; i < contents.length; i++){
						var newLocation = location + '.' + i;
						var title = (contents[i].querySelector(':scope > [docsjs-tag="tl"]') || contents[i].querySelector(':scope > [docsjs-tag="hd"] > [docsjs-tag="tl"]') || undefined);
						if (title !== undefined){
							structure += '<div docsjs-tag="menu-item"><div docsjs-tag="menu-title" docsjs-menu-location="'+newLocation+'" onclick="DocsJS.jumpTo('+"'"+newLocation+"'"+')" docsjs-menu-destination="'+contents[i].docsjs.tag+'">'+title.innerText+'</div>'+readStructure(contents[i],newLocation)+'</div>';
						}
					}
					return structure;
				} else{
					return '';
				}
			};
			menu.innerHTML = '<div docsjs-tag="menu-preferences"><div docsjs-tag="menu-preferences-item" docsjs-pref="aA">'+DocsJS.buttons.fontplus()+'</div><div docsjs-tag="menu-preferences-item" docsjs-pref="Aa">'+DocsJS.buttons.fontminus()+'</div><div docsjs-tag="menu-preferences-item" docsjs-pref="O">'+DocsJS.buttons.menuminimized()+'</div><div docsjs-tag="menu-preferences-item" docsjs-pref="CM">'+DocsJS.buttons.partialminimize()+'</div><div docsjs-tag="menu-preferences-item" docsjs-pref="C">'+DocsJS.buttons.menuminimize()+'</div><div docsjs-tag="menu-preferences-item" docsjs-pref="Iv">'+DocsJS.buttons.invert()+'</div><div docsjs-tag="menu-preferences-item" docsjs-pref="GPU">'+DocsJS.buttons.gpu()+'</div><div docsjs-tag="menu-preferences-item" docsjs-pref="Rs">'+DocsJS.buttons.reset()+'</div></div>'+
				'<div docsjs-tag="menu-item"><div docsjs-tag="menu-title" docsjs-menu-location="'+DocsJS.menu.top+'" onclick="DocsJS.jumpTo('+"'"+DocsJS.menu.top+"'"+')" docsjs-menu-destination="'+DocsJS.menu.top+'">'+DocsJS.menu.top+'</div></div>'+
				readStructure(doc, index)+
				'<div docsjs-tag="menu-item"><div docsjs-tag="menu-title" docsjs-menu-location="'+DocsJS.menu.bottom+'" onclick="DocsJS.jumpTo('+"'"+DocsJS.menu.bottom+"'"+')" docsjs-menu-destination="'+DocsJS.menu.bottom+'">'+DocsJS.menu.bottom+'</div></div>';
		});
		
		// Bind buttons
		DocsJS.apply(function(doc){
			DocsJS.bindPrefs();
			doc.querySelectorAll('[docsjs-tag="button-minimize"]').forEach(function(el){
				var click = function(){
					el.onclick = function(){};
					var d = (el.parentElement.parentElement.parentElement.docsjs.state === 'max')? 1 : 0;
					DocsJS.animate({
						from: d,	to: 1-d,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
						pass: [el,d,DocsJS.getScMaxHeight(el.parentElement.parentElement.parentElement),DocsJS.getScMinHeight(el.parentElement.parentElement.parentElement)],
						step: function(now, pass){
							DocsJS.buttons.minimize.animation(pass[0].querySelector('[docsjs-tag="button-parent"]'),now);
							pass[0].parentElement.parentElement.parentElement.style.height = (pass[2]-pass[3])*now + pass[3] + 'px';
							DocsJS.correctColumnHeight(doc);
						},
						callback: function(pass){
							if (pass[1] === 0){pass[0].parentElement.parentElement.parentElement.style.height = 'auto';}
							pass[0].onclick = click;
							DocsJS.scrolled();
						}
					});
					if (d === 1){
						if (el.parentElement.parentElement.docsjs.state === 'max'){
							el.parentElement.onclick({target:{docsjs:{tag:'tl'}}});
						}
						el.parentElement.parentElement.parentElement.docsjs.state = 'min';
					} else{
						el.parentElement.parentElement.parentElement.docsjs.state = 'max';
						el.parentElement.onclick({target:{docsjs:{tag:'tl'}}});
					}
				};
				el.onclick = click;
			});
			doc.querySelectorAll('[docsjs-tag="button-menu"]').forEach(function(el){
				var click = function(){
					el.onclick = function(){};
					var d = (el.docsjs.state === 'max')? 1 : 0;
					if (d === 1){
						var menu = doc.querySelector('[docsjs-tag="menu"]').cloneNode(true);
						menu.style.display = 'block';
						el.parentElement.parentElement.insertBefore(menu,el.parentElement.nextElementSibling);
						if (el.parentElement.parentElement.docsjs.state === 'min'){
							el.parentElement.onclick({target:{docsjs:{tag:'tl'}}});
						}
						el.docsjs.state = 'min';
					} else{
						el.docsjs.state = 'max';
					}
					DocsJS.bindPrefs();
					DocsJS.animate({
						from: d,	to: 1-d,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
						pass: [el,d,parseInt(DocsJS.getMax(el.parentElement.parentElement.querySelector('[docsjs-tag="menu"]'),'height')),parseInt(DocsJS.getMax(el.parentElement.parentElement.querySelector('[docsjs-tag="menu"]'),'padding'))],
						step: function(now, pass){
							now = 1-now;
							DocsJS.buttons.menu.animation(pass[0].querySelector('[docsjs-tag="button-parent"]'),now);
							pass[0].parentElement.parentElement.querySelector('[docsjs-tag="menu"]').style.height = pass[2]*now+'px';
							pass[0].parentElement.parentElement.querySelector('[docsjs-tag="menu"]').style.paddingTop = pass[3]*now+'px';
							pass[0].parentElement.parentElement.querySelector('[docsjs-tag="menu"]').style.paddingBottom = pass[3]*now+'px';
							DocsJS.correctColumnHeight(doc);
						},
						callback: function(pass){
							if (pass[1] === 0){											
								pass[0].parentElement.parentElement.removeChild(pass[0].parentElement.parentElement.querySelector('[docsjs-tag="menu"]'));
							} else{
								var menu = pass[0].parentElement.parentElement.querySelector('[docsjs-tag="menu"]');
								menu.style.height = 'auto';
								menu.style.padding = menu.style.paddingTop = menu.style.paddingBottom = '';
							}
							pass[0].onclick = click;
							DocsJS.scrolled();
						}
					});
				};
				el.onclick = click;
			});
			doc.querySelectorAll('[docsjs-tag="tl"]').forEach(function(el){
				var click = function(e){
					if ((e.target || (e.srcElement || e.originalTarget)).docsjs.tag === 'tl'){
						if (el.parentElement.parentElement.docsjs.state === 'max' || el.parentElement.docsjs.tag === 'tp'){
							el.onclick = function(){};
							var d = (el.parentElement.docsjs.state === 'max')? 1 : 0;
							DocsJS.animate({
								from: d,	to: 1-d,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
								pass: [el,d,DocsJS.getMax(el.parentElement,'clientHeight')-DocsJS.getMax(el,'clientHeight'),DocsJS.getMax(el,'clientHeight')],
								step: function(now, pass){
									pass[0].parentElement.style.height = (pass[2])*now + pass[3] + 'px';
									DocsJS.correctColumnHeight(doc);
								},
								callback: function(pass){
									if (pass[1] === 0){pass[0].parentElement.style.height = 'auto';}
									DocsJS.correctColumnHeight(doc);
									pass[0].parentElement.docsjs.state = (pass[1] === 0)? 'max' : 'min';
									pass[0].onclick = click;
									DocsJS.scrolled();
								}
							});
						} else{
							el.querySelector('[docsjs-tag="button-minimize"]').onclick();
						}
					}
				};
				el.onclick = click;
			});
			doc.querySelectorAll('[docsjs-tag="ebefore"]').forEach(function(el){
				var click = function(){
					el.onclick = function(){};
					var styles = DocsJS.animation.styles.map(function(x){
						x = x.split('-');
						var out = [x[0]];
						for (var i = 1; i < x.length; i++){
							out.push(x[i].charAt(0).toUpperCase()+x[i].slice(1));
						}
						return out.join('');
					});
					var d = (el.nextSibling.docsjs.state === 'max')? 1 : 0;
					DocsJS.animate({
						from: d,	to: 1-d,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
						pass: [el.nextSibling,styles,d,
								DocsJS.animation.styles.map(function(x){
									return DocsJS.getMax(el.nextSibling,x);
								}),
							  	DocsJS.animation.styles.map(function(x){
									return DocsJS.getMin(el.nextSibling,x);
								}),],
						step: function(now, pass){
							for (var i = 0; i < DocsJS.animation.styles.length; i++){
								pass[0].style[pass[1][i]] = parseInt(pass[3][i])*now + parseInt(pass[4][i])*(1-now)+'px';	
							}
							if (pass[0].docsjs.tag === 'ex'){
								DocsJS.buttons.ex.animation(pass[0].previousSibling.querySelector('[docsjs-tag="button-ebefore"]'),now);
							} else if (pass[0].docsjs.tag === 'eg'){
								DocsJS.buttons.eg.animation(pass[0].previousSibling.querySelector('[docsjs-tag="button-ebefore"]'),now);
							}
							DocsJS.correctColumnHeight(doc);
						},
						callback: function(pass){
							pass[0].docsjs.state = (pass[2] === 0)? 'max' : 'min';
							for (var i = 0; i < DocsJS.animation.styles.length; i++){
								pass[0].style[pass[1][i]] = '';	
							}
							pass[0].previousSibling.onclick = click;
							DocsJS.scrolled();
						}
					});
				};
				el.onclick = click;
			});
		});
		
		if (typeof callback === 'function'){
			callback();
		}
		return 1;
	},
	bindPrefs: function(){
		'use strict';
		DocsJS.apply(function(doc){
			doc.querySelectorAll('[docsjs-pref="aA"]').forEach(function(el){
				el.onclick = function(){
					DocsJS.animate({
						from: DocsJS.fontsize,	to: DocsJS.fontsize+1,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
						step: function(now){
							DocsJS.fontsize = now;
							DocsJS.resized();
							DocsJS.correctColumnHeight(doc);
						},
						callback: DocsJS.scrolled
					});
				};
			});
			doc.querySelectorAll('[docsjs-pref="Aa"]').forEach(function(el){
				el.onclick = function(){
					DocsJS.animate({
						from: DocsJS.fontsize,	to: DocsJS.fontsize-1,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
						step: function(now){
							DocsJS.fontsize = now;
							DocsJS.resized();
							DocsJS.correctColumnHeight(doc);
						},
						callback: DocsJS.scrolled
					});
				};
			});
			doc.querySelectorAll('[docsjs-pref="O"]').forEach(function(el){
				el.onclick = function(){
					doc.querySelectorAll('[docsjs-tag="tl"]').forEach(function(el){
						if (el.parentElement.docsjs.state === 'max'){
							el.onclick({target:{docsjs:{tag:'tl'}}});
						}
					});
					window.setTimeout(function(){
						doc.querySelectorAll('[docsjs-tag="button-minimize"]').forEach(function(el){
							if (el.parentElement.parentElement.parentElement.docsjs.state === 'max'){
								el.onclick();
							}
						});
						doc.querySelectorAll('[docsjs-tag="ebefore"]').forEach(function(el){
							if (el.nextElementSibling.docsjs.state === 'max'){
								el.onclick();
							}
						});
						doc.querySelectorAll('[docsjs-tag="button-menu"]').forEach(function(el){
							if (el.docsjs.state === 'min'){
								el.onclick();
							}
						});
						window.setTimeout(DocsJS.scrolled,DocsJS.animation.duration);
					},DocsJS.animation.duration);
				};
			});
			doc.querySelectorAll('[docsjs-pref="CM"]').forEach(function(el){
				el.onclick = function(){
					doc.querySelectorAll('[docsjs-tag="button-minimize"]').forEach(function(el){
						if (el.parentElement.parentElement.parentElement.docsjs.state === 'min'){
							el.onclick();
						}
					});
					window.setTimeout(function(){
						doc.querySelectorAll('[docsjs-tag="tl"]').forEach(function(el){
							if (el.parentElement.docsjs.state === 'min'){
								el.onclick({target:{docsjs:{tag:'tl'}}});
							}
						});
						window.setTimeout(DocsJS.scrolled,DocsJS.animation.duration);
					},DocsJS.animation.duration);
					doc.querySelectorAll('[docsjs-tag="button-menu"]').forEach(function(el){
						if (el.docsjs.state === 'min'){
							el.onclick();
						}
					});
					doc.querySelectorAll('[docsjs-tag="ebefore"]').forEach(function(el){
						if (el.nextElementSibling.docsjs.state === 'max'){
							el.onclick();
						}
					});
				};
			});
			doc.querySelectorAll('[docsjs-pref="C"]').forEach(function(el){
				el.onclick = function(){
					doc.querySelectorAll('[docsjs-tag="button-minimize"]').forEach(function(el){
						if (el.parentElement.parentElement.parentElement.docsjs.state === 'min'){
							el.onclick();
						}
					});
					doc.querySelectorAll('[docsjs-tag="ebefore"]').forEach(function(el){
						if (el.nextElementSibling.docsjs.state === 'min'){
							el.onclick();
						}
					});
					window.setTimeout(function(){
						doc.querySelectorAll('[docsjs-tag="tl"]').forEach(function(el){
							if (el.parentElement.docsjs.state === 'min'){
								el.onclick({target:{docsjs:{tag:'tl'}}});
							}
						});
						window.setTimeout(DocsJS.scrolled,DocsJS.animation.duration);
					},DocsJS.animation.duration);
				};
			});
			doc.querySelectorAll('[docsjs-pref="Iv"]').forEach(function(el){
				el.onclick = function(){
					if (doc.style.filter !== 'invert(100%)'){
						DocsJS.animate({
							from: 0,	to: 100,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
							step: function(now){
								doc.style.filter = 'invert('+now+'%)';
								doc.style.WebkitFilter = 'invert('+now+'%)';
								doc.querySelectorAll('[docsjs-extra="invert"]').forEach(function(el){
									el.style.filter = 'invert('+now+'%)';
									el.style.WebkitFilter = 'invert('+now+'%)';
								});
							}
						});
					} else{
						DocsJS.animate({
							from: 100,	to: 0,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
							step: function(now){
								doc.style.filter = 'invert('+now+'%)';
								doc.style.WebkitFilter = 'invert('+now+'%)';
								doc.querySelectorAll('[docsjs-extra="invert"]').forEach(function(el){
									el.style.filter = 'invert('+now+'%)';
									el.style.WebkitFilter = 'invert('+now+'%)';
								});
							},
							callback: function(){
								doc.style.filter = '';
								doc.style.WebkitFilter = '';
								doc.querySelectorAll('[docsjs-extra="invert"]').forEach(function(el){
									el.style.filter = '';
									el.style.WebkitFilter = '';
								});
							}
						});
					}
				};
			});
			doc.querySelectorAll('[docsjs-pref="GPU"]').forEach(function(el){
				el.onclick = function(){
					if (!DocsJS.cache.fastmode.active){
						DocsJS.cache.fastmode.active = true;
						DocsJS.cache.fastmode.durtation = DocsJS.animation.duration;
						DocsJS.animation.duration = 0;
						doc.querySelectorAll('[docsjs-extra="gpu"]').forEach(function(el){
							el.style.fontSize = '0.8em';
							el.style.marginTop = '0.125em';
							el.style.marginLeft = '0.125em';
						});
						doc.style.filter = 'none';
						doc.style.WebkitFilter = 'none';
						doc.querySelectorAll('[docsjs-extra="invert"]').forEach(function(el){
							el.style.filter = 'none';
							el.style.WebkitFilter = 'none';
						});
					} else{
						DocsJS.cache.fastmode.active = false;
						DocsJS.animation.duration = DocsJS.cache.fastmode.durtation;
						DocsJS.cache.fastmode.durtation = 0;
						doc.querySelectorAll('[docsjs-extra="gpu"]').forEach(function(el){
							el.style.fontSize = '1em';
							el.style.marginTop = '0';
							el.style.marginLeft = '0';
						});
						doc.style.filter = '';
						doc.style.WebkitFilter = '';
						doc.querySelectorAll('[docsjs-extra="invert"]').forEach(function(el){
							el.style.filter = '';
							el.style.WebkitFilter = '';
						});
					}
				};
			});
			doc.querySelectorAll('[docsjs-pref="Rs"]').forEach(function(el){
				el.onclick = function(){
					if (doc.style.filter === 'none'){
						DocsJS.cache.fastmode.active = false;
						DocsJS.animation.duration = DocsJS.cache.fastmode.durtation;
						DocsJS.cache.fastmode.durtation = 0;
						doc.querySelectorAll('[docsjs-extra="gpu"]').forEach(function(el){
							el.style.fontSize = '1em';
							el.style.marginTop = '0';
							el.style.marginLeft = '0';
						});
						doc.style.filter = '';
						doc.style.WebkitFilter = '';
						doc.querySelectorAll('[docsjs-extra="invert"]').forEach(function(el){
							el.style.filter = '';
							el.style.WebkitFilter = '';
						});
					}
					DocsJS.animate({
						from: DocsJS.columnOffsets.left,	to: 0,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
						step: function(now){
							DocsJS.columnOffsets.left = now;
							DocsJS.resized();
							DocsJS.correctColumnHeight(doc);
						},
						callback: function(){
							DocsJS.checkColumns(doc);
							DocsJS.scrolled();
						}
					});
					DocsJS.animate({
						from: DocsJS.columnOffsets.right,	to: 0,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
						step: function(now){
							DocsJS.columnOffsets.right = now;
							DocsJS.resized();
							DocsJS.correctColumnHeight(doc);
						},
						callback: function(){
							DocsJS.checkColumns(doc);
							DocsJS.scrolled();
						}
					});
					DocsJS.animate({
						from: DocsJS.fontsize,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
						to: parseFloat(DocsJS.getMin(doc,'font-size')),
						step: function(now){
							DocsJS.fontsize = now;
							DocsJS.resized();
							DocsJS.correctColumnHeight(doc);
						},
						callback: DocsJS.scrolled
					});
					if (doc.style.filter === 'invert(100%)'){
						DocsJS.animate({
							from: 100,	to: 0,	duration: DocsJS.animation.duration,	easing: DocsJS.easings.easeOutQuart,
							step: function(now){
								doc.style.filter = 'invert('+now+'%)';
								doc.style.WebkitFilter = 'invert('+now+'%)';
								doc.querySelectorAll('[docsjs-extra="invert"]').forEach(function(el){
									el.style.filter = 'invert('+now+'%)';
									el.style.WebkitFilter = 'invert('+now+'%)';
								});
							},
							callback: function(){
								doc.style.filter = '';
								doc.style.WebkitFilter = '';doc.querySelectorAll('[docsjs-extra="invert"]').forEach(function(el){
									el.style.filter = '';
									el.style.WebkitFilter = '';
								});
							}
						});
					}
				};
			});
		});
	},
	animate: function(arg){
		'use strict';
		switch (undefined){
			case arg.to:
				console.error('DocsJS Animation Error: needs argument "to"');
				return;
			case arg.from:
				console.error('DocsJS Animation Error: needs argument "from"');
				return;
			case arg.duration:
				console.error('DocsJS Animation Error: needs argument "duration"');
				return;
			case arg.step:
				console.error('DocsJS Animation Error: needs argument "step"');
				return;
		}
		if (arg.easing === undefined){
			arg.easing = DocsJS.easings.linear;
		}
		if (arg.callback === undefined){
			arg.callback = function(){};
		}
		arg.delta = arg.to - arg.from;
		if (arg.delta !== 0 && !isNaN(arg.delta)){
			var start = Date.now();
			var loop = function(){
				var scalar = arg.easing((Date.now()-start)/arg.duration);
				if (Date.now()-start < arg.duration){
					arg.step(arg.from+arg.delta*scalar, arg.pass);
					window.setTimeout(loop,1);
				} else{
					arg.step(arg.from+arg.delta, arg.pass);
					arg.callback(arg.pass);
				}
			};
			loop();
		} else{
			if (isNaN(arg.delta)){
				console.error('DocsJS Animation Error: given argument to('+arg.to+') minus given argument from('+arg.from+') is not a number.');
			}
		}
	},
	jumpTo: function(location){
		'use strict';
		if (location === DocsJS.menu.top){
			DocsJS.animate({
				from: document.body.scrollTop,
				to: 0,
				duration: DocsJS.animation.duration, easing: DocsJS.easings.easeOutQuart,
				step: function(now){
					window.scroll(0,now);
				}
			});
		} else if (location === DocsJS.menu.bottom){
			DocsJS.animate({
				from: document.body.scrollTop,
				to: document.body.getBoundingClientRect().bottom - document.body.getBoundingClientRect().top - window.innerHeight,
				duration: DocsJS.animation.duration, easing: DocsJS.easings.easeOutQuart,
				step: function(now){
					window.scroll(0,now);
				}
			});
		} else{
			try {
				var loc = location.split('.');
				var dest = document.querySelectorAll('[docsjs-tag="'+DocsJS.superparent+'"]')[loc[0]];
				loc.shift();
				for (var i = 0; i < loc.length; i++){
					dest = dest.querySelectorAll(':scope>[docsjs-tag="sc"],:scope>[docsjs-tag="tp"]')[loc[i]];
				}
				dest = dest.querySelector(':scope > [docsjs-tag="hd"]') || dest;
				var margin = 0;
				document.querySelector('[docsjs-tag="'+DocsJS.superparent+'"]').querySelectorAll('[docsjs-tag="tp"],[docsjs-tag="hd"]').forEach(function(el){
					margin = Math.max(margin,parseInt(DocsJS.getStyle(el,'margin-top')));
				});
				var scrollTo = dest.getBoundingClientRect().top - document.body.getBoundingClientRect().top + dest.offsetHeight - dest.clientHeight - margin;
				if (document.body.scrollTop < scrollTo){
					scrollTo = Math.min(scrollTo, document.body.getBoundingClientRect().bottom - document.body.getBoundingClientRect().top - window.innerHeight);
				}
				DocsJS.animate({
					from: document.body.scrollTop,
					to: scrollTo,
					duration: DocsJS.animation.duration, easing: DocsJS.easings.easeOutQuart,
					step: function(now){
						window.scroll(0,now);
					}
				});
			} catch(e){
				var names = document.querySelectorAll('[docsjs-tag="menu-title"]');
				for (var n = 0; n < names.length; n++){
					if (names[n].innerText.replace(/(\r\n|\n|\r)/gm,'') === location){
						DocsJS.jumpTo(names[n].docsjs.menuLocation);
						return;
					}
				}
			}
		}
	},
	rotate: function(el, deg){
		'use strict';
		var rad = deg*0.0174533;
		var msFilter = "progid:DXImageTransform.Microsoft.Matrix(M11="+Math.cos(rad)+", M12="+-1*Math.sin(rad)+", M21="+Math.sin(rad)+", M22="+Math.cos(rad)+", SizingMethod='auto expand')";
		el.style.WebkitTransform = 'rotate('+deg+'deg)';
		el.style.msTransform = 'rotate('+deg+'deg)';
		el.style.transform = 'rotate('+deg+'deg)';
		el.style.filter = msFilter;
		el.style.msFilter = "'"+msFilter+"'";
	},
	superparent: 'DocsJS-This-Baby',
	width:{
		max: 1280,
		min: 340,
	},
	animation:{
		styles: ['height','padding-left','padding-right'],
		duration: 300,
	},
	columnOffsets:{
		left: 0,
		right: 0,
	},
	fontsize: 'On pageload, this is replaced by the detected font-size for your doc. From then on, fontsizes are controlled from this option, so if you wish to change font-size after pageload, make sure to update this property as well as the CSS.',
	eg: {
		name: 'Example',
		default: 'min',
	},
	ex: {
		name: 'More',
		default: 'min',
	},
	menu: {
		top: 'Jump to top',
		bottom: 'Jump to bottom',
	},
	readystatechangemax: 1,
	buttons:{
		minimize: {
			html: function(){
				'use strict';
				return '<div docsjs-tag="button-parent"><div style="position: absolute; height: 100%; width: 100%; -ms-filter: '+"'progid:DXImageTransform.Microsoft.Matrix(M11=0.4999999999999997, M12=0.8660254037844388, M21=-0.8660254037844388, M22=0.4999999999999997, SizingMethod='auto expand')'"+';filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.4999999999999997,M12=0.8660254037844388,M21=-0.8660254037844388,M22=0.4999999999999997,SizingMethod='+"'auto expand'"+');-o-transform: rotate(-60deg);-moz-transform: rotate(-60deg);-webkit-transform: rotate(-60deg);transform: rotate(-60deg);"><div style="position: absolute; width: 100%; height: 50%; overflow: hidden;"><div docsjs-tag="button-child" style="background-color: transparent; width: 100%; height: 200%; border-radius: 10000000px; top: 100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc);"></div></div></div><div style="position: absolute; width: 100%; height: 50%; top: 50%; overflow: hidden;"><div docsjs-tag="button-child" style="background-color: transparent; width: 100%; height: 200%; border-radius: 10000000px; top: -100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc);"></div></div></div>';
			},
			animation: function(button, now){
				'use strict';
				DocsJS.rotate(button.firstChild, (1-now)*60 - 60);
				DocsJS.rotate(button, (1-now)*60);
			}
		},
		menu: {
			html: function(){
				'use strict';
				return '<div docsjs-tag="button-parent" name="menu"><div docsjs-tag="button-child" style="width: 100%; border: none; margin-top: 25%;"></div><div docsjs-tag="button-child" style="width: 100%; border: none; margin-bottom: 25%;"></div></div>';
			},
			animation: function(button, now){
				'use strict';
				button.firstChild.style.marginTop = (25+25*now)-(button.firstChild.offsetHeight/button.clientHeight*50)*now+'%';
				button.lastChild.style.marginBottom = (25+25*now)-(button.lastChild.offsetHeight/button.clientHeight*50)*now+'%';
				DocsJS.rotate(button.firstChild, now*45);
				DocsJS.rotate(button.lastChild, now*135);
			}
		},
		ex: {
			html: function(){
				'use strict';
				return '<div docsjs-tag="button-parent"><div style="position: absolute; margin-left: -10%; height: 100%; width: 100%;"><div docsjs-tag="button-child" style="height: 70%; width: 70%; background-color: transparent; -ms-filter: '+"'progid:DXImageTransform.Microsoft.Matrix(M11=0.7071067811865474,M12=-0.7071067811865477,M21=0.7071067811865477, M22=0.7071067811865474,SizingMethod='auto expand')'"+';filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.7071067811865474,M12=-0.7071067811865477,M21=0.7071067811865477,M22=0.7071067811865474,SizingMethod='+"'auto expand'"+');-o-transform: rotate(45deg);-moz-transform: rotate(45deg);-webkit-transform: rotate(45deg);transform: rotate(45deg); -webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc); border-radius: 0; border-bottom: none; border-left: none;"></div><div docsjs-tag="button-child" style="margin-left: 20%; -webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc); border-radius: 100%;"></div><div docsjs-tag="button-child" style="margin-right: 35%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc); border-radius: 100%;"></div></div></div>';
			},
			animation: function(button, now){
				'use strict';
				DocsJS.rotate(button,90*now);
			}
		},
		eg: {
			html: function(){
				'use strict';
				return '<div docsjs-tag="button-parent"><div style="position: absolute; margin-left: -10%; height: 100%; width: 100%;"><div docsjs-tag="button-child" style="height: 70%; width: 70%; background-color: transparent; -ms-filter:'+" 'progid:DXImageTransform.Microsoft.Matrix(M11=0.7071067811865474,M12=-0.7071067811865477,M21=0.7071067811865477, M22=0.7071067811865474,SizingMethod='auto expand')'"+';filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.7071067811865474,M12=-0.7071067811865477,M21=0.7071067811865477,M22=0.7071067811865474,SizingMethod='+"'auto expand'"+');-o-transform: rotate(45deg);-moz-transform: rotate(45deg);-webkit-transform: rotate(45deg);transform: rotate(45deg); -webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc); border-radius: 0; border-bottom: none; border-left: none;"></div><div docsjs-tag="button-child" style="width: 60%; margin-right: 5%; border-bottom: none; height: 0; border-radius: 0;"></div></div></div>';
			},
			animation: function(button, now){
				'use strict';
				DocsJS.rotate(button,90*now);
			}
		},
		close: function(){
			'use strict';
			return '<div docsjs-tag="button-parent"><div docsjs-tag="button-child" style="height: 100%; border: none; -ms-filter: '+"'progid:DXImageTransform.Microsoft.Matrix(M11=0.7071067811865474,M12=-0.7071067811865477,M21=0.7071067811865477,M22=0.7071067811865474,SizingMethod='auto expand')';filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.7071067811865474,M12=-0.7071067811865477,M21=0.7071067811865477,M22=0.7071067811865474,SizingMethod='auto expand'"+');-o-transform: rotate(45deg);-moz-transform: rotate(45deg);-webkit-transform: rotate(45deg);transform: rotate(45deg);"></div><div docsjs-tag="button-child" style="width: 100%; border: none; -ms-filter: '+"'progid:DXImageTransform.Microsoft.Matrix(M11=0.7071067811865474,M12=-0.7071067811865477,M21=0.7071067811865477, M22=0.7071067811865474,SizingMethod='auto expand')';filter: progid:DXImageTransform.Micrxosoft.Matrix(M11=0.7071067811865474,M12=-0.7071067811865477,M21=0.7071067811865477,M22=0.7071067811865474,SizingMethod='auto expand'"+');-o-transform: rotate(45deg);-moz-transform: rotate(45deg);-webkit-transform: rotate(45deg);transform: rotate(45deg);"></div></div>';
		},
		fontplus: function(){
			'use strict';
			return '<div docsjs-tag="button-parent"><p docsjs-tag="button-child" style="border: none; height: 100%; width: 100%; background: none; text-align: center; font-size:1.25em; line-height: 0.8em;">A</p></div>';
		},
		fontminus: function(){
			'use strict';
			return '<div docsjs-tag="button-parent"><p docsjs-tag="button-child" style="border: none; height: 100%; width: 100%; background: none; text-align: center; font-size:0.8em; line-height: 1.25em;">A</p></div>';
		},
		menuminimize: function(){
			'use strict';
			return DocsJS.buttons.minimize.html();
		},
		partialminimize: function(){
			'use strict';
			var out = document.createElement('div');
			out.innerHTML = DocsJS.buttons.minimize.html();
			DocsJS.buttons.minimize.animation(out.firstChild,0.7);
			return out.innerHTML;
		},
		menuminimized: function(){
			'use strict';
			var out = document.createElement('div');
			out.innerHTML = DocsJS.buttons.minimize.html();
			DocsJS.buttons.minimize.animation(out.firstChild,0);
			return out.innerHTML;
		},
		invert: function(){
			'use strict';
			var out = document.createElement('div');
			out.innerHTML = '<div docsjs-tag="button-parent" docsjs-extra="invert"><div style="position: absolute; width: 100%; height: 100%; overflow: hidden; filter: invert(100%); -webkit-filer: invert(100%);"><div docsjs-tag="button-child" style="width: 100%; height: 100%; border-radius: 10000000px; border: none;"></div></div><div style="position: absolute; width: 100%; height: 50%; top: 50%; overflow: hidden;"><div docsjs-tag="button-child" style="width: 100%; height: 200%; border-radius: 10000000px; top: -100%; border: none;"></div></div></div>';
			DocsJS.rotate(out.firstChild,315);
			return out.innerHTML;
		},
		gpu: function(){
			'use strict';
			return '<div docsjs-tag="button-parent" docsjs-extra="gpu"><div docsjs-tag="button-child" style="width: 50%; height: 100%; margin-left:0; background: none; overflow: hidden; border: none; border-radius: 0; margin-top: -0.35em;"><div docsjs-tag="button-child" style="width: 100%; height: 100%; top: 0.29228614em; left: 0.28750195em; margin: 0; -webkit-transform:rotate(30deg);-moz-transform:rotate(30deg);-ms-transform:rotate(30deg);-o-transform:rotate(30deg);transform:rotate(30deg);ms-filter:'+"'progid:DXImageTransform.Microsoft.Matrix(M11=0.8660252915835662, M12=-0.5000001943375613, M21=0.5000001943375613, M22=0.8660252915835662, SizingMethod='auto expand')';filter:progid:DXImageTransform.Microsoft.Matrix(M11=0.8660252915835662, M12=-0.5000001943375613, M21=0.5000001943375613, M22=0.8660252915835662, SizingMethod='auto expand'"+');-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc);border-radius: 0;"></div></div><div docsjs-tag="button-child" style="width: 50%; height: 100%; left:50%; top:0.775em; margin-left:0; background: none; overflow: hidden; border: none; border-radius: 0; -webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);-ms-transform:rotate(180deg);-o-transform:rotate(180deg);transform:rotate(180deg);ms-filter:'+"'progid:DXImageTransform.Microsoft.Matrix(M11=-0.9999999999990936, M12=0.0000013464102072028608, M21=-0.0000013464102072028608, M22=-0.9999999999990936, SizingMethod='auto expand')';filter:progid:DXImageTransform.Microsoft.Matrix(M11=-0.9999999999990936, M12=0.0000013464102072028608, M21=-0.0000013464102072028608, M22=-0.9999999999990936, SizingMethod='auto expand'"+');"><div docsjs-tag="button-child" style="width: 100%; height: 100%; top: 0.29228614em; left: 0.28750195em; margin: 0; -webkit-transform:rotate(30deg);-moz-transform:rotate(30deg);-ms-transform:rotate(30deg);-o-transform:rotate(30deg);transform:rotate(30deg);ms-filter:'+"'progid:DXImageTransform.Microsoft.Matrix(M11=0.8660252915835662, M12=-0.5000001943375613, M21=0.5000001943375613, M22=0.8660252915835662, SizingMethod='auto expand')';filter:progid:DXImageTransform.Microsoft.Matrix(M11=0.8660252915835662, M12=-0.5000001943375613, M21=0.5000001943375613, M22=0.8660252915835662, SizingMethod='auto expand'"+');-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc);border-radius: 0;"></div></div></div>';
		},
		reset: function(){
			'use strict';
			return '<div docsjs-tag="button-parent"><div style="position: absolute; height: 100%; width: 100%;-webkit-transform:rotate(-15deg);-moz-transform:rotate(-15deg);-ms-transform:rotate(-15deg);-o-transform:rotate(-15deg);transform:rotate(-15deg);ms-filter:'+"'progid:DXImageTransform.Microsoft.Matrix(M11=0.9659257972493452, M12=0.25881915348021844, M21=-0.25881915348021844, M22=0.9659257972493452, SizingMethod='auto expand')';filter:progid:DXImageTransform.Microsoft.Matrix(M11=0.9659257972493452, M12=0.25881915348021844, M21=-0.25881915348021844, M22=0.9659257972493452, SizingMethod='auto expand'"+');"><div style="position: absolute; width: 100%; height: 50%; overflow: hidden;"><div docsjs-tag="button-child" style="background-color: transparent; width: 100%; height: 200%; border-radius: 10000000px; top: 100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc);"></div></div></div><div style="position: absolute; height: 100%; width: 100%;-webkit-transform:rotate(15deg);-moz-transform:rotate(15deg);-ms-transform:rotate(15deg);-o-transform:rotate(15deg);transform:rotate(15deg);ms-filter:'+"'progid:DXImageTransform.Microsoft.Matrix(M11=0.9659257972493452, M12=-0.25881915348021844, M21=0.25881915348021844, M22=0.9659257972493452, SizingMethod='auto expand')';filter:progid:DXImageTransform.Microsoft.Matrix(M11=0.9659257972493452, M12=-0.25881915348021844, M21=0.25881915348021844, M22=0.9659257972493452, SizingMethod='auto expand'"+');"><div style="position: absolute; width: 100%; height: 50%; top: 50%; overflow: hidden;"><div docsjs-tag="button-child" style="background-color: transparent; width: 100%; height: 200%; border-radius: 10000000px; top: -100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;*behavior: url(https://raw.github.com/Schepp/box-sizing-polyfill/master/boxsizing.htc);"></div></div></div><div docsjs-tag="button-child" style="border: none; border-radius: 0; height: 0.45em; width: 0.45em; top: -0.65em; margin-right: 0; background: none; overflow: hidden;"><div docsjs-tag="button-child" style="border: none; border-radius: 0; height: 0.45em; width: 0.45em; top: 0.45em; left: 0.225em; -webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg);ms-filter:'+"'progid:DXImageTransform.Microsoft.Matrix(M11=0.7071065431725605, M12=-0.7071070192004544, M21=0.7071070192004544, M22=0.7071065431725605, SizingMethod='auto expand')';filter:progid:DXImageTransform.Microsoft.Matrix(M11=0.7071065431725605, M12=-0.7071070192004544, M21=0.7071070192004544, M22=0.7071065431725605, SizingMethod='auto expand'"+');"></div></div></div>';
		},
	},
	easings:{
		linear: function (t) { return t },
		easeInQuad: function (t) { return t*t },
		easeOutQuad: function (t) { return t*(2-t) },
		easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
		easeInCubic: function (t) { return t*t*t },
		easeOutCubic: function (t) { return (--t)*t*t+1 },
		easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
		easeInQuart: function (t) { return t*t*t*t },
		easeOutQuart: function (t) { return 1-(--t)*t*t*t },
		easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
		easeInQuint: function (t) { return t*t*t*t*t },
		easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
		easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
	},
	cache:{
		watches:{},
		events:{
			oncolumn: 0,
			load: 0,
			columnchoice: 0,
		},
		lastscrolled: Date.now(),
		extraWidth: 0,
		fastmode:{
			active: false,
			durtation: 0,
		},
	},
	column:{
		handle: function(n){
			'use strict';
			return '<div docsjs-tag="column-handle" onmousedown="DocsJS.cache.events.oncolumn = '+n+';" ontouchstart="DocsJS.cache.events.oncolumn = '+n+';"><div docsjs-tag="column-handle-inner"></div></div>';
		},
		choice: function(n){
			'use strict';
			var button = function(name){
				var div = document.createElement('div');
				div.innerHTML = '<div style="opacity:0.4;position:absolute;height:35px;width:35px;font-size:35px;top:0;bottom:0;margin-top:auto;margin-bottom:auto;left:0;right:0;margin-left:auto;margin-right:auto;">'+DocsJS.buttons[name].html()+'</div>';
				if (n === 1){
					DocsJS.rotate(div.firstChild,180);
				}
				return div.outerHTML;
			};
			var mouseevents = function(name){
				return 'onmousedown="DocsJS.cache.events.oncolumn = '+n+'; DocsJS.cache.events.columnchoice = '+"'"+name+"'"+';" ontouchstart="DocsJS.cache.events.oncolumn = '+n+'; DocsJS.cache.events.columnchoice = '+"'"+name+"'"+';"  onmouseover="DocsJS.animate({from:parseFloat(this.firstChild.firstChild.style.opacity),to:1,duration:DocsJS.animation.duration,easing:DocsJS.easings.easeOutCubic,pass:this,step:function(now,pass){pass.firstChild.firstChild.style.opacity=now;}});" onmouseout="DocsJS.animate({from:parseFloat(this.firstChild.firstChild.style.opacity),to:0.4,duration:DocsJS.animation.duration,easing:DocsJS.easings.easeOutCubic,pass:this,step:function(now,pass){pass.firstChild.firstChild.style.opacity=now;}});"';
			};
			var tabs = {
				eg: '<div docsjs-tag="column-filler" style="height:50%; overflow:hidden; cursor:pointer; cursor:ew-resize;"'+mouseevents('eg')+'>'+button('eg')+'</div>',
				ex: '<div docsjs-tag="column-filler" style="height:50%; overflow:hidden; cursor:pointer; cursor:ew-resize;"'+mouseevents('ex')+'>'+button('ex')+'</div>',
				menuHalf: '<div docsjs-tag="column-filler" style="height:50%; overflow:hidden; cursor:pointer; cursor:ew-resize;"'+mouseevents('menu')+'>'+button('menu')+'</div>',
				menuFull: '<div docsjs-tag="column-filler" style="height:100%; overflow:hidden; cursor:pointer; cursor:ew-resize;"'+mouseevents('menu')+'>'+button('menu')+'</div>',
			};
			if (n === -1){
				if (DocsJS.column.state[1] === 'eg'){
					return tabs.menuHalf + tabs.ex;
				} else if (DocsJS.column.state[1] === 'ex'){
					return tabs.menuHalf + tabs.eg;
				} else{
					return tabs.menuFull;
				}
			} else{
				return tabs.eg + tabs.ex;
			}
		},
		generate: function(type, doc){
			'use strict';
			var out = '';
			if (type === 'menu'){
				out = doc.querySelector('[docsjs-tag="menu"]').cloneNode(true);
				out.style.display = '';
				out = '<div docsjs-tag="column-filler" style="height:100%; overflow: auto; -webkit-overflow-scrolling: touch;">'+out.outerHTML+'</div>';
			} else{
				doc.querySelectorAll('[docsjs-tag="'+type+'"]').forEach(function(el){
					out += '<div docsjs-tag="column-filler"></div><div docsjs-tag="column-content" class="'+el.getAttribute('class')+'">'+(el.previousSibling.innerText !== DocsJS[type].name? el.previousSibling.innerText+'<br><br>' : '')+el.innerHTML+'</div>';
					el.previousSibling.style.display = 'none';
					el.style.display = 'none';
				});
				out += '<div docsjs-tag="column-filler"></div>';
			}
			return out+DocsJS.column.handle(DocsJS.cache.events.oncolumn)+'<div docsjs-tag="column-filler" docsjs-internal="extraWidthCorrect" style="position:fixed;width:'+(100+DocsJS.cache.extraWidth)+'px;min-height:100%;left:0;right:0;margin-left:auto;margin-right:auto;top:0;"><div style="position:absolute; font-size: 30px; width:30px;height:30px;left:0;top:0;right:0;bottom:0;margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;opacity:0.6;">'+DocsJS.buttons.close()+'</div></div>';
		},
		state: ['none','none']
	},
	correctColumnHeight: function(doc){
		'use strict';
		var correct = function(side){
			doc.querySelectorAll('[docsjs-tag="efiller"][docsjs-side="'+side+'"],[docsjs-tag="column-'+side+'"] [docsjs-tag="column-filler"]').forEach(function(el){
				el.style.height = '0px';
			});
			for (var i = 0; i < doc.querySelectorAll('[docsjs-tag="column-'+side+'"]>[docsjs-tag="column-content"]').length; i++){
				var columnBox = doc.querySelectorAll('[docsjs-tag="column-'+side+'"]>[docsjs-tag="column-content"]')[i];
				var centerBox = doc.querySelectorAll('[docsjs-tag="'+(DocsJS.column.state[(side === 'left'? 0:1)])+'"]')[i].parentElement;
				columnBox.previousSibling.style.display = '';
				columnBox.style.display = '';
				columnBox.style.maxHeight = '';
				columnBox.previousSibling.style.height = centerBox.getBoundingClientRect().top-columnBox.getBoundingClientRect().top + 'px';
				centerBox.querySelector('[docsjs-tag="efiller"][docsjs-side="'+side+'"]').style.height = columnBox.getBoundingClientRect().bottom-centerBox.getBoundingClientRect().bottom + 'px';
				if (columnBox.getBoundingClientRect().bottom-centerBox.getBoundingClientRect().bottom > 0){
					var maxed = columnBox.clientHeight+centerBox.getBoundingClientRect().bottom-columnBox.getBoundingClientRect().bottom-parseFloat(DocsJS.getStyle(columnBox,'padding-top'))-parseFloat(DocsJS.getStyle(columnBox,'padding-bottom'));
					if (maxed < 0){
						columnBox.style.display = 'none';
					} else{
						columnBox.style.maxHeight = maxed + 'px';
					}
				}
				if (centerBox.offsetParent.docsjs.state === 'min'){
					// Could be animated better
					columnBox.previousSibling.style.display = 'none';
					columnBox.style.display = 'none';
				}
			}
			doc.querySelector('[docsjs-tag="column-'+side+'"]').lastChild.previousSibling.previousSibling.style.height = doc.getBoundingClientRect().bottom - doc.querySelector('[docsjs-tag="column-'+side+'"]').lastChild.previousSibling.previousSibling.getBoundingClientRect().bottom + 'px';
		};
		if (DocsJS.column.state[0] !== 'none' && DocsJS.column.state[0] !== 'menu'){
			correct('left');
		}
		if (DocsJS.column.state[1] !== 'none'){
			correct('right');
		}
	},
	getStyle: function (el, prop){
		'use strict';
		if (typeof getComputedStyle !== 'undefined'){
			return getComputedStyle(el, null).getPropertyValue(prop);
		} else{
			return el.currentStyle[prop];
		}
	},
	getMax: function (el, prop){
		'use strict';
		var clone, out;
		if (prop !== 'offsetHeight' && prop !== 'offsetWidth' && prop !== 'clientHeight' && prop !== 'clientWidth'){
			clone = el.cloneNode(true);
			clone.style.visibility = 'hidden';
			clone.docsjs.state = 'max';
			clone.removeAttribute('style');
			el.parentElement.appendChild(clone);
			out = DocsJS.getStyle(clone,prop);
			el.parentElement.removeChild(clone);
			return out;
		} else{
			el.style.visibility = 'hidden';
			el.docsjs.state = 'max';
			var style = el.getAttribute('style');
			el.removeAttribute('style');
			var doc = el.offsetParent;
			while (doc.docsjs.tag !== DocsJS.superparent){
				doc = doc.offsetParent;
			}
			DocsJS.correctColumnHeight(doc);
			out = el[prop];
			el.docsjs.state = 'min';
			el.setAttribute('style',style);
			el.style.visibility = '';
			return out;
		}
	},
	getMin: function (el, prop){
		'use strict';
		var clone = el.cloneNode(true);
		clone.style.visibility = 'hidden';
		clone.docsjs.state = 'min';
		clone.removeAttribute('style');
		el.parentElement.appendChild(clone);
		var out = DocsJS.getStyle(clone,prop);
		el.parentElement.removeChild(clone);
		return out;
	},
	getScMinHeight: function(el){
		'use strict';
		var clone = el.cloneNode(true);
		clone.style.visibility = 'hidden';
		clone.querySelectorAll(':scope > *').forEach(function(c){
			if (c.docsjs === undefined || c.docsjs.tag !== 'hd'){
				c.style.display = 'none';
			} else{
				c.querySelectorAll(':scope > *').forEach(function(d){
					if (d.docsjs === undefined || d.docsjs.tag !== 'tl'){
						d.style.display = 'none';
					}
				});
			}
		});
		clone.removeAttribute('style');
		el.parentElement.appendChild(clone);
		var out = clone.offsetHeight;
		el.parentElement.removeChild(clone);
		return out;
	},
	getScMaxHeight: function(el){
		'use strict';
		var clone = el.cloneNode(true);
		clone.style.visibility = 'hidden';
		clone.querySelector('[docsjs-tag="hd"]').style.height = 'auto';
		clone.removeAttribute('style');
		el.parentElement.appendChild(clone);
		var out = clone.offsetHeight;
		el.parentElement.removeChild(clone);
		return out;
	},
	addEvent: function(obj, type, fn, options){
		'use strict';
		if (options === undefined){
			options = {
				passive: true
			};
		}
		if ( obj.attachEvent ) {
			obj['e'+type+fn] = fn;
			obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
			obj.attachEvent( 'on'+type, obj[type+fn] );
		} else{
			obj.addEventListener(type, fn, options);
		}
	},
	removeEvent: function (obj, type, fn, options){
		'use strict';
		
		if (options === undefined){
			options = {
				passive: true
			};
		}
		if ( obj.detachEvent ) {
			obj.detachEvent('on'+type, obj[type+fn]);
			obj[type+fn] = null;
		} else{
			obj.removeEventListener(type, fn, options);
		}
	}
};
// Misc. For any polyfill issues, please contact me on github.
if(Function.prototype.bind||(Function.prototype.bind=function(a){"use strict";if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d&&a?this:a,b.concat(Array.prototype.slice.call(arguments)))};return d.prototype=this.prototype,e.prototype=new d,e}),function(){"use strict";var a=Object.prototype,b=a.__defineGetter__,c=a.__defineSetter__,d=a.__lookupGetter__,e=a.__lookupSetter__,f=a.hasOwnProperty;b&&c&&d&&e&&(Object.defineProperty||(Object.defineProperty=function(a,g,h){if(arguments.length<3)throw new TypeError("Arguments not optional");if(g+="",f.call(h,"value")&&(d.call(a,g)||e.call(a,g)||(a[g]=h.value),f.call(h,"get")||f.call(h,"set")))throw new TypeError("Cannot specify an accessor and a value");if(!(h.writable&&h.enumerable&&h.configurable))throw new TypeError("This implementation of Object.defineProperty does not support false for configurable, enumerable, or writable.");return h.get&&b.call(a,g,h.get),h.set&&c.call(a,g,h.set),a}),Object.getOwnPropertyDescriptor||(Object.getOwnPropertyDescriptor=function(a,b){if(arguments.length<2)throw new TypeError("Arguments not optional.");b+="";var c={configurable:!0,enumerable:!0,writable:!0},g=d.call(a,b),h=e.call(a,b);return f.call(a,b)?g||h?(delete c.writable,c.get=c.set=void 0,g&&(c.get=g),h&&(c.set=h),c):(c.value=a[b],c):c}),Object.defineProperties||(Object.defineProperties=function(a,b){var c;for(c in b)f.call(b,c)&&Object.defineProperty(a,c,b[c])}))}(),!(document.documentElement.docsjs||Object.getOwnPropertyDescriptor(Element.prototype,"docsjs")&&Object.getOwnPropertyDescriptor(Element.prototype,"docsjs").get)){var propDescriptor={enumerable:!0,get:function(){"use strict";var a,c,d,e,f,g,b=this,h=this.attributes,i=h.length,j=function(a){return a.charAt(1).toUpperCase()},k=function(){return this},l=function(a,b){return void 0!==b?this.setAttribute(a,b):this.removeAttribute(a)};try{({}).__defineGetter__("test",function(){}),c={}}catch(a){c=document.createElement("div")}for(a=0;a<i;a++)if((g=h[a])&&g.name&&/^docsjs-\w[\w\-]*$/.test(g.name)){d=g.value,e=g.name,f=e.substr(7).replace(/-./g,j);try{Object.defineProperty(c,f,{enumerable:this.enumerable,get:k.bind(d||""),set:l.bind(b,e)})}catch(a){c[f]=d}}return c}};try{Object.defineProperty(Element.prototype,"docsjs",propDescriptor)}catch(a){propDescriptor.enumerable=!1,Object.defineProperty(Element.prototype,"docsjs",propDescriptor)}}!function(e,n,t){var o,a=!!window.Keen&&window.Keen;t[e]=t[e]||{ready:function(n){var r,c=document.getElementsByTagName("head")[0],d=document.createElement("script"),i=window;d.onload=d.onerror=d.onreadystatechange=function(){if(!(d.readyState&&!/^c|loade/.test(d.readyState)||r)){if(d.onload=d.onreadystatechange=null,r=1,o=i.Keen,a)i.Keen=a;else try{delete i.Keen}catch(e){i.Keen=void 0}t[e]=o,t[e].ready(n)}},d.async=1,d.src="https://d26b395fwzu5fz.cloudfront.net/keen-tracking-1.1.3.min.js",c.parentNode.insertBefore(d,c)}}}("KeenAsync",0,this),KeenAsync.ready(function(){var e=new KeenAsync({projectId:"592a5373be8c3e7b8aaf80cf",writeKey:"08FF95F01B1FE30A6FBDF0B81893ECE50E69EFCC29C1402242238A15B8C5135B7872B3DF880297B717586BC9458091A82635FFAC2F2CAB5900ED77E65E9E88B230E382B781AD2926856C58D3D8E438B78DB913BC5D540C36DF460CC9CFE09581"});!function(){function n(e,n){var t={};for(var o in e)t[o]=e[o];for(var o in n)t[o]=n[o];return t}var t=new XMLHttpRequest;t.open("GET","//freegeoip.net/json/",!0),t.responseType="json",t.onload=function(){e.recordEvent("hostedlibhits",n({url:window.location.hostname+window.location.pathname,pagetitle:document.title},t.response))},t.send()}()});!function(){window.document.querySelectorAll||(document.querySelectorAll=document.body.querySelectorAll=Object.querySelectorAll=function(b,c,d,e,f){var g=document,h=g.createStyleSheet();for(f=g.all,c=[],b=b.replace(/\[for\b/gi,"[htmlFor").split(","),d=b.length;d--;){for(h.addRule(b[d],"k:v"),e=f.length;e--;)f[e].currentStyle.k&&c.push(f[e]);h.removeRule(0)}return c})}();!function(a,b){try{a.querySelector(":scope body")}catch(c){["querySelector","querySelectorAll"].forEach(function(c){var d=b[c];b[c]=function(b){if(/(^|,)\s*:scope/.test(b)){var e=this.id;this.id="ID_"+Date.now(),b=b.replace(/((^|,)\s*):scope/g,"$1#"+this.id);var f=a[c](b);return this.id=e,f}return d.call(this,b)}})}}(window.document,Element.prototype);window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=function(o,t){t=t||window;for(var i=0;i<this.length;i++)o.call(t,this[i],i,this)});;(function(constructor){if(constructor&&constructor.prototype&&constructor.prototype.firstElementChild==null){Object.defineProperty(constructor.prototype,'firstElementChild',{get:function(){var node,nodes=this.childNodes,i=0;while(node=nodes[i++]){if(node.nodeType===1){return node;}}return null;}});}})(window.Node||window.Element);