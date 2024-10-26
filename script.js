let markers = []; // Store markers in memory

require(["esri/Map", "esri/views/SceneView", "esri/Graphic", "esri/widgets/Search"],
(Map, SceneView, Graphic, Search) => {
    const map = new Map({
        basemap: "satellite",
        ground: "world-elevation"
    });

    const view = new SceneView({
        scale: 50000000, // Initial zoom level
        container: "viewDiv",
        map: map
    });

    const searchWidget = new Search({ view: view });
    view.ui.add(searchWidget, { position: "top-right" });

    // Handle map click to add marker
    view.on("click", (event) => {
        const latitude = event.mapPoint.latitude;
        const longitude = event.mapPoint.longitude;

        // Show coordinates in input fields
        document.getElementById("latitudeInput").value = latitude.toFixed(5);
        document.getElementById("longitudeInput").value = longitude.toFixed(5);
    });

    // Function to get the user's current location
    document.getElementById("getCurrentLocation").onclick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // Fill the latitude and longitude inputs
                    document.getElementById("latitudeInput").value = latitude.toFixed(5);
                    document.getElementById("longitudeInput").value = longitude.toFixed(5);
                    view.goTo({ target: [longitude, latitude], zoom: 14 }); // Center the view to user's location
                },
                (error) => {
                    alert("Unable to retrieve location. Please enable location services.");
                    console.error(error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    document.getElementById("addMarkerButton").onclick = () => {
        const message = document.getElementById("messageInput").value.trim();
        const url = document.getElementById("urlInput").value.trim();
        const emoji = "📍"; // Pin marker emoji
    
        const latitude = parseFloat(document.getElementById("latitudeInput").value);
        const longitude = parseFloat(document.getElementById("longitudeInput").value);
    
        if (!isNaN(latitude) && !isNaN(longitude)) {
            const markerData = { lat: latitude, lon: longitude, message, url };
            console.log("Marker Data:", markerData); // Log marker data for debugging
            markers.push(markerData); // Store in memory
            addMarker(markerData, emoji); // Add pin to map

            //here implement the database firbase
           
        } else {
            alert("Please click on the map to set a valid location or get your current location.");
        }
    };
   
    // Function to add a marker with a pin icon or emoji
    function addMarker({ lat, lon, message, url }, icon) {
        const point = { type: "point", latitude: lat, longitude: lon };
        const markerSymbol = {
            type: "text", // Using text symbol to show emoji/icon
            text: icon,
            color: "red",
            font: { size: 20, weight: "bold" }
        };
        const popupTemplate = {
            title: message,
            content: `<a href="${url}" target="_blank">${url}</a>`
        };

        const pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
            popupTemplate: popupTemplate
        });

        view.graphics.add(pointGraphic);
    }

});