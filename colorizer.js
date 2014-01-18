var colorizer = {
	start: function(){
		clearInterval( colorizer.data.timers.watcher );
		colorizer.data.timers.watcher = setInterval( colorizer.run.watcher , colorizer.data.timers.checkrate );
		colorizer.running = true;
	},

	stop: function(){
		clearInterval( colorizer.data.timers.watcher );
		colorizer.running = false;
	},

	rate: function( set ){
		if ( typeof set == "undefined" ){
			return colorizer.data.timers.checkrate;
		} else {
			colorizer.data.timers.checkrate = set;
			if ( colorizer.running == true ){
				colorizer.start();
			}
		}
	},

	cycle: function(){
		colorizer.run.watcher();
	},

	active: function(){
		return colorizer.running;
	},

	running: false,

	data: {
		timers: {
			checkrate: 1000,
			watcher: undefined,
		},
		images: [],
	},

	run: {
		watcher: function(){
			
			colorizer.data.images = [];

			var images = document.getElementsByTagName("img");
			for( i = 0 , idur = images.length ; i < idur ; i++ ){
				if ( images[i].hasAttribute("color") == true || images[i].hasAttribute("blendmode") == true ){
					if ( typeof images[i].colorize == "undefined" ){

						images[i].colorize = {
							baseImage: undefined,
							currentColor: undefined,
							blendmode: undefined,
						}

					}

					colorizer.data.images.push( images[i] );
				} else {
					if ( typeof images[i].colorize != "undefined" ){
						colorizer.run.destroy( images[i] );
					}
				}
			}

			var images = colorizer.data.images;
			for( var i = 0 , idur = images.length ; i < idur ; i++ ){
				if ( images[i].colorize.baseImage == undefined ){
					colorizer.run.apply( images[i] , true );
				}

				if ( images[i].getAttribute("color") != images[i].colorize.currentColor || images[i].getAttribute("blendmode") != images[i].colorize.blendmode ){
					colorizer.run.apply( images[i] , false );
				}
			}

		},

		destroy: function( image ){
			colorizer.run.revert( image );
			delete image.colorize;
		},

		revert: function( image ){
			var draw = {

				canvas: undefined,
				context: undefined,
				width: undefined,
				height: undefined,
				data: undefined,

				init: function(){

					draw.getData();
					draw.build();
					draw.output();

				},

				getData: function(){
					draw.width = image.offsetWidth;
					draw.height = image.offsetHeight;
					draw.data = image.colorize.baseImage;
				},

				build: function(){
					draw.canvas = document.createElement("canvas");
					draw.canvas.setAttribute( "style","position:absolute;top:-" + draw.height.toString() + "px;left:-" + draw.width.toString() + "px;width:" + draw.width.toString() + "px;height:" + draw.height.toString() + "px;");
				
					document.body.appendChild( draw.canvas );

					draw.context = draw.canvas.getContext("2d");
					draw.canvas.width = draw.width;
					draw.canvas.height = draw.height;
				},

				output: function(){
					draw.context.clearRect( 0 , 0 , draw.width , draw.height );
					draw.context.putImageData( draw.data , 0 , 0 );

					image.src = draw.canvas.toDataURL();

					draw.canvas.parentNode.removeChild( draw.canvas );
				}
			}

			draw.init();
		},

		apply: function( image , save ){
			
			var draw = {

				canvas: undefined,
				context: undefined,
				width: undefined,
				height: undefined,
				data: undefined,

				init: function(){

					draw.getData();
					draw.build();

					if ( save == true ){
						draw.image();
						image.colorize.baseImage = draw.save();
					}

					draw.apply();
					draw.output();

				},

				getData: function(){
					draw.width = image.offsetWidth;
					draw.height = image.offsetHeight;
				},

				build: function(){
					draw.canvas = document.createElement("canvas");
					draw.canvas.setAttribute( "style","position:absolute;top:-" + draw.height.toString() + "px;left:-" + draw.width.toString() + "px;width:" + draw.width.toString() + "px;height:" + draw.height.toString() + "px;");
				
					document.body.appendChild( draw.canvas );

					draw.context = draw.canvas.getContext("2d");
					draw.canvas.width = draw.width;
					draw.canvas.height = draw.height;
				},

				image: function(){
					draw.context.drawImage( image , 0 , 0 , draw.width , draw.height );
					draw.data = draw.context.getImageData( 0 , 0 , draw.width , draw.height );
				},

				save: function(){
					var imgData = draw.context.getImageData( 0 , 0 , draw.width , draw.height );
					return imgData;
				},

				apply: function(){
					
					draw.context.putImageData( image.colorize.baseImage , 0 , 0 );

					var imgData = draw.context.getImageData( 0 , 0 , draw.width , draw.height ),
						data = imgData.data;

					if ( image.getAttribute("color").indexOf("rgb") == -1 ){
						var color = draw.toRGB( image.getAttribute("color") );
					} else {
						var color = draw.interpRGB( image.getAttribute("color") );
					}

					image.colorize.blendmode = image.getAttribute("blendmode");

					var blendArray = image.colorize.blendmode.split(" ");
					
					for( var i = 0 , idur = blendArray.length ; i < idur ; i++ ){
						if ( draw.blendmode.hasOwnProperty( blendArray[i] )){
							data = draw.blendmode[ blendArray[i] ]( data , color );
						}
					}
					
					imgData.data = data;
					draw.data = imgData;
				},

				blendmode: {

					/* 	complete so far:
						multiply
						screen
						darken
						lighten
						addition
						subtraction
						divide
						greyscale
					*/

					greyscale: function( data, color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							var red = green = blue = Math.round(( red + green + blue ) / 3 );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					overlay: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							// idk

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					screen: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = 255 - Math.floor((( 255 - color.r ) * ( 255 - red )) / 255 );
							green = 255 - Math.floor((( 255 - color.g ) * ( 255 - green )) / 255 );
							blue = 255 - Math.floor((( 255 - color.b ) * ( 255 - blue )) / 255 );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					lighten: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.max( red , color.r );
							green = Math.max( green , color.g );
							blue = Math.max( blue , color.b );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					darken: function( data , color ){
						console.log( "darken" );
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.min( red , color.r );
							green = Math.min( green , color.g );
							blue = Math.min( blue , color.b );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					colorDodge: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.floor(( color.r * red ) / 255 );
							green = Math.floor(( color.g * green ) / 255 );
							blue = Math.floor(( color.b * blue ) / 255 );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					colorBurn: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.floor(( color.r * red ) / 255 );
							green = Math.floor(( color.g * green ) / 255 );
							blue = Math.floor(( color.b * blue ) / 255 );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					linearDodge: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.floor(( color.r * red ) / 255 );
							green = Math.floor(( color.g * green ) / 255 );
							blue = Math.floor(( color.b * blue ) / 255 );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					linearBurn: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.floor(( color.r * red ) / 255 );
							green = Math.floor(( color.g * green ) / 255 );
							blue = Math.floor(( color.b * blue ) / 255 );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					addition: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.min( red + color.r , 255 )
							green = Math.min( green + color.g , 255 )
							blue = Math.min( blue + color.g , 255 )

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					subtract: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.max( red - color.r , 0 )
							green = Math.max( green - color.g , 0 )
							blue = Math.max( blue - color.g , 0 )

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					multiply: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.floor(( color.r * red ) / 255 );
							green = Math.floor(( color.g * green ) / 255 );
							blue = Math.floor(( color.b * blue ) / 255 );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					divide: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.floor(( color.r / red ) / 255 );
							green = Math.floor(( color.g / green ) / 255 );
							blue = Math.floor(( color.b / blue ) / 255 );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},

					hardLight: function( data , color ){
						
						draw.blendmode[ "multiply" ]( data , color );
						draw.blendmode[ "screen" ]( data , color );

						return data;
					},

					softLight: function( data , color ){
						for ( var i = 0 , idur = data.length ; i < idur ; i += 4 ){
							
							var red = data[ i + 0 ],
								green = data[ i + 1 ],
								blue = data[ i + 2 ];

							red = Math.floor(( color.r * red ) / 255 );
							green = Math.floor(( color.g * green ) / 255 );
							blue = Math.floor(( color.b * blue ) / 255 );

							data[ i + 0 ] = red;
							data[ i + 1 ] = green;
							data[ i + 2 ] = blue;

						}

						return data;
					},
				},

				toRGB: function( hex ){
					if ( hex.indexOf("#") == 0 ){
						hex = hex.substring( 1 )
					}

					var color = {
						h: parseInt( hex , 16 ),
						r: 0,
						g: 0,
						b: 0,
					};

					color.r = ( color.h >> 16 ) & 255;
					color.g = ( color.h >> 8 ) & 255;
					color.b = color.h & 255;

					return color;
				},

				interpRGB: function( rgb ){

					while( rgb.indexOf(" ") > -1 ){
						rgb = rgb.replace(" " , "");
					}

					rgb = rgb.substring( rgb.indexOf("(") + 1 , rgb.indexOf(")"));
					rgb = rgb.split(",");

					var color = {
						r: rgb[0],
						g: rgb[1],
						b: rgb[2],
					};
					
					return color;
				},

				output: function(){
					draw.context.clearRect( 0 , 0 , draw.width , draw.height );
					draw.context.putImageData( draw.data , 0 , 0 );

					image.colorize.currentColor = image.getAttribute("color");
					image.src = draw.canvas.toDataURL();

					draw.canvas.parentNode.removeChild( draw.canvas );
				}
			}

			draw.init();

		}
	}
}

window.addEventListener( "load" , colorizer.start );