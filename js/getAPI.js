var origin1 = "";
var destination1 = "";
const startInput = document.getElementById("quoteStartLocation");
const endInput = document.getElementById("quoteEndLocation");
const errorEl = document.getElementById("error");
const responseEl = document.getElementById("responses");
const distanceEl = document.getElementById("distance");
const timeEl = document.getElementById("time");
const costEl = document.getElementById("cost");
function getQuote() {
  responseEl.style.display = "none"
  errorEl.innerText = '';
  var orginRes = startInput.value;
  var destinationRes = endInput.value;
  // console.log('check 1 ' + JSON.stringify(orginRes) + JSON.stringify(destinationRes) + orginRes + destinationRes);
  if (orginRes !== undefined && destinationRes !== undefined) {
    // console.log(document.getElementById("scales").checked)
    if (document.getElementById("scales").checked) {
      // console.log(document.getElementById("quoteStartLocation").value);
      origin1 = orginRes.formattedAddress;
      destination1 = destinationRes.formattedAddress;
      // console.log(origin1 + ', ' + destination1);
      // console.log(JSON.stringify(document.getElementById("quoteStartLocation").value.addressComponents));
      // console.log(document.getElementById("quoteStartLocation").value.addressComponents[0].types);
      let inOregon = 0;
      for (i = 0; i < orginRes.addressComponents.length; i++) {
        if (orginRes.addressComponents[i].types[0] == "administrative_area_level_1") {
          if (orginRes.addressComponents[i].longText == "Oregon") {
            // console.log('Orgin in Oregon');
            inOregon++;
          } else {
            console.log('Orgin not in Oregon');
          }
        }
      }
      for (i = 0; i < destinationRes.addressComponents.length; i++) {
        if (destinationRes.addressComponents[i].types[0] == "administrative_area_level_1") {
          if (destinationRes.addressComponents[i].longText == "Oregon") {
            // console.log('Destination in Oregon');
            inOregon++;
          } else {
            console.log('Destination not in Oregon');
          }
        }
      }
      
      if (inOregon == 2) {
        initMap();
      } else {
        console.log('address not in Oregon');
        errorEl.innerText = 'Please enter addresses that are within Oregon.';
      }
    } else {
      console.log('Oregon requirement not met');
      errorEl.innerText = 'Please confirm addresses are within Oregon.';
    }
  } else {
    console.log('no input' + JSON.stringify(orginRes) + JSON.stringify(destinationRes));
    errorEl.innerText = 'Please fill both address feilds.';
  }
}
function initMap() {
  const bounds = new google.maps.LatLngBounds();
  const markersArray = [];
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.53, lng: 9.4 },
    zoom: 10,
    disableDefaultUI: true,
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

    //calculate cost
    const truckType = document.getElementById("truck-selector").value;
    var truckCost = 0;
    var truckTime = 0;
    switch (truckType) {
      case '1':
        truckCost = 11300;
        truckTime = 180;
        break;
      case '2':
        truckCost = 11900;
        truckTime = 270;
        break;
      case '3':
        truckCost = 14800;
        truckTime = 360;
        break;
      case '4':
        truckCost = 17800;
        truckTime = 540;
        break;
    }
    let timeMinutes = response.rows[0].elements[0].duration.value / 60 + truckTime;
    timeEl.innerText = Math.floor(timeMinutes / 60) + ' hours ' + Math.floor(Math.ceil((timeMinutes % 60) / 15) * 15) + ' mins';
    distanceEl.innerText = response.rows[0].elements[0].distance.text;
    console.log('truckcost $' + (truckCost / 100).toLocaleString('en-US'));
    console.log('timecost $' + ((150 * (truckTime + response.rows[0].elements[0].duration.value / 60)) / 100).toLocaleString('en-US'));
    console.log('distancecost $' + ((0.8 * response.rows[0].elements[0].distance.value * 0.06213712) / 100).toLocaleString('en-US'));
    let cost = Math.floor(Math.ceil((10000 + truckCost + (150 * (truckTime + response.rows[0].elements[0].duration.value / 60)) + (0.8 * response.rows[0].elements[0].distance.value * 0.06213712)) / 500) * 500);
    console.log('total $' + (cost / 100).toLocaleString('en-US'));
    costEl.innerText = '$' + (cost / 100).toLocaleString('en-US');
    responseEl.style.display = "block";

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