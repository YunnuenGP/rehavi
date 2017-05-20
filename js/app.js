(function app(){
	"use strict";
	var windowObj = $(window);
	var lazy = (function(){
		var loading;

		function scrollLoad(jElement, callback){	
			if(!loading && !jElement.attr('loaded')){
				loading = true;
				jElement.attr('loaded', true);
				jElement.fadeOut(100, function(){
					if(callback){
						callback();
						jElement.css('visibility','visible').fadeIn('slow', function(){
							loading = false;
						});					
					}else{	
						jElement.load(jElement.attr('id')+'.html', function(){					
							jElement.css('visibility','visible').fadeIn('slow');
							loading = false;	
						});
					}			
				});
			}
		}

		function clickLoad(jElement, callback){	
			if(!jElement.attr('loaded')){
				jElement.attr('loaded', true);
					if(callback){
						callback();
						jElement.css('visibility','visible');					
					}else{	
						jElement.load(jElement.attr('id')+'.html', function(){					
							jElement.css('visibility','visible');	
						});
					}
			}
		}

		return {scrollLoad:scrollLoad, clickLoad: clickLoad};
	})();
	var googleMap = (function(mapElementName){
		var callback = 'gMapsCallback'
		var url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCTSJ4nigiCUcS_KdUEvTfegUWC2EPbP_Q&amp;sensor=false&callback=' + callback;
		var loadGoogleMaps = function(){
				var script_tag = document.createElement('script');
				script_tag.setAttribute("type","text/javascript");
				script_tag.setAttribute("src", url);
				(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
			}
		var initializeMap = function(){
				var mapOptions = {
					center: new google.maps.LatLng(20.6842081 , -103.364863),
					zoom: 18,
					minZoom:14,
					maxZoom:21,
					scrollwheel: false,
					navigationControl: false,
					mapTypeControl: false,
					draggable: false,
					clickableIcons: false,
					disableDoubleClickZoom: false,
					keyboardShortcuts: false,
					streetViewControl: false,			
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				var map = new google.maps.Map(document.getElementById(mapElementName),
					mapOptions);

				var contentString = '<div id="content">'+
							'<div id="siteNotice">'+
							'</div>'+
							'<h3 id="firstHeading" class="firstHeading">Clínica REHAVI</h3>'+
							'<div id="bodyContent">'+
							'<p>Av. Manuel Acuña 1312 <br/>Santa Teresita, Guadalajara, Jalisco, México.</p>'+
							'</div>'+
							'</div>';
				var infowindow = new google.maps.InfoWindow({
							content: contentString,
							maxWidth: 200
						});



				var myLatlng = new google.maps.LatLng(20.6842081 , -103.364863);
				var marker = new google.maps.Marker({
					map: map,
					animation: google.maps.Animation.DROP,
					position: myLatlng
				});

				marker.addListener('animation_changed', function() {
					infowindow.open(map,marker);
				});

				marker.addListener('click', function() {
					infowindow.open(map,marker);
				});

				// To add the marker to the map, call setMap();
				marker.setMap(map);
			}

		return {load: loadGoogleMaps, init: initializeMap};
	})('map_canvas');

	window.gMapsCallback = function(){
		windowObj.trigger('gMapsLoaded');
	}

	$(document).foundation();
	$(document).ready(function(){	
		//Getting id names from sections on main-content.
		var sections = $('.main-content').children();

		//Binding our callback to our map init.
		windowObj.bind('gMapsLoaded', googleMap.init);

		//Adding lazy loading for html content.
		windowObj.scroll(function(){

			sections.each(function(){
				var section = $(this);

				if(windowObj.scrollTop() + windowObj.height() >= section.offset().top){
					if(section.attr('id').indexOf('encuentranos') === -1){					
						lazy.scrollLoad(section);								
					}else{					
						lazy.scrollLoad(section, googleMap.load, true);
					}
				}
				
			});	

		});

		

		//Adding scroll animation to all "#" on URL (for menu purpose).
		$('a[href^="#"]').on('click', function(event) {
			var sectionName = this.getAttribute('href');
			
			//Loop through our divs on main-content and loads them in order until we reach the one we are looking for.
			sections.each(function(index){
				var currentElement = $(this);
				var currentName = currentElement.attr('id');
					if(sectionName.indexOf(currentName) === -1 && sectionName.indexOf('logo') === -1){
						if(currentName.indexOf('encuentranos') > -1){
							lazy.clickLoad(currentElement, googleMap.load, true);
						} else {
							lazy.clickLoad(currentElement);
						}
					}else{return false;}				
			});	

			/* Workaround : It seems that setTimeOut blocks the animation for the bottom arrow that leads the page to the top. 
							We need setTimeOut to wait for the async calls on the divs above, so it will move after all divs loads*/						
			(sectionName.indexOf('logo') > -1) ? moveToElement() : setTimeout(moveToElement, 1);		
			
			function moveToElement(){		
				var target = $(sectionName);
				if( target.length ) {
					$("html, body").animate({ scrollTop: target.offset().top }, 1000);
				}
				return false;
			}

			return false;

		});

		//Handling the "send a message" feature for Contact form.
		// $('#sendBtn').click(function(e){
		// 	e.preventDefault();
			
		// 	var name = $('#nameInput');
		// 	var email = $('#emailInput');
		// 	var message = $('#messageInput');
			
		// 	if (validateInputForm(name) && validateInputForm(email) && validateInputForm(message)){
		// 		alert('Enviando email de parte de ' + name.val());
		// 		name.val('');
		// 		email.val('');
		// 		message.val('');
		// 	}		
		// });

		//Contact form validations on blur
		$('#nameInput, #emailInput, #messageInput').on('blur', (function(){
			validateInputForm($(this));
		})); 
	});

	$(window).load(function() {
		$('#slider').nivoSlider({ 
				controlNav: false, 
				effect:'sliceUpDown',
				pauseTime: 5000, 
				animSpeed: 1500,
				pauseOnHover:false,
				captionOpacity:1
			}
		);		
	});

	function validateInputForm(item){
		var value = item.val();
		!value ? item.addClass('error') : item.removeClass('error');
		return value;
	}

})();