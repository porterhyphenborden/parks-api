'use strict';

const apiKey = "STNk46QzUHGXnjPetWRRsSkRSSIiEXQVV2R38rdI";
const searchURL = 'https://developer.nps.gov/api/v1/parks';

//Display results
function displayResults(responseJson) {
    console.log(responseJson);
    //remove current results
    $('.results-list').empty();
    $('.error-message').css("display", "none");
    //Add html of results
    let numParks = $('#js-num-parks').val();
    for (let i = 0; i<responseJson.data.length && i<numParks; i++){
        $('.results-list').append(
            `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
            <p>${responseJson.data[i].description}</p>
            </li>`
          )};
    //Show results
    $('.results').css("display", "block");
}

//Build url
function buildURL (input) {
    //Break up search string into state codes
    const states = input.split(' ');
    //Add 'stateCode=' to each item in array
    const stateCodes = states.map(states => { return ('stateCode=' + states)
    });
    //Join into string
    const statesString = stateCodes.join('&');
    //return the endpoint url
    return searchURL + '?' + statesString + '&api_key=' + apiKey;
}

function checkResponse (responseJson) {
    if (responseJson.data.length != 0) {
        displayResults(responseJson);
    }
    else if (responseJson.data.length == 0) {
        $('.results').css("display", "none");
        $('.error-message').html(`Input error. Please format states as 2-letter codes with a space between each code.`).css("display", "block");
    }
}

//Make call
function getParks() {
    //Access user input
    const searchStates = $('#js-search-states').val();
    //Call function to build URL with user input as argument
    const url = buildURL(searchStates);
    console.log(url);
    /*const options = {
        headers: new Headers({
          "X-Api-Key": apiKey})
    };*/
    fetch(url)
        .then(response => response.json())
        .then(
            function(responseJson) {
              checkResponse(responseJson);
            }
        )
        .catch(err => {
            $('.results').css("display", "none");
            $('.error-message').html(`Something went wrong: ${err.message}`).css("display", "block");
        });
}

//Listen for user input
function watchForm() {
    $('form').submit(function(event) {
        event.preventDefault();
        //Call function to make API call
        getParks();
    })
}

$(watchForm);