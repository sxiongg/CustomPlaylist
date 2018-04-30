# Redwood Code Academy Group Project
Created by: Sia, Eric, & Drew

<iframe src="https://drive.google.com/file/d/1xvyGOjNQT8EM_uv3eCmQxTEm-l1lM_rP/preview" width="640" height="480"></iframe>

We proudly present our 'Create A Playlist' web app. 

This app uses the Last.FM music API which allows the user to search for a custom playlist.
Once the user commences a search, a result is displayed allowing the user to confirm it is the song they are looking for.
The user can then add the song to the playlist, edit the playlist, and email the playlist.


### Search for Your Song

Once the search button is clicked, an API call to Last.FM is executed to search for the artist and song entered. The URL is pieced together by the textbox entries. The spaces are removed and replaced with a plus (+) sign. If Last.FM finds both the artist and song, it returns a "track" object and appends the result to the playlist. If it does not find them, it returns an "error" object and displays a "track not found" message.


        $('#searchButton').click(function () {
        var _queryUrl = "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=4d87768072faff4ea2d4a189cfbe7115&format=json&artist="

        //Alerts if search fields are empty
        if (inputArtist.value.length == 0) {
            alert("Enter Artist");
        } else if (inputSong.value.length == 0) {
            alert("Enter song");
        }
        else {
            // Grab text from artist input
            var artist = $("#inputArtist").val();
            // Remove all spaces and replace with a plus sign for the API URL
            artist = artist.replace(/ /g, "+");
            // Get text from song input
            var song = $("#inputSong").val();
            // Remove all spaces and replace with a plus sign for the API URL
            song = song.replace(/ /g, "+");
            // Appending the &track= parameter & the song title for the API URL
            var trackName = "&track=" + song;
            // Concat artist and track to the final URL to send to Last.FM
            _queryUrl += artist + trackName;
            console.log(_queryUrl);

            // API call to Last.FM
            $.ajax({
                url: _queryUrl,
                method: "Get"
            })
                .done(function (response) {
                    console.log(response);
                    // A successful pull returns a "track" object. 
                    // An unsuccessful pull returns an "error" object.
                    if (response.track != undefined) {
                        removePreviousResult();
                        appendAPIResult(response.track);
                    }
                    else {
                        removePreviousResult();
                        noAPIResult(response.message);
                    }
                });
        }
    });

    // Removes result in the resultsContainer from prior search
    var removePreviousResult = function () {
        $('#resultsContainer').children().detach();
    };

    // Append track object to the resultsContainer div
    var appendAPIResult = function (resultObj) {
        var returnMessage = "<h4>Is this the song you are looking for?</h4>";
        var searchResult = '<div class="col-md-8"> <span class="trackInformation"> <p>Artist: ' + '<a href="' + resultObj.album.url + '" target="_blank">' + resultObj.artist.name + '</a> </p> </span>';
        searchResult += '<span class="trackInformation"> <p>Track: ' + resultObj.name + '</p></span>';

        var albumImgResult = "<div class='col-md-2'><img src='" + resultObj.album.image[1]['#text'] + "'</img></div>";
        // Append the message and search results
        $('#resultsContainer').append(returnMessage);
        $('#resultsContainer').append(albumImgResult);
        $('#resultsContainer').append(searchResult);

        // Create a button to add to playlist
        var addToPlaylistButton = '<button class="btn addToPlaylist pull-right">Add <span class="glyphicon glyphicon-plus"></span> </button>';
        $('#resultsContainer').append(addToPlaylistButton);

        // Set the album name and image
        var albumName = "";
        var albumImg = "";
        var deleteButton = "<div class='btn col-md-1'><button class='btn btn-xs deleteButton'> <span class='glyphicon glyphicon-remove'></span> </button></div>"

        // Album object found. Set the album and image
        if (resultObj.album != undefined) {
            albumName = '<span class="trackInformation"> Album Name: ' + resultObj.album.title + '</span></div>';
            albumImg = "<div class='col-md-2'><img src='" + resultObj.album.image[1]['#text'] + "'</img></div>";
        }
        else {
            // No album. Display a blank image placeholder
            albumName = "<span class='trackInformation'> Album not found.</span></div>";
            albumImg = "<div class='col-md-2'> </div>";
        }

### Add to Playlist

When the user clicks on the 'Add to Playlist' button, the artist, song, additional details (album name, album image) and a delete button get displayed into the playlist. The search result gets removed from the page to refresh it for the next search. 

The click event is nested within the appendAPIResult function.

        $('.addToPlaylist').click(function (resultObj) {
            // Move the result to the final playlist
            searchResult = albumImg + searchResult + albumName;

            // Removes prior search result
            $('#resultsContainer').children().detach();

            // Get the number from the last item in the playlist div
            // If no itemCard divs exist, then start with #1, if itemCard divs exist, get last div child value & increment by 1
            var playlistNumber = getIndexForPlaylistItem();

            // Create the itemCard div to hold each individual track
            var itemCard = '<div class="row" id="itemCard' + playlistNumber + '"></div>';

            // Place the sequence number into the numberIndex div for each itemCard
            var numberIndex = '<div class="numberIndex col-md-1">' + playlistNumber + '</div>';

            // Append itemCard to the playlist div
            $('#playlist-custom').append(itemCard);
            $('#playlist-custom').css({
                'border': '1px solid black',
                'border-radius': '3px',
                'padding': '10px',
                'background-color': 'rgba(137, 136, 132, 0.5)'
            });

            // Display Send button
            if ($('#playlist-custom').children().get(0) != undefined) {
                $('#sendEmailButton').css({
                    'font-family': 'Play',
                    'margin-top': '10px',
                    'display': 'block'
                })
            }

            // Append the number index to itemCard div
            $('#itemCard' + playlistNumber).append(numberIndex);

            // Append the artist and track result to itemCard div
            $('#itemCard' + playlistNumber).append(searchResult);

            $('#itemCard' + playlistNumber).hover(
                function () {
                    $(this).append($(deleteButton));
                    $('.deleteButton').unbind('click').click(deleteRow);
                }, function () {
                    $(this).find('div:last').remove();
                }
            )
            // Clear out the artist and song textboxes
            $('#inputArtist').val('');
            $('#inputSong').val('');
            $('#inputArtist').focus();
        })
    };
        
        
