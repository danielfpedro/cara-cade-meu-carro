$(function(){
	var markerA, markerB;
	var markers_limit = 2;
	var markers = 0;
	var line_positions = [];
	
	$('#map-canvas').gmap3({
		map: {
			address: "Brasil",
			options: {
				zoom: 4
			},
			events: {
				click: function(map, b){
					var positions = [b.latLng.lat(), b.latLng.lng()];
					if (markers < markers_limit) {
						setMarker(positions);
						if (line_positions.length == 2) {
							setLine();
							writeDistance(getDistance(line_positions[0], line_positions[1]));
						}
					}
				},
			},
			callback: function(){
				/*setMarker("Barra mansa");
				setMarker("Bahia");*/
			},
		},

	});
	
	function setMarker(latLng) {
		$('#map-canvas').gmap3({
			marker: {
				latLng: latLng,
				options: {
					draggable: true
				},
				events: {
					dragend: function(a, b) {
						$('#map-canvas').gmap3({
							get: {
								name: 'marker',
								all: true,
								callback: function(markers){
									line_positions = []; // Reseta para colocar os novos
									$.each(markers, function(index, value){
										line_positions.push([value.position.lat(), value.position.lng()]);
									});
									setLine();
									writeDistance(getDistance(line_positions[0], line_positions[1]));
									console.log((getDistance(line_positions[0], line_positions[1]) / 1000) + " KM");
								}
							}
						});
					}
				}
			},
			
		});	
		markers++;
	}
	function rad(x) {
		return x * Math.PI / 180;
	};
	
	function getDistance(p1, p2) {
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = rad(p2[0] - p1[0]);
		var dLong = rad(p2[1] - p1[1]);
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(rad(p1[0])) * Math.cos(rad(p2[0])) *
		Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return d; // returns the distance in meter
	};
	function getDistadsnce (origin, destination) {
		return false;
		$('#map-canvas').gmap3({
			getdistance:{
				options:{ 
					origins: origin, 
					destinations: destination,
					travelMode: google.maps.TravelMode.DRIVING
				},
				callback: function(results, status){
					console.log(results);
				}
			},
		});
	}
	function writeDistance(distance){
		var distance = distance / 1000;
		distance = distance.toFixed(1);
		$('#distancia').html("<h3>"+distance+" KM</h3>");
	}
	function setLine() {
		$('#map-canvas').gmap3({
			clear: {
				name: ['polyline']
			},
			polyline:{
				options:{
					strokeColor: "#FF0000",
					strokeOpacity: 1.0,
					strokeWeight: 2,
					path: line_positions
				}
			} 
		});
	}
});