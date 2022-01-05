// setup map and map icon
var map = L.map('map',{ zoomControl: false }).setView([51.5, -0.09], 16);
var mapIcon = L.icon({
    iconUrl: 'images/icon-location.svg',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
})
var marker = L.marker(map.getCenter(), {icon: mapIcon}).addTo(map)

// submit button
var submitBtn = $("#submit-btn");

submitBtn.on("click", searchIp);

// search for the IP address if value is not empty callGealocationApi
function searchIp() {
    var ipInput = $("#ip-input").val();

    if (ipInput == '') {
        alert("Please input an IP address.");
    } else {
        console.log("IP: " + ipInput);
        callGeoLocationApi(ipInput);
    }
}

function callGeoLocationApi(ip) {
    _ipgeolocation.setFields("country_name, city, zipcode, latitude, longitude, time_zone, isp");
    _ipgeolocation.setIPAddress(ip);
    _ipgeolocation.getGeolocation(handleResponse, "8096dac342e24b4cb0b23ea5e778c9f1");
}

// function to handle the response from IP Geolocation API.
// "response" is a JSON object returned from IP Geolocation API.
function handleResponse(response) {
    console.log(response);
    if (response.ip == null) {
        $(".input-container").addClass("invalid");
        alert("Please enter a valid IP adress.");
    } else {
        // if IP address is valid, update the map and display the results
        $(".input-container").removeClass("invalid");
        updateMap(response.latitude, response.longitude);
        displayResult(
            response.ip,
            response.country_name, 
            response.city, response.zipcode, 
            response.time_zone, 
            response.isp);
    }
}

function updateMap(latitude, longitude) {
    // map pan to new view and change marker position 
    // according to latitude and longitude
    map.panTo(new L.LatLng(latitude, longitude));
    marker.setLatLng(new L.LatLng(latitude, longitude)); 
}

function displayResult(hostname, country_name, city, zipcode, time_zone, isp) {
    $("#result-ip").text(hostname);
    $("#result-location").text(country_name + ", " + city + " " + zipcode);
    $("#result-timezone").text(time_zone.name);
    $("#result-isp").text(isp);
}

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2hudG1teSIsImEiOiJja3h0d3k5ODE1cDcyMnJreWNqem1heHhpIn0.mualiYtqNC59WZIcgiDR3Q'
}).addTo(map);

