var orginRes = "";
var destinationRes = "";
var orginComponents = [];
var destinationComponents = [];
const calcMain = document.getElementById("calcMain");
const calcAlt = document.getElementById("calcAlt");
const startInput = document.getElementById("quoteStartLocation");
const endInput = document.getElementById("quoteEndLocation");
const distanceInput = document.getElementById("quoteNumber");
var errorEl = document.getElementById("error");
const responseEl = document.getElementById("responses");
const distanceEl = document.getElementById("distance");
const timeEl = document.getElementById("time");
const costEl = document.getElementById("cost");

var truckCost = 0;
var truckTime = 0;
function calcTruck(truckType) {
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
}
function calcCost(minutes, miles) {
  let totalMinutes = calcMinutes(minutes);
  return Math.floor(Math.ceil((10000 + truckCost + (150 * totalMinutes) + (0.8 * miles)) / 500) * 500);
}
function calcMinutes(minutes) {
  return minutes + truckTime;
}

function getQuote() {

  responseEl.style.display = "none"
  errorEl.innerText = '';
  orginRes = startInput.value;
  destinationRes = endInput.value;
  console.log(orginRes + ', ' + destinationRes);
  // console.log('check 1 ' + JSON.stringify(orginRes) + JSON.stringify(destinationRes) + orginRes + destinationRes);
  if (orginRes !== '' && destinationRes !== '') {
    // console.log(document.getElementById("quoteStartLocation").value);
    // console.log(orginRes + ', ' + destinationRes);
    // console.log(JSON.stringify(document.getElementById("quoteStartLocation").value.addressComponents));
    // console.log(document.getElementById("quoteStartLocation").value.addressComponents[0].types);
    let inOregon = 0;
    if (orginComponents.toString() !== '') {
      for (i = 0; i < orginComponents.length; i++) {
        if (orginComponents[i].types[0] == "administrative_area_level_1") {
          if (orginComponents[i].longText == "Oregon") {
            // console.log('Orgin in Oregon');
            inOregon++;
          } else {
            console.log('Orgin not in Oregon');
          }
        }
      }
    } else if (orginRes.toLowerCase().includes('or')) {
      inOregon++
    }

    if (destinationComponents.toString() !== '') {
      for (i = 0; i < destinationComponents.length; i++) {
        if (destinationComponents[i].types[0] == "administrative_area_level_1") {
          if (destinationComponents[i].longText == "Oregon") {
            // console.log('Destination in Oregon');
            inOregon++;
          } else {
            console.log('Destination not in Oregon');
          }
        }
      }
    } else if (orginRes.toLowerCase().includes('or')) {
      inOregon++
    }

    if (inOregon == 2) {
      initMap();
    } else {
      console.log('address not in Oregon');
      errorEl.innerText = 'Please enter addresses that are within Oregon.';
    }
  } else {
    console.log('no input' + JSON.stringify(orginRes) + JSON.stringify(destinationRes));
    errorEl.innerText = 'Please fill both address fields.';
  }


}
async function initMap() {
  await google.maps.importLibrary("maps");
  await google.maps.importLibrary("marker");
  const bounds = new google.maps.LatLngBounds();
  const markersArray = [];
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 55.53, lng: 9.4 },
    zoom: 10,
    disableDefaultUI: true,
    mapId: "1",
  });
  // initialize services
  const geocoder = new google.maps.Geocoder();
  const service = new google.maps.DistanceMatrixService();
  // build request
  const request = {
    origins: [orginRes],
    destinations: [destinationRes],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
    avoidHighways: false,
    avoidTolls: false,
  };

  // get distance matrix response
  service.getDistanceMatrix(request).then((response) => {
    //calculate cost
    // console.log(JSON.stringify(response));
    let truckType = document.getElementById("truck-selector").value;
    calcTruck(truckType);
    let timeMinutes = response.rows[0].elements[0].duration.value / 60;
    var totalMinutes = calcMinutes(timeMinutes);
    // console.log('truckcost $' + (truckCost / 100).toLocaleString('en-US'));
    // console.log('timecost $' + ((150 * (truckTime + response.rows[0].elements[0].duration.value / 60)) / 100).toLocaleString('en-US'));
    // console.log('distancecost $' + ((0.8 * response.rows[0].elements[0].distance.value * 0.06213712) / 100).toLocaleString('en-US'));
    let miles = response.rows[0].elements[0].distance.value * 0.06213712;
    let cost = calcCost(timeMinutes, miles);
    // console.log('total $' + (cost / 100).toLocaleString('en-US'));
    timeEl.innerText = Math.floor(totalMinutes / 60) + ' hours ' + Math.floor(Math.ceil((totalMinutes % 60) / 15) * 15) + ' mins';
    distanceEl.innerText = response.rows[0].elements[0].distance.text;
    costEl.innerText = '$' + (cost / 100).toLocaleString('en-US');
    responseEl.style.display = "flex";
    document.getElementById("responses").scrollIntoView();

    // show on map
    // console.log(response.rows[0].elements[0].distance);
    // console.log(response.rows[0].elements[0].duration);
    const originList = response.originAddresses;
    const destinationList = response.destinationAddresses;

    deleteMarkers(markersArray);
    const pinTo = new google.maps.marker.PinElement({
      glyphColor: "#ff8300",
      background: "#FFD514",
      borderColor: "#ff8300",
    });
    const pinFrom = new google.maps.marker.PinElement({
      // glyphColor: "#ff8300",
      // background: "#FFD514",
      // borderColor: "#ff8300",
    });
    const showGeocodedAddressOnMap = (asDestination) => {
      const handler = ({ results }) => {
        map.fitBounds(bounds.extend(results[0].geometry.location));
        markersArray.push(
          new google.maps.marker.AdvancedMarkerElement({
            map,
            position: results[0].geometry.location,
            content: asDestination ? pinTo.element : pinFrom.element,
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
  })
    .catch((err) => {
      console.log(err);
      calcMain.style.display = "none";
      calcAlt.style.display = "flex";
    });
}
function getQuoteAlt() {
  errorEl = document.getElementById("errorAlt");
  errorEl.innerText = '';
  if (document.getElementById('scales').checked == true) {
    // console.log(distanceInput.value);
    if (distanceInput.value == "" || distanceInput.value == null) {
      console.log('no distance');
      errorEl.innerText = "Please enter your move distance.";
    } else if (distanceInput.value == 0) {
      console.log('distance is 0');
      errorEl.innerText = "Please distance greater than 0.";
    } else {
      let truckType = document.getElementById("truck-selector-alt").value;
      calcTruck(truckType);
      let miles = distanceInput.value;
      let timeMinutes = (miles > 15) ? miles * 60 / 45 : miles * 60 / 30;
      var totalMinutes = calcMinutes(timeMinutes);
      let cost = calcCost(timeMinutes, miles);
      console.log('total $' + (cost / 100).toLocaleString('en-US'));
      timeEl.innerText = Math.floor(totalMinutes / 60) + ' hours ' + Math.floor(Math.ceil((totalMinutes % 60) / 15) * 15) + ' mins';
      distanceEl.innerText = miles + ' miles';
      costEl.innerText = '$' + (cost / 100).toLocaleString('en-US');
      responseEl.style.display = "block";
      defaultMap();
    }
  } else {
    console.log('address not in Oregon');
    errorEl.innerText = "Please confirm you're moving within Oregon.";
  }
}

function deleteMarkers(markersArray) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}

// new autocomplete code
var requestNumber = 0;
var requestTimer = 0;
async function autoFillInit(type) {
  var resultsID;
  var inputType;
  switch (type) {
    case 'orgin':
      resultsID = "resultsOrgin";
      inputType = startInput;
      orginComponents = [];
      hideAutoResults('destination');
      break;
    case 'destination':
      resultsID = "resultsDestination";
      inputType = endInput;
      destinationComponents = [];
      hideAutoResults('orgin');
      break;
  }
  const resultsElement = document.getElementById(resultsID);
  resultsElement.style.visibility = "visible";
  if (inputType.value == '' || inputType.value == null) {
    resultsElement.innerHTML = '';
    resultsElement.style.visibility = "hidden";
  } else {
    // @ts-ignore
    // Fetch autocomplete suggestions.
    let thisRequest = ++requestNumber;
    let thisTimer = ++requestTimer;
    // console.log(thisTimer + ', ' + requestTimer);
    async function getResponse() {
      // console.log(thisTimer + ', ' + requestTimer);
      if (thisTimer == requestTimer) {
        const { AutocompleteSessionToken, AutocompleteSuggestion } =
          await google.maps.importLibrary("places");
        // Add an initial request body.
        let request = {
          input: inputType.value,
          locationRestriction: {
            west: -124.6,
            north: 46.28,
            east: -116.43,
            south: 41.99,
          },
          language: "en-US",
          region: "us",
        };
        // Create a session token.
        const token = new AutocompleteSessionToken();

        // Add the token to the request.
        // @ts-ignore
        request.sessionToken = token;
        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request, {fields: 'places.formattedAddress,places.displayName.text'});
        if (thisRequest !== requestNumber) return;
        resultsElement.innerHTML = '';
        for (let suggestion of suggestions) {
          const placePrediction = suggestion.placePrediction;
          // Create a new list element.
          const listItem = document.createElement("div");
          listItem.classList.add("dropdown-item");
          listItem.appendChild(
            document.createTextNode(placePrediction.text.toString()),
          );
          let place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ["formattedAddress", "addressComponents"],
          });
          listItem.addEventListener('click', function (i) {
            // console.log(this.innerText);
            // console.log(place.addressComponents);
            // console.log(type)
            inputType.value = this.innerText;
            switch (type) {
              case 'orgin':
                orginComponents = place.addressComponents;
                break;
              case 'destination':
                destinationComponents = place.addressComponents;
                break;
            }
            hideAutoResults(type);
          });
          resultsElement.appendChild(listItem);
        }
        // const placeInfo = document.getElementById("prediction");

        // placeInfo.textContent =
        //   "First predicted place: " +
        //   place.displayName +
        //   ": " +
        //   place.formattedAddress;
        hideAutoResults(type)
      }
    }
    setTimeout(getResponse, 500);
  }
}
function hideAutoResults(type) {
  var resultsID;
  var inputType;
  switch (type) {
    case 'orgin':
      resultsID = "resultsOrgin";
      inputType = startInput;
      break;
    case 'destination':
      resultsID = "resultsDestination";
      inputType = endInput;
      break;
  }
  const resultsElement = document.getElementById(resultsID);
  if (!(document.activeElement == inputType)) {
    resultsElement.innerHTML = '';
    resultsElement.style.visibility = "hidden";
  }
}
startInput.addEventListener('input', function () {
  autoFillInit('orgin');
});
endInput.addEventListener('input', function () {
  autoFillInit('destination');
});
window.addEventListener('mousedown', function () {
  setTimeout(() => {
    hideAutoResults('orgin');
    hideAutoResults('destination');
  }, 100);
});
onload = () => {
  defaultMap()
}
async function defaultMap() {
  await google.maps.importLibrary("maps");
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.93116, lng: -120.60676 }, //43.93116° N, 120.60676° W
    zoom: 6,
    disableDefaultUI: true,
  });
}