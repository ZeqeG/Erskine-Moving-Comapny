var origin1 = "";
var destination1 = "";
function getQuote() {
  if (document.getElementById("quoteStartLocation").value !== undefined && document.getElementById("quoteEndLocation").value !== undefined) {
    console.log(document.getElementById("quoteStartLocation").value)
    origin1 = document.getElementById("quoteStartLocation").value.formattedAddress;
    destination1 = document.getElementById("quoteEndLocation").value.formattedAddress;
    console.log(origin1 + ', ' + destination1);
    initMap();
  } else {
    console.log('no input');
  }
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

    const truckType = document.getElementById("truck-selector").value;
    const distanceEl = document.getElementById("distance");
    const timeEl = document.getElementById("time");
    const costEl = document.getElementById("cost");
    var truckCost = 0;
    var truckTime = 0;
    console.log(truckType);
    switch (truckType) {
      case '1':
        truckCost = 11300;
        truckTime = 180;
        console.log('truck 1 ' + truckCost + ' ' + truckTime);
        break;
      case '2':
        truckCost = 11900;
        truckTime = 270;
        console.log('truck 2 ' + truckCost + ' ' + truckTime);
        break;
      case '3':
        truckCost = 14800;
        truckTime = 360;
        console.log('truck 3 ' + truckCost + ' ' + truckTime);
        break;
      case '4':
        truckCost = 17800;
        truckTime = 540;
        console.log('truck 4 ' + truckCost + ' ' + truckTime);
        break;
    }
    let timeMinutes = response.rows[0].elements[0].duration.value / 60 + truckTime
    timeEl.innerText = Math.floor(timeMinutes / 60) + 'h' + Math.floor(timeMinutes % 60) + 'm';
    distanceEl.innerText = response.rows[0].elements[0].distance.text;
    console.log('truckcost' + truckCost);
    console.log('timecost' + (150 * (truckTime + response.rows[0].elements[0].duration.value / 60)));
    console.log('distancecost' + (0.8 * response.rows[0].elements[0].distance.value * 0.06213712));
    let cost = Math.floor(Math.ceil((10000 + truckCost + (150 * (truckTime + response.rows[0].elements[0].duration.value / 60)) + (0.8 * response.rows[0].elements[0].distance.value * 0.06213712)) / 500) * 500);
    console.log(cost);
    costEl.innerText = '$' + (cost / 100).toLocaleString('en-US');

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