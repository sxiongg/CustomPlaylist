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
        var searchResult = '<div class="col-md-8"><span class="trackInformation">Artist: ' + '<a href="' + resultObj.album. url + '" target="_blank">'+ resultObj.artist.name + '</a></span>';
        searchResult += '<span class="trackInformation"> <p>Track: ' + resultObj.name + '</p></span>';

        // Append the message and search results
        $('#resultsContainer').append(returnMessage);
        $('#resultsContainer').append(searchResult);

        // Create a button to add to the final playlist
        var addToPlaylistButton = '<button class="btn addToPlaylist">Add to Playlist</button>';
        $('#resultsContainer').append(addToPlaylistButton);

        // Add to playlist
        // Set the album name and image
        var albumName = "";
        var albumImg = "";
        var deleteButton = "<div class='btn col-md-1'><button class='btn btn-xs btn-danger deleteButton'>X</button></div>"

        if (resultObj.album != undefined) {
            // Album object found. Set the album and image
            albumName = '<span class="trackInformation"> Album Name: ' + resultObj.album.title + '</span></div>';
            albumImg = "<div class='col-md-2'><img src='" + resultObj.album.image[1]['#text'] + "'</img></div>";
        }
        else {
            // No album. Display a blank image placeholder
            albumName = "<span class='trackInformation'> Album not found.</span></div>";
            albumImg  = "<div class='col-md-2'> </div>";
        }


        $('.addToPlaylist').click(function(resultObj){
            // Move the object from the result to the final playlist
            // Appending the album name and image
            searchResult = albumImg + searchResult + albumName + deleteButton;
    
            // Removes prior search result
            $('#resultsContainer').children().detach();  
    
    
            // Get the number from the last item in the playlist div
            // If no itemCard divs exist, then start with #1
            // If itemCard divs exist, get the last div child's value then increment by 1
            var playlistNumber = getIndexForPlaylistItem();
            // console.log(playlistNumber);
    
            // Create the itemCard div to hold each individual track
            var itemCard = '<div class="row" id="itemCard' +  playlistNumber + '"></div>';
            // console.log("item card div" + itemCard);
    
            // Place the sequence number into the numberIndex div for each itemCard
            var numberIndex = '<div class="numberIndex col-md-1">' + playlistNumber + '</div>';
            // var resultDiv = '<div class="artistResultDiv">resultdiv</div>';
            
            // Append itemCard to the playlist div
            $('#playlistField').append(itemCard);
    
            // Append the number index to itemCard div
            $('#itemCard' + playlistNumber).append(numberIndex);
    
            // Append the artist and track result to itemCard div
            $('#itemCard'  + playlistNumber).append(searchResult);


            // Add delete button click event
            $('.deleteButton').unbind('click').click(deleteRow);
    
            // Clear out the artist and song textboxes
            $('#inputArtist').val('');
            $('#inputSong').val('');
            $('#inputArtist').focus();

            // Display share section
            $('.shareSection').css("display","inline");
        })

    };

    var noAPIResult = function (str) {
        // Display a message that the track searched for could not be found
        $('#resultsContainer').append("<h4>" + str + ". Please try another search.</h4>");
    };

    $("#submitButton").click(function () {
        // Sets the text entered by the user as the title of the playlist
        $("#playlist h3").text(inputPlaylist.value);
        // console.log(inputPlaylist);

        // Remove the text from the textbox
        $('#inputPlaylist').val('');
    })

    function deleteRow() {
        // Delete only if confirmed
        var strConfirm = confirm("Are you sure you want to delete this song from the playlist?");

        if (strConfirm) {
            // Delete the parent of the button's div (itemCard)
            // console.log($(this).parent().get(0));
        
            // Delete the button's parent div and slide up
            $(this).parent().parent().slideUp(1000);
            $(this).parent().parent().detach();


            // Check if the playlist div has children. If there are children then reorder the numbering.
            // console.log("immediate del. playlist contents: " , $('#playlist').contents());
            if ($('#playlist').children().get(0) != undefined) {
                
                // Reorder the numbers and itemCard IDs in the div
                renumberPlaylist();
                // console.log("playlist children",  $("#playlist div"));
                // console.log("playlist children",  $("#playlist").children());

            }
            else {
                // No itemCards. Hide the share button
                $('.shareSection').css("display","none");
            }
        }
        
    }

    function renumberPlaylist() {
        // Reorders the sequence and itemCard div IDs in the playlist div children
        var new_number = 1;
        $($("#playlist").children()).each(function() {
            // Reset the itemCard ID
            // console.log($(this).get(0).id);
            $(this).get(0).id = "itemCard" + new_number;

            // Reset the number in the div list
            // console.log($(this).children(0).get(0));
            $(this).children('.numberIndex').text(new_number);

            new_number++;
        });
    }


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

    // Sort the playlist div
    Sortable.create(playlist, {
        animation: 150,
        onEnd: function() {
            // When the sort is over, update the playlist sequence
            renumberPlaylist();
        }
    
    });

    $(function () {
             
            $('#sendEmailButton').click(function (){
    
                // variables that grab last id and make it a number
                var lastSong = $('#playlist div:last-child').children('.numberIndex').text();
                var lastSong = Number(lastSong);
                console.log(lastSong);
                var emailBodyInfoText = "";
    
                // loop through each number index and create var of song info
                for(i = 0; i < lastSong; i++) {
                    //grab text of spans (song information)
                    var grabItemCard = $('.trackInformation').parent().parent();
                    console.log(grabItemCard[i]);
    
                    var grabSpans = $(grabItemCard[i]).children().children('.trackInformation').text();
                    console.log(grabSpans);
    
                    // place info into variable and add new variable each iteration
                    emailBodyInfoText += (i + 1) + ')' + grabSpans + '%0A' + '%0A';
                    console.log(emailBodyInfoText);
                }
    
                // email function
                var email = $('#emailAddressInput').val();
    
                var playlistTitle = $('#playlist h3').text();
    
                var subject = 'Playlist: ' + playlistTitle;
    
                var emailBody = playlistTitle + '%0A' + '%0A' + emailBodyInfoText;
                document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
                $('#emailAddressInput').val('');
            })
      });

})



