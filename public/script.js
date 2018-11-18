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

//Making universal input variable
var inputCity = '';

//Go through each document in hotel collection (given a city document) to print
function hotelLoop(hotelList, park, wifi, rate, rateIn){
	//Clear output box upon each search request
	searchOutput.innerText = "";
	//refer to hotels collection in given city
	const hotelQuery = hotelList.collection('Hotels');
	
	if (rate) {
		//within hotels collection, call hotelPrint on each hotel document
		//based on rating >= rate stars input
		hotelQuery.where('Rating', '>=', rateIn).orderBy('Rating', 'desc').get().then(function(hotelSnap) {
			hotelSnap.docs.forEach(function(hotelDoc) {
				hotelPrint(hotelDoc, park, wifi, rate);
			})
		})
	}
	
	else {
		//within hotels collection, call hotelPrint on each hotel document
		hotelQuery.get().then(function(hotelSnap) {
			hotelSnap.docs.forEach(function(hotelDoc) {
				hotelPrint(hotelDoc, park, wifi, rate);
			})
		})
	}
	
	
}

//For a given hotel document, print it's attributes
function hotelPrint(hotel, park, wifi, rate) {
	const currentHotel = hotel.data();
	
	if (park && (currentHotel.Parking != true)) {
		searchOutput.innerText += "";
		return;
	}
	
	if (wifi && (currentHotel.Wifi != true)) {
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

//Linking up functions to actual search bar functionality
searchButton.addEventListener("click", function() {
	inputCity = searchInput.value;
	
	//Given user's searchbar input, if city is valid, call hotelLoop
	if (inputCity == "Palo Alto") {;
		hotelLoop(paRef, 0, 0, 0, 0);
	} else if (inputCity == "San Luis Obispo") {
		hotelLoop(sloRef, 0, 0, 0, 0);
	} else if (inputCity == "Santa Monica") {
		hotelLoop(smRef, 0, 0, 0, 0);
	} else {
		//Otherwise, print unavailable message and display window
		searchOutput.innerText = "Information for hotels in " + inputCity + " unavailable\n";
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
})

parkButton.addEventListener("click", function() {
	inputCity = searchInput.value;
	const park = 1;
	//Given user's searchbar input, if city is valid, call hotelLoop
	if (inputCity == "Palo Alto") {;
		hotelLoop(paRef, park, 0, 0, 0);
	} else if (inputCity == "San Luis Obispo") {
		hotelLoop(sloRef, park, 0, 0, 0);
	} else if (inputCity == "Santa Monica") {
		hotelLoop(smRef, park, 0, 0, 0);
	} else {
		//Otherwise, print unavailable message and display window
		searchOutput.innerText = "Information for hotels in " + inputCity + " unavailable\n";
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
})

wifiButton.addEventListener("click", function() {
	inputCity = searchInput.value;
	const wifi = 1;
	//Given user's searchbar input, if city is valid, call hotelLoop
	if (inputCity == "Palo Alto") {;
		hotelLoop(paRef, 0, wifi, 0, 0);
	} else if (inputCity == "San Luis Obispo") {
		hotelLoop(sloRef, 0, wifi, 0, 0);
	} else if (inputCity == "Santa Monica") {
		hotelLoop(smRef, 0, wifi, 0, 0);
	} else {
		//Otherwise, print unavailable message and display window
		searchOutput.innerText = "Information for hotels in " + inputCity + " unavailable\n";
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
})

rateOneButton.addEventListener("click", function() {
	inputCity = searchInput.value;
	const rateOne = 1;
	//Given user's searchbar input, if city is valid, call hotelLoop
	if (inputCity == "Palo Alto") {;
		hotelLoop(paRef, 0, 0, 1, rateOne);
	} else if (inputCity == "San Luis Obispo") {
		hotelLoop(sloRef, 0, 0, 1, rateOne);
	} else if (inputCity == "Santa Monica") {
		hotelLoop(smRef, 0, 0, 1, rateOne);
	} else {
		//Otherwise, print unavailable message and display window
		searchOutput.innerText = "Information for hotels in " + inputCity + " unavailable\n";
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
})

rateTwoButton.addEventListener("click", function() {
	inputCity = searchInput.value;
	const rateTwo = 2;
	//Given user's searchbar input, if city is valid, call hotelLoop
	if (inputCity == "Palo Alto") {;
		hotelLoop(paRef, 0, 0, 1, rateTwo);
	} else if (inputCity == "San Luis Obispo") {
		hotelLoop(sloRef, 0, 0, 1, rateTwo);
	} else if (inputCity == "Santa Monica") {
		hotelLoop(smRef, 0, 0, 1, rateTwo);
	} else {
		//Otherwise, print unavailable message and display window
		searchOutput.innerText = "Information for hotels in " + inputCity + " unavailable\n";
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
})

rateThreeButton.addEventListener("click", function() {
	inputCity = searchInput.value;
	const rateThree = 3;
	//Given user's searchbar input, if city is valid, call hotelLoop
	if (inputCity == "Palo Alto") {;
		hotelLoop(paRef, 0, 0, 1, rateThree);
	} else if (inputCity == "San Luis Obispo") {
		hotelLoop(sloRef, 0, 0, 1, rateThree);
	} else if (inputCity == "Santa Monica") {
		hotelLoop(smRef, 0, 0, 1, rateThree);
	} else {
		//Otherwise, print unavailable message and display window
		searchOutput.innerText = "Information for hotels in " + inputCity + " unavailable\n";
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
})

rateFourButton.addEventListener("click", function() {
	inputCity = searchInput.value;
	const rateFour = 4;
	//Given user's searchbar input, if city is valid, call hotelLoop
	if (inputCity == "Palo Alto") {;
		hotelLoop(paRef, 0, 0, 1, rateFour);
	} else if (inputCity == "San Luis Obispo") {
		hotelLoop(sloRef, 0, 0, 1, rateFour);
	} else if (inputCity == "Santa Monica") {
		hotelLoop(smRef, 0, 0, 1, rateFour);
	} else {
		//Otherwise, print unavailable message and display window
		searchOutput.innerText = "Information for hotels in " + inputCity + " unavailable\n";
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
})