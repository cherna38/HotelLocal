// Initialize Firebase


/* Primary code references for search bar (so far):
 * 
 * Get started with Cloud Firestore:
 * https://firebase.google.com/docs/firestore/quickstart#initialize
 * Getting Started With Cloud Firestore on the Web - Firecasts:
 * https://www.youtube.com/watch?time_continue=256&v=2Vf1D-rUMwE
 * Get data with Cloud Firestore: 
 * https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_collection
 * Perform simple and compound queries in Cloud Firestore:
 * https://firebase.google.com/docs/firestore/query-data/queries
 * Cloud Firestore Quicktip — DocumentSnapshot vs. QuerySnapshot:
 * https://medium.com/@scarygami/cloud-firestore-quicktip-documentsnapshot-vs-querysnapshot-70aef6d57ab3
 * Firebase Firestore Tutorial #3 - Getting Documents:
 * https://www.youtube.com/watch?v=kmTECF0JZyQ
 *
 */

/*Informed by Chrome Console to place prior to calling Firestore functions
 (to avoid breaking app)*/
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

//Baseline cloud firestore references
const cityRef = firestore.collection('Cities');
const paRef = cityRef.doc('Palo Alto');
const sloRef = cityRef.doc('San Luis Obispo');
const smRef = cityRef.doc('Santa Monica');

//Id accesses for interacting with database queries
const searchButton = document.querySelector("#searchButton");
const searchInput = document.querySelector("#search");
const searchOutput = document.querySelector("#results");

const parkButton = document.querySelector("#parkFilter");
const wifiButton = document.querySelector("#wifiFilter");
//const rateAscButton = document.querySelector("#ratingLow");
//const rateDesButton = document.querySelector("#ratingHigh");
const rateOneButton = document.querySelector("#ratingOne");
const rateTwoButton = document.querySelector("#ratingTwo");
const rateThreeButton = document.querySelector("#ratingThree");
const rateFourButton = document.querySelector("#ratingFour");
const clearFilterButton = document.querySelector("#clearFilter");

//Making universal input variable
var inputCity = '';
var rateIn = 0;
var parkFilter = false;
var wifiFilter = false;
var rateFilter = false;

//Given user's searchbar input, if city is valid, call hotelLoop
function pickCity() {
	inputCity = searchInput.value.toLowerCase();
	//If input city is Palo Alto:
	if (inputCity == "palo alto") {;
		hotelLoop(paRef);
	} else if (inputCity == "san luis obispo") {
		//If San Luis Obispo:
		hotelLoop(sloRef);
	} else if (inputCity == "santa monica") {
		//If Santa Monica: 
		hotelLoop(smRef);
	} else {
		//Otherwise, print unavailable message and display window
		searchOutput.innerText = "Information for hotels in " + inputCity + " unavailable\n";
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
}

//Go through each document in hotel collection (given a city document) to print
function hotelLoop(hotelCity) {
	//Clear output box upon each search request
	searchOutput.innerText = "";
	
	//refer to hotels collection in given city
	var hotelQuery = hotelCity.collection('Hotels');
	
	if (rateFilter) {
		hotelQuery = hotelQuery.where('Rating', '>=', rateIn).orderBy('Rating', 'desc');
	}
	
	hotelQuery.get().then(function(hotelSnap) {
		hotelSnap.docs.forEach(function(hotelDoc) {
			hotelPrint(hotelDoc);
		})
	}).catch(function(error) {
		console.log("Can't get each hotel snapshot u w u");
	})
}

//For a given hotel document, print it's attributes
function hotelPrint(hotel) {
	const currentHotel = hotel.data();
	
	if (parkFilter && (currentHotel.Parking != true)) {
		searchOutput.innerText += "";
		return;
	}
	
	if (wifiFilter && (currentHotel.Wifi != true)) {
		searchOutput.innerText += "";
		return;
	}
	
	//Start of each hotel output line with name and attributes
	searchOutput.innerText += hotel.id + " - \tParking: ";
	
	//Based on data in Firestore, print a readable output
	if (currentHotel.Parking == true) {
		searchOutput.innerText += "free,";
	} else {
		searchOutput.innerText += "none,";
	}
	
	searchOutput.innerText += "\tRating: " + currentHotel.Rating + ",\tWifi: ";
	
	if (currentHotel.Wifi == true) {
		searchOutput.innerText += "available\n";
	} else {
		searchOutput.innerText += "unavailable\n";
	}
}

//Search in case "SEARCH" button clicked directly
searchButton.addEventListener("click", function() {
	pickCity();
})

/*searchInput.addEventListener("keyup", function(event) {
	//Cancel default action
	event.preventDefault();
	if (event.keyCode === 13) {
		pickCity();
	}
})*/

//Parking Filtering
parkButton.addEventListener("click", function() {
	parkFilter = true;
	pickCity();
})

//Wifi Filtering
wifiButton.addEventListener("click", function() {
	wifiFilter = true;
	pickCity();
})

//Rating sorting functionality
//Rate 1 stars and up
rateOneButton.addEventListener("click", function() {
	rateFilter = true;
	rateIn = 1;
	pickCity();
})

//Rate 2 stars and up
rateTwoButton.addEventListener("click", function() {
	rateFilter = true;
	rateIn = 2;
	pickCity();
})

//Rate 3 stars and up
rateThreeButton.addEventListener("click", function() {
	rateFilter = true;
	rateIn = 3;
	pickCity();
})

//Rate 4 stars and up
rateFourButton.addEventListener("click", function() {
	rateFilter = true;
	rateIn = 4;
	pickCity();
})

//Clear all filtering options
clearFilterButton.addEventListener("click", function() {
	parkFilter = false;
	wifiFilter = false;
	rateFilter = false;
	rateIn = 0;
	pickCity();
})