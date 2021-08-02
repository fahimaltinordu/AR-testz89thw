//get&watch location (onload)
window.onload = () => {
    if( navigator.geolocation ) {
            const watchId = navigator.geolocation.watchPosition( success, fail );
    }
    else {
        alert("Sorry, your browser does not support geolocation services.");
    }

    function success (position) {
        //lat-long info for bottom
        document.getElementById('currentlocation').innerHTML=`latitude: ${position.coords.latitude.toFixed(6)} || longitude: ${position.coords.longitude.toFixed(6)}`;
        
        // let radius = position.coords.accuracy;
        // let mymap = L.map('mapid').setView([position.coords.latitude, position.coords.longitude], 16);

        //leaflet.js part
        var mymap = L.map('mapid', {
            center: [position.coords.latitude, position.coords.longitude],
            zoom: 16
        });
        mymap.locate({setView: true, watch: true});

        var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap)
        .bindPopup('you are around here')
        .openPopup();
        var circle = L.circle([position.coords.latitude, position.coords.longitude], { 
            color: '#3388ff', 
            radius: 50.0 }).addTo(mymap);
        
        

        
        function onLocationFound(e) {
            var lat = (e.latlng.lat);
            var lng = (e.latlng.lng);
            var newLatLng = new L.LatLng(lat, lng);
            marker.setLatLng(newLatLng); 
            circle.setLatLng(newLatLng); 
        }
        mymap.on('locationfound', onLocationFound);
        
        const titleURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
        const attribution = '© OpenStreetMap | © Mapbox';
        const tiles = L.tileLayer(titleURL, {
            attribution, 
            id: 'mapbox/streets-v11', 
            zoomOffset: -1, 
            maxZoom: 17, 
            minZoom: 1, 
            tileSize: 512, 
            accessToken: 'pk.eyJ1IjoiZmFoaW1hbHRpbm9yZHUiLCJhIjoiY2tycnl0NGljMzN6ODJ2cGVzNzg5eWZ2bSJ9.iEZejnMqCLmdIcCkOJcvxg'
        });
        tiles.addTo(mymap);
        
    }
    
    function fail (error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
            document.getElementById('currentlocation').innerHTML=`User denied Geolocation`;
                break;
            case error.POSITION_UNAVAILABLE:
            document.getElementById('currentlocation').innerHTML=`Unable to get your location`;
                break;
            case error.TIMEOUT:
            document.getElementById('currentlocation').innerHTML=`Runtime error`;
                break;
            case error.UNKNOWN_ERROR:
            document.getElementById('currentlocation').innerHTML=`Unknown error`;
                break;
        }
    }

}
