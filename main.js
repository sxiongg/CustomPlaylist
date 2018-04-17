$('document').ready(function () {
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

    // Display a message that the track searched for could not be found
    var noAPIResult = function (str) {
        $('#resultsContainer').append("<h4>" + str + ". Please try another search.</h4>");
    };

    $("#submitButton").click(function () {
        // Sets the text entered by the user as the title of the playlist
        $("#playlist h2").text(inputPlaylist.value);
        // Remove the text from the textbox
        $('#inputPlaylist').val('');
    })

    function deleteRow() {
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
    }

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

    // Sort the playlist div
    Sortable.create(playlist, {
        animation: 150,
        onEnd: function () {
            // When the sort is over, update the playlist sequence
            renumberPlaylist();
        }
    });

    $(function () {
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
    });

})



