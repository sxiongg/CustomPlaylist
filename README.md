Redwood Code Academy Group Project. (Sia, Eric, & Drew)

We proudly present our 'Create A Playlist' web app. 

This app uses the LastFM music API which allows the user to search for a custom playlist.
Once the user commences a search, a result is displayed allowing the user to confirm it is the song they are looking for.
The user can then add the song to the playlist, edit the playlist, and email the playlist.

**Search for Your Song**
Once the search button is clicked, there is an API call to Last.FM to search for the artist and song entered. The URL is pieced together by the textbox entries. The spaces are removed and replaced with a plus (+) sign. If Last.FM finds both the artist and song, it returns a "track" object and appends the result to the playlist. If it does not find them, it returns an "error" object and displays a "track not found" message.

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
