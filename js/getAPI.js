var origin1 = "";
var destination1 = "";
function getQuote() {
  origin1 = document.getElementById("quoteStartLocation").value.formattedAddress;
  destination1 = document.getElementById("quoteEndLocation").value.formattedAddress;
  console.log(origin1 + ', ' + destination1);
  initMap();
}
function initMap() {
  const bounds = new google.maps.LatLngBounds();
  const markersArray = [];
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.53, lng: 9.4 },
    zoom: 10,
  });
  // initialize services
  const geocoder = new google.maps.Geocoder();
  const service = new google.maps.DistanceMatrixService();
  // build request
  const request = {
    origins: [origin1],
    destinations: [destination1],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
    avoidHighways: false,
    avoidTolls: false,
  };

  // put request on page
  // document.getElementById("request").innerText = JSON.stringify(
  //   request,
  //   null,
  //   2,
  // );
  // get distance matrix response
  service.getDistanceMatrix(request).then((response) => {
    // put response
    // document.getElementById("response").innerText = JSON.stringify(
    //   response,
    //   null,
    //   2,
    // );

    // show on map
    console.log(response.rows[0].elements[0].distance);
    console.log(response.rows[0].elements[0].duration);
    const originList = response.originAddresses;
    const destinationList = response.destinationAddresses;

    deleteMarkers(markersArray);

    const showGeocodedAddressOnMap = (asDestination) => {
      const handler = ({ results }) => {
        map.fitBounds(bounds.extend(results[0].geometry.location));
        markersArray.push(
          new google.maps.Marker({
            map,
            position: results[0].geometry.location,
            label: asDestination ? "To" : "From",
          }),
        );
      };
      return handler;
    };

    for (let i = 0; i < originList.length; i++) {
      const results = response.rows[i].elements;

      geocoder
        .geocode({ address: originList[i] })
        .then(showGeocodedAddressOnMap(false));

      for (let j = 0; j < results.length; j++) {
        geocoder
          .geocode({ address: destinationList[j] })
          .then(showGeocodedAddressOnMap(true));
      }
    }
  });
}

function deleteMarkers(markersArray) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }

  markersArray = [];
}