### Index Numbering for the Playlist

This function returns a number for the newly added record to the playlist. If there are not any song children divs within the playlist div, then it returns 1. If there are tracks, then it finds the last item, extracts the number from it, adds one and returns that value. 

        var playlistNumber = getIndexForPlaylistItem();
        function getIndexForPlaylistItem() {
        // Get the number from the last record of divs in the playlist div
        // If no itemCard divs exist, then return #1
        // If itemCard divs exist, get the last value then increment by 1
        if ($('#playlist-custom').children().get(0) == undefined) {
            return 1;
        }
        else {
            // itemCard divs exist
            // For playlist div, get the last itemCard child and get the number stored in numberIndex
            // Increment it by one and return it
            var latestNum = $('#playlist-custom div:last-child').children('.numberIndex').text();
            return Number(latestNum) + 1;
        }
    
    };       


### Renumber the Playlist

This function renumbers all items in the playlist after either a rearrangement or deletion of a song. It goes through each of the playlist's children and renumbers each song's div ID and displays the correct numeric sequence for the record. For example, if there are three songs and song #2 is deleted, then the leftover #1 and #3 records are renumbered to #1 and #2.

        function renumberPlaylist() {
        // Reorders the sequence and itemCard div IDs in the playlist div children
        var new_number = 1;
        $($("#playlist-custom").children()).each(function () {
            // Reset the itemCard ID
            $(this).get(0).id = "itemCard" + new_number;

            // Reset the number in the div list
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
            // Delete the button's parent div and slide up
            $(this).parent().parent().slideUp(1000);
            $(this).parent().parent().detach();

            // Check if the playlist div has children. If there are children then reorder the numbering.
            if ($('#playlist-custom').children().get(0) != undefined) {

                // Reorder the numbers and itemCard IDs in the div
                renumberPlaylist();
            }
            else {
                $('#playlist-custom').css({
                    'border': '0px solid black'
                })
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
        $("#playlist h2").text(inputPlaylist.value);
        // Remove the text from the textbox
        $('#inputPlaylist').val('');
    })
    
    
### Share the Playlist

The user can email the playlist by clicking on the Share button. When the Send button is clicked, it iterates through each div in the playlist and extracts the song information from the div that contains the data. The email body is created from this information along with the playlist name.
    
            $('#sendEmailButton').click(function () {
            // Grab last id and make it a number
            var lastSong = $('#playlist-custom div:last-child').children('.numberIndex').text();
            var lastSong = Number(lastSong);
            console.log(lastSong);
            var emailBodyInfoText = "";

            // Loop through each number index and create var of song info
            for (i = 0; i < lastSong; i++) {
                //grab text of spans (song information)
                var grabItemCard = $('.trackInformation').parent().parent();
                console.log(grabItemCard[i]);
                var grabSpans = $(grabItemCard[i]).children().children('.trackInformation').text();
                // place info into variable and add new variable each iteration
                emailBodyInfoText += (i + 1) + ')' + grabSpans + '%0A' + '%0A';
                console.log(emailBodyInfoText);
            }
            // Email
            var email = "";
            var playlistTitle = $('#playlist h2').text();
            var subject = 'Playlist: ' + playlistTitle;
            var emailBody = playlistTitle + '%0A' + '%0A' + emailBodyInfoText;
            document.location = "mailto:" + email + "?subject=" + subject + "&body=" + emailBody;
            $('#emailAddressInput').val('');
        })
            })
        });
      });
