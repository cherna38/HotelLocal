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

const priceLowToHigh = document.querySelector("#priceLow");
const priceHighToLow = document.querySelector("#priceHigh");

const priceEightHundred = document.querySelector("#priceEight");
const priceSixHundred = document.querySelector("#priceSix");
const priceFourHundred = document.querySelector("#priceFour");
const priceTwoHundred = document.querySelector("#priceTwo");

const clearFilterButton = document.querySelector("#clearFilter");

//Making universal input variable
var inputCity = '';

var rateIn = 0;
var parkFilter = false;
var wifiFilter = false;
var rateFilter = false;
var priceFilter = false;
var lowestPrice = false;
var highestPrice = false;

var noPricing = false;

//Given user's searchbar input, if city is valid, call hotelLoop
function pickCity() {
	inputCity = searchInput.value.toLowerCase();
	//If input city is Palo Alto:
	if (inputCity == "palo alto") {;
		noPricing = false;
		hotelLoop(paRef);
	} else if (inputCity == "san luis obispo") {
		//If San Luis Obispo:
		noPricing = false;
		hotelLoop(sloRef);
	} else if (inputCity == "santa monica") {
		//If Santa Monica: 
		noPricing = true;
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
	
	if (priceFilter) {
		hotelQuery = hotelQuery.where('priceSummer', '<=', priceIn).orderBy('priceSummer', 'desc');
	}
	
	if (lowestPrice) {
		hotelQuery = hotelQuery.orderBy('priceSummer');
	}
	
	if (highestPrice) {
		hotelQuery = hotelQuery.orderBy('priceSummer', 'desc');
	}
	
	hotelQuery.get().then(function(hotelSnap) {
		hotelSnap.docs.forEach(function(hotelDoc) {
			hotelPrint(hotelDoc);
		})
	}).catch(function(error) {
		console.log("Can't get each hotel snapshot");
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
	
	if (!noPricing) {
		searchOutput.innerText += "\tSummer Pricing: $" + currentHotel.priceSummer;
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

priceLowToHigh.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	if (inputCity == 'santa monica') {
		window.alert(inputCity + " doesn't have prices to sort");
	} else {
		lowestPrice = true;
		highestPrice = false;
		pickCity();
	}
})

priceHighToLow.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	if (inputCity == 'santa monica') {
		window.alert(inputCity + " doesn't have prices to sort");
	} else {
		lowestPrice = false;
		highestPrice = true;
		pickCity();
	}
})

priceEightHundred.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	if (inputCity == 'santa monica') {
		window.alert(inputCity + " doesn't have prices to sort");
	} else {
		priceFilter = true;
		priceIn = 800;
		pickCity();
	}
})
priceSixHundred.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	if (inputCity == 'santa monica') {
		window.alert(inputCity + " doesn't have prices to sort");
	} else {
		priceFilter = true;
		priceIn = 600;
		pickCity();
	}
})
priceFourHundred.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	if (inputCity == 'santa monica') {
		window.alert(inputCity + " doesn't have prices to sort");
	} else {
		priceFilter = true;
		priceIn = 400;
		pickCity();
	}
})
priceTwoHundred.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	if (inputCity == 'santa monica') {
		window.alert(inputCity + " doesn't have prices to sort");
	} else {
		priceFilter = true;
		priceIn = 200;
		pickCity();
	}
})

//Clear all filtering options
clearFilterButton.addEventListener("click", function() {
	parkFilter = false;
	wifiFilter = false;
	rateFilter = false;
	priceFilter = false;
	lowestPrice = false;
	highestPrice = false;
	rateIn = 0;
	pickCity();
})