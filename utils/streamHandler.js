var Tweet = require( '../models/Tweet' );

module.exports = function( stream, io ){
    
    // When tweets get sent out way ...
    stream.on( 'data', function( data ){
        
        // Construct a new tweet object
        var tweet = {
            twid: data[ 'id' ],
            active: false,
            author: data[ 'user' ][ 'name' ],
            avatar: data[ 'user' ][ 'profile_image_url' ],
            body: data[ 'text' ],
            date: data[ 'created_at' ],
            screeenname: data[ 'user' ][ 'screen_name' ]
        };
        
        // Create a new model instance with our object
        var tweetEntry = new Tweet( tweet );
        
        // Save 'er to the database
        tweetEntry.save(function( err ){
            if ( !err ){
                // If everything os cool, socket.io emits the tweet.
                io.emit( 'tweet', tweet );
            }
        });
    });
};