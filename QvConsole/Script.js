/*
 * QvConsole a console for Javascript debugging
 * 
 * by Thomas Friebel (thomasfriebel@gmail.com)
 * 
 * License: See license file included
 *  
 */
$(function(){

	window._oldconsole = window.console
	window._qvConsole = false
	window.console = {
			/*
			 * The new console object, that overrides any given console or defines one, if none exists
			 * All (common) calls are passed through to the original console object 
			 */
			_timers : {}
			,writeit : function(type,args) {
				var sItems = "> "
				for (var i = 0; i < args.length; i++) {
					sItems += args[i]+";";
				}
				try {
					switch (type) {
						case 1:
							if (typeof window._oldconsole !== "undefined") {
								window._oldconsole.log(window.console.writeit.caller.arguments.length > 1 ? window.console.writeit.caller.arguments : window.console.writeit.caller.arguments[0]);
							}
							$(window._qvConsole).append("<div class='consoletrace'>"+sItems+"</div>")
							break;
						case 2:
							if (typeof window._oldconsole !== "undefined") {
								window._oldconsole.trace(window.console.writeit.caller.arguments.length > 1 ? window.console.writeit.caller.arguments : window.console.writeit.caller.arguments[0]);
							}
							$(window._qvConsole).append("<div class='consoledebug'>"+sItems+"</div>")
							break;
						case 3:
							if (typeof window._oldconsole !== "undefined") {
								window._oldconsole.debug(window.console.writeit.caller.arguments.length > 1 ? window.console.writeit.caller.arguments : window.console.writeit.caller.arguments[0]);
							}
							$(window._qvConsole).append("<div class='consoleinfo'>"+sItems+"</div>")
							break;
						case 5:
							if (typeof window._oldconsole !== "undefined") {
								window._oldconsole.error(window.console.writeit.caller.arguments.length > 1 ? window.console.writeit.caller.arguments : window.console.writeit.caller.arguments[0]);
							}
							$(window._qvConsole).append("<div class='consoleerror'>"+sItems+"</div>")
							break;
						default :
							if (typeof window._oldconsole !== "undefined") {
								window._oldconsole.log(window.console.writeit.caller.arguments.length > 1 ? window.console.writeit.caller.arguments : window.console.writeit.caller.arguments[0]);
							}
							$(window._qvConsole).append("<div class='consolelog'>"+sItems+"</div>")
					}
					window._qvConsoleClone = $(window._qvConsole).html()
				} catch (Exception) {}
				window._qvConsole.scrollTop = window._qvConsole.scrollHeight 
			},
			log :function(){
				window.console.writeit(0,window.console.log.arguments)
			}
			,trace : function(x) {
				window.console.writeit(1,window.console.trace.arguments)
			}
			,debug : function(x) {
				window.console.writeit(2,window.console.debug.arguments)
			}
			,info : function(x) {
				window.console.writeit(3,window.console.info.arguments)
			}
			,error : function(x) {
				window.console.writeit(5,window.console.error.arguments)
			}
			,clear : function() {
				try {
					if (typeof window._oldconsole !== "undefined") 
						window._oldconsole.clear();
				} catch(Exception){}
				$(window._qvConsole).empty("")
				window._qvConsoleClone = null
				window._qvConsole.scrollTop = 0 
			}
			,time : function(sName) {
				window.console._timers[sName] = new Date()
			}
			,timeEnd : function(sName) {
				window.console.log("Timer "+sName +" = " + (new Date() - window.console._timers[sName]) + " ms")
			}
	};
	
	Qva.AddExtension('QvConsole', function() {
		var _this = this

		_this.extensionName = 'QvConsole'
		_this.version = '1.0'
			
		_this.QvaPublic.Paint = function() {
			//dynamically size the console panel 
			//30 is the fixed height of the bottom panel
			$(this._qvConsole).height($(this.Element).outerHeight() - 30)
		}
			var cssFiles = [];
	        cssFiles.push('Extensions/' + _this.extensionName + '/lib/css/qvconsole.css');
	        for (var i = 0; i < cssFiles.length; i++) {
	            Qva.LoadCSS(Qva.Remote + (Qva.Remote.indexOf('?') >= 0 ? '&' : '?') + 'public=only' + '&name=' + cssFiles[i]);
	        }		
	        $(_this.Element).addClass("qvconsole")
	        _this._qvConsole = window._qvConsole = $("<div class='console'></div>")[0] //remember the HTML element
	        $(_this.Element).append(window._qvConsole)
	        
	        $(_this.Element).append("<div class='bottom'></div>")

	        var evalInput = $("<input type='text' placeholder='Enter expression to evaluate and hit ENTER'>").on("keyup", evaluateExpressionEvent)
	        var clearButton = $("<button type='button' title='Clear console output'>&times;</button>").on("click", function(ev) {console.clear()})

	        $(".bottom",$(_this.Element)).append(evalInput).append(clearButton)
	        
	        if (window._qvConsoleClone) {
	        	//older logs that need to be recreated after a tab switch
	        	$(window._qvConsole).append($(window._qvConsoleClone)).append("<hr/>")
	        } else {
		        console.info("QvConsole initialized and ready to log...")
	        }

	    
	    _this.QvaPublic.Paint()
		
		function evaluateExpressionEvent(ev){
        	if (ev.keyCode == 13 && $(ev.target).val()) { //if RETURN and value
        		try {
        			console.info(eval($(ev.target).val()))
        			$(ev.target).val("") //clear input
        		} catch (Exception) {
        			console.error("Evaluation failed: " + $(ev.target).val())
        		}
        	}
        }		

			});
	
});