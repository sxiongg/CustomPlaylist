$('document').ready(function () {
    //select search button.
    //When button is clicked, api call will run
    //piece together url
    //take in value from both inputs
    //replace spaces with + signs
    //insert into final url
    //will return track object, 
    //will create item in lower box with details
    //append it to results
    //each result has an add button
    //when add button is clicked, it will create a new item with more details and add to playlist div    


    $('#searchButton').click(function () {
        // if artist text box is blank then alert user to enter artist name
        // else if song text box is blank then alert user to enter song.
        // else proceeed

        // Main part of the API URL for Last.FM
        var _queryUrl = "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=4d87768072faff4ea2d4a189cfbe7115&format=json&artist="

        if (inputArtist.value.length == 0) {
            // No text in the artist textbox. Send alert.
            alert("Enter Artist");
        } else if (inputSong.value.length == 0) {
            // No text in the song textbox. Send alert.
            alert("Enter song");
        }
        else {
            // Find the artist and track entered through Last.FM

            // Get the artist name from the textbox
            var artist = $("#inputArtist").val();

            // Remove all spaces and replace with a plus sign for the API URL
            artist = artist.replace(/ /g, "+");
            // console.log(artist);

            // Get the song title from the textbox
            var song = $("#inputSong").val();
            // console.log(song);

            // Remove all spaces and replace with a plus sign for the API URL
            song = song.replace(/ /g, "+");
            // console.log(song);

            // Appending the &track= parameter along with the song title for the API URL
            var trackName = "&track=" + song;

            // Concatenate artist and track to the final URL to send to Last.FM
            _queryUrl += artist + trackName;
            console.log(_queryUrl);

            // API call to Last.FM

            // Request
            $.ajax({
                url: _queryUrl,
                method: "Get"
            })
                // Response
                .done(function (response) {
                    console.log(response);

                    // A successful pull returns a "track" object. 
                    // An unsuccessful pull returns an "error" object.
                    if (response.track != undefined) {
                        // Search result found. Append result.
                        removePreviousResult();
                        appendAPIResult(response.track);
                    }
                    else {
                        // Track not found.
                        removePreviousResult();
                        noAPIResult(response.message);
                    }

                });
        }

    });

    var removePreviousResult = function () {
        // Removes a result in the resultsContainer from a prior search
        $('#resultsContainer').children().detach();
    };


    var appendAPIResult = function (resultObj) {
        // Append track object to the resultsContainer div
        // console.log(resultObj.name);

        var returnMessage = "<h4>Is this the song you are looking for?</h4>";
        var searchResult = '<p>Artist: ' + resultObj.artist.name + '</p>';
        searchResult += '<p>Track Name: ' + resultObj.name + '</p>';

        // Append the message and search results
        $('#resultsContainer').append(returnMessage);
        $('#resultsContainer').append(searchResult);

        // Create a button to add to the final playlist
        var addToPlaylistButton = '<button class="addToPlaylist">Add to Playlist</button>';
        $('#resultsContainer').append(addToPlaylistButton);

        // Add to playlist
        // Set the album name and image
        var albumName = "";
        var albumImg = "";

        if (resultObj.album != undefined) {
            // Album object found. Set the album and image
            albumName = '<p>Album Name: ' + resultObj.album.title + '</p>';
            albumImg = "<img src='" + resultObj.album.image[1]['#text'] + "' />";
        }
        else {
            // No album. Display a blank image placeholder
            albumImg  = "<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZfyC7CGyu3POigSstHSw2zhXvjyrBHmxxJAZQSIlYs85mx3j8' height='64' width='64' />";
        }


        $('.addToPlaylist').click(function(resultObj){
            // Move the object from the result to the final playlist
            // Appending the album name and image
            searchResult += albumName + albumImg;
    
            // Removes prior search result
            $('#resultsContainer').children().detach();  
    
    
            // Get the number from the last item in the playlist div
            // If no itemCard divs exist, then start with #1
            // If itemCard divs exist, get the last div child's value then increment by 1
            var playlistNumber = getIndexForPlaylistItem();
            // console.log(playlistNumber);
    
            // Create the itemCard div to hold each individual track
            var itemCard = '<div id="itemCard' +  playlistNumber + '"></div>';
            // console.log("item card div" + itemCard);
    
            // Place the sequence number into the numberIndex div for each itemCard
            var numberIndex = '<div class="numberIndex">' + playlistNumber + '</div>';
            // var resultDiv = '<div class="artistResultDiv">resultdiv</div>';
            
            // Append itemCard to the playlist div
            $('#playlist').append(itemCard);
    
            // Append the number index to itemCard div
            $('#itemCard' + playlistNumber).append(numberIndex);
    
            // Append the artist and track result to itemCard div
            $('#itemCard'  + playlistNumber).append(searchResult);
    
            
        })

    };

    var noAPIResult = function (str) {
        // Display a message that the track searched for could not be found
        $('#resultsContainer').append("<h4>" + str + "</h4>");
    };

    $("#submitButton").click(function () {
        // Sets the text entered by the user as the title of the playlist
        $("#playlistField h3").text(inputPlaylist.value);
        // console.log(inputPlaylist);
    })


    function getIndexForPlaylistItem() {
        // Get the number from the last record of divs in the playlist div
        // If no itemCard divs exist, then return #1
        // If itemCard divs exist, get the last value then increment by 1
        if ($('#playlist').children().get(0) == undefined) {
            // No itemCard divs exist. Return 1.
            return 1;
        }
        else {
            // itemCard divs exist
            // For playlist div, get the last itemCard child and get the number stored in numberIndex
            // Increment it by one and return it
            var latestNum = $('#playlist div:last-child').children('.numberIndex').text();
            // console.log("last child: ", $('#playlist div:last-child').children('.numberIndex').text());
            return Number(latestNum) + 1;
        }
    
    };


})



