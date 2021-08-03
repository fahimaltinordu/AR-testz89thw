// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);



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
        

          
        //leaflet.js map tracking
        var mymap = L.map('mapid', {
            center: [position.coords.latitude, position.coords.longitude],
            maxZoom: 18,
            minZoom: 18,
            zoom: 18,
            zoomControl: false
        });
        mymap.locate({setView: true, watch: true});


        var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);

        var circle = L.circle([position.coords.latitude, position.coords.longitude], { 
            color: '#3388ff', 
            radius: 20.0 }).addTo(mymap);
        
        
        function onLocationFound(e) {
            var lat = (e.latlng.lat);
            var lng = (e.latlng.lng);
            var newLatLng = new L.LatLng(lat, lng);
            marker.setLatLng(newLatLng); 
            circle.setLatLng(newLatLng); 
        }
        mymap.on('locationfound', onLocationFound);

        //MAPBOX TILE
        // const titleURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
        // const attribution = '© OpenStreetMap | © Mapbox';
        // const tiles = L.tileLayer(titleURL, {
        //     attribution, 
        //     id: 'mapbox/streets-v11', 
        //     zoomOffset: -1, 
        //     maxZoom: 17, 
        //     minZoom: 1, 
        //     tileSize: 512, 
        //     accessToken: 'pk.eyJ1IjoiZmFoaW1hbHRpbm9yZHUiLCJhIjoiY2tycnl0NGljMzN6ODJ2cGVzNzg5eWZ2bSJ9.iEZejnMqCLmdIcCkOJcvxg',
        // });
        // tiles.addTo(mymap);

        //OPENSTREETMAP TILE
        const titleURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const attribution = '© OpenStreetMap';
        const tiles = L.tileLayer(titleURL, {
                attribution,

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

//leaflet.js add coin icons to map