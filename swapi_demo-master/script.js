function convertHeight(height){
	//convert height from centimeters to feet/inches
	var heightInInches = height*.394;
	var feet = Math.trunc(heightInInches/12);
	var inches = Math.trunc(heightInInches - (feet*12));
	height = feet + " feet, " + inches + " inches";
	return height;
}
function savePersonData(data){
	var person = data.results[0];
	myPersonData = {
		character: person.name,
		birthYear: person.birth_year,
		gender: person.gender,
		eyeColor: person.eye_color,
		hairColor: person.hair_color,
		skinColor: person.skin_color,
		weight: Number.parseFloat(person.mass*2.2046226218).toFixed(0),
		height: convertHeight(person.height),
		speciesURL: person.species,
		homeworldURL: person.homeworld,
		starshipURL: person.starships,
		vehicleURL: person.vehicles,
		filmURL: person.films
	};

	var homeworldURL = myPersonData.homeworldURL;
	// get the homeworld data for that person
	$.get(homeworldURL, function(planetData){
			//save the results
			savePlanetData(planetData);
	}, 'json');

	var speciesURL = myPersonData.speciesURL[0];
	// get the species data for that person
	$.get(speciesURL, function(speciesData){
		//save the results
		saveSpeciesData(speciesData);
	}, 'json');

	return myPersonData;
}

function savePlanetData(planetData){
	myPlanetData = {
		planetName: planetData.name,
		climate: planetData.climate,
		terrain: planetData.terrain,
		water: planetData.surface_water
	};
	return myPlanetData;
}
function saveSpeciesData(speciesData){
	mySpeciesData = {
		species: speciesData.name,
		class: speciesData.classification,
		avgHeight: convertHeight(speciesData.average_height),
		avgLifeSpan: speciesData.average_lifespan,
		language: speciesData.language,
		beingType: speciesData.designation
	}

	//build the story
	tellTheStory(myPersonData,myPlanetData,mySpeciesData);
	return mySpeciesData;
}

function tellTheStory(myPersonData, myPlanetData,mySpeciesData){

	var genderRef;
	// Determine when to use "he", "she" or just the character name
	if(myPersonData.gender == "male"){
		genderRef = "He";
	} else if(myPersonData.gender == "female"){
		genderRef = "She";
	} else {
		genderRef = myPersonData.character;
  	}
  
	// Determine if water on the planet is abundant, scarce, sufficient
	var waterAmt;
	if(myPlanetData.water < 20) {
		waterAmt = "scarce";
	} else if (myPlanetData.water > 50){
		waterAmt = "abundant";
	} else {
		waterAmt = "sufficent";
	}

	//build the story
		var story = `
		<span class="persondata">${myPersonData.character}</span> was born in <span>${myPersonData.birthYear}</span> and hails from <span>${myPlanetData.planetName}</span>, a planet where the climate is ${myPlanetData.climate}, the terrain is ${myPlanetData.terrain} and water sources are ${waterAmt}. ${genderRef} has <span>${myPersonData.eyeColor} eyes</span>, <span>${myPersonData.hairColor} hair</span>, and <span>${myPersonData.skinColor} skin</span>. ${genderRef} weighs <span>${myPersonData.weight} pounds</span>, and at <span>${myPersonData.height}</span>, he is shorter than the average <span>${mySpeciesData.species}</span>, a race of <span>${mySpeciesData.beingType} beings</span>, capable of higher intelligence, that commonly speak <span>${mySpeciesData.language}</span>.
	`
	$("#people").append("<p>" + story + "</p>");

	// adding mouseover functionality to the story --- not sure if looks good -- will make more dynamic after feedback(BB)
	$(".persondata").hover(function() {
		$(this).append('<img src="Lando.png" class = "tooltipPerson" style="position: absolute;"/>');
		$(".tooltipPerson").fadeIn(500);
	   }, 
	   	function(){
			$(".tooltipPerson").fadeOut(500);
	   }
	);
	return story;
}

$(document).ready(function(myPersonData) {
	//navbar functionality (BB)
	$(".navbar").click(function(e){
		e.preventDefault();
		$(this).append('<img src="xwing.png" class="sliderxwing">'); 
		$(this).mouseleave(function(){
			$(".sliderxwing").animate({
				// on mouseleave
				top: "-=65",
			}, function(){
				//animation complete -- maybe further functionality
				$(".sliderxwing").remove();
			});
		});
	});
	
	// (BB)

	// create variables for data retrieved to use later.
	var myPersonData = savePersonData;
	var myPlanetData = savePlanetData
	var mySpeciesData = saveSpeciesData;

	var baseUrl = 'https://swapi.co/api/';

	$('form').submit(function(e) {
		e.preventDefault();
		var searchUrl = baseUrl + 'people?search=';
		var params = $('input[name="search-params"]').val();
		//get the person data
		$.get(searchUrl + params, function(data) {
			//store the results
			savePersonData(data);
		}, 'json');

	});

	$(document).on('click', 'h3', function() {
		$(this).siblings().slideToggle();
	});

	$(document).on('click', '.person button', function() {
		var worldUrl = $(this).attr('data-link');
		var that = $(this);
		$.get(worldUrl, function(data) {
			var htmlStr = `
				<div class='world'>
					<h4>${data.name}</h4>
					<ul>
						<li>Climate: ${data.climate}</li>
						<li>Terrain: ${data.terrain}</li>
					</ul>
				</div>
			`;
			that.parent().append(htmlStr);
			that.remove();
		});
	});
});