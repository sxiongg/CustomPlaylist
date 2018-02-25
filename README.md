# Redwood Code Academy Group Project
Created by: Sia, Eric, & Drew

We proudly present our 'Create A Playlist' web app. 

This app uses the Last.FM music API which allows the user to search for a custom playlist.
Once the user commences a search, a result is displayed allowing the user to confirm it is the song they are looking for.
The user can then add the song to the playlist, edit the playlist, and email the playlist.


### Search for Your Song

Once the search button is clicked, an API call to Last.FM is executed to search for the artist and song entered. The URL is pieced together by the textbox entries. The spaces are removed and replaced with a plus (+) sign. If Last.FM finds both the artist and song, it returns a "track" object and appends the result to the playlist. If it does not find them, it returns an "error" object and displays a "track not found" message.


        $('#searchButton').click(function () {
        // if artist text box is blank then alert user to enter artist name
        // else if song text box is blank then alert user to enter song.
        // else proceeed

        // Main part of the API URL for Last.FM
        var _queryUrl = "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=*****&format=json&artist="

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

    };

    var noAPIResult = function (str) {
        // Display a message that the track searched for could not be found
        $('#resultsContainer').append("<h4>" + str + ". Please try another search.</h4>");
    };
    

### Add to Playlist

When the user clicks on the 'Add to Playlist' button, the artist, song, additional details (album name, album image) and a delete button get dislayed into the playlist. The search result gets removed from the page to refresh it for the next search. 

The click event is nested within the appendAPIResult function.

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
            $('#playlist').append(itemCard);
    
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
        
        
### Index Numbering for the Playlist

This function returns a number for the newly added record to the playlist. If there are not any song children divs within the playlist div, then it returns 1. If there are tracks, then it finds the last item, extracts the number from it, adds one and returns that value. 

        var playlistNumber = getIndexForPlaylistItem();
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


### Renumber the Playlist

This function renumbers all items in the playlist after either a rearrangement or deletion of a song. It goes through each of the playlist's children and renumbers each song's div ID and displays the correct numeric sequence for the record. For example, if there are three songs and song #2 is deleted, then the leftover #1 and #3 records are renumbered to #1 and #2.

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

### Delete a Record

When the user clicks the delete button for a record and confirms it, the entire div that the song is attached to is removed from the playlist. It then calls the renumberPlaylist function to renumber the remaining records. The 'Share' button gets hidden if there are no more songs in the playlist.

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
    
    
### Sort the Playlist

Sorting the playlist uses the Sortable JavaScript library at https://rubaxa.github.io/Sortable/.
Once the rows are rearranged, it calls the renumberPlaylist function to renumber the remaining records.

        // Sort the playlist div
        Sortable.create(playlist, {
        animation: 150,
        onEnd: function() {
            // When the sort is over, update the playlist sequence
            renumberPlaylist();
        }
    
        });
    
    
### Name the Playlist
Upon the submit button click, the playlist name is taken from the textbox and updates the h3 tag contained within the playlistField div. 

        $("#submitButton").click(function () {
                // Sets the text entered by the user as the title of the playlist
                $("#playlistField h3").text(inputPlaylist.value);
                // console.log(inputPlaylist);

                // Remove the text from the textbox
                $('#inputPlaylist').val('');
        })
    
    
### Share the Playlist

The user can email the playlist by clicking on the Share button. When the Send button is clicked, it iterates through each div in the playlist and extracts the song information from the div that contains the data. The email body is created from this information along with the playlist name. The playlist name is also used as the email's subject line. The email from the email textbox is used to email to.  

        $(function () {
        $('.sendButton').click(function (event) {
            console.log("Share: ", $('#shareForm').get(0));

        if ($('#shareForm').get(0) == undefined) {
           var sendForm = '<div id="shareForm" class="shareSection"><input id="emailAddressInput" class="form-control" type="text">     <input class="btn" id="sendEmailButton" type="submit" value="Send"></div>';
                $('#column-2').append(sendForm);
            }
            
    
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
    
                var playlistTitle = $('#playlistField h3').text();
    
                var subject = 'Playlist: ' + playlistTitle;
    
                var emailBody = playlistTitle + '%0A' + '%0A' + emailBodyInfoText;
                document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
                $('#emailAddressInput').val('');
            })
        });
      });
