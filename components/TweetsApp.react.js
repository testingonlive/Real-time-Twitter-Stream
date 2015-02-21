/** @jsx React.DOM */

var React = require( 'react' );
var Tweets = require( './Tweets.react.js' );
var Loader = require( './Loader.react.js' );
var NotificationBar = require( './NotificationBar.react.js' );

// Export the TweetApp component
module.exports = TweetsApp = React.createClass({
    
    // Method to add a tweet to our timeline
    addTweet: function( tweet ){
        
        // Get current application state
        var updated = this.state.tweets;
        
        // Increment the unread count
        var count = this.state.count + 1;
        
        // increment the skip count
        var skip = this.state.skip + 1;
        
        // Add tweet to the beginning of the tweets array
        updated.unshift( tweet );
        
        // Set application state
        this.setState( { tweets: updated, count: count, skip: skip } );
    },
    
    // Method to get JSON from the server by page
    getPage: function( page ){
        
        // Setup our ajax request
        var request = new XMLHttpRequest()
            self = this;
        
        request.open( 'GET', 'page/' + page + '/' + this.state.skip, true );
        
        request.onload = function(){
            
            // If everything is cool
            if ( request.status >= 200 && request.status < 400 ){
                
                // Load our next page
                self.loadPagedTweets( JSON.parse( request.responseText ) );
            } else {
                
                // Set application state (Not paging, paging complete)
                self.setState( { paging: false, done: true } );
            }
        };
        
        // Fire
        request.send();
        
    },
    
    // Method to show the unread tweets
    showNewTweets: function(){
        
        // Get currrent application state
        var updated = this.state.tweets;
        
        // Mark our tweets active
        udated.forEach(function( tweet ){
            tweet.active = true;
        });
        
        // Set application state (active tweets + reset unread count)
        this.setState( { tweets: updated, count: 0 } );
    },
    
    // Method to load tweets fetched from the server
    loadPagedTweets: function( tweets ){
        
        // so meta lol
        var self = this;
        
        // If we still have tweets...
        if ( tweet.length > 0 ){
            
            // Get current application state
            var updated = this.state.tweets;
            
            // Push them onto the end of the current tweets array
            tweets.forEach(function( tweet ){
                updated.push( tweet );
            });
            
            // This app is so fast, I actually use a timeout for dramatic effect
            // Otherwise you'd never see out super sexy loader svg
            setTimeout(function(){
                
                // Set application state (Not paging, add tweet)
                self.setState( { tweets: uploaded, paging: false } );
            }, 1000);
            
        } else {
            
            // Set application state (Not paging, paging complete)
            this.setState( { done: true, paging: false } );
        }
    },
    
    // Method to check if more tweets should be loaded, by scroll positon
    checkWindowScroll: function(){
        
        // Get scroll pos & window data
        var h = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );
        var s = document.body.scrollTop;
        var scrolled = ( h + s ) > document.body.offsetHeight;
        
        // If scrolled enough, not currently paging and note complete...
        if( scrolled && !this.state.paging && !this.state.done ){
            
            // Set application state (Paging, Increment page)
            this.setState( { paging: true, page: this.state.page + 1 } );
            
            // Get the next page of tweets from the server
            this.getPage( this.state.page );
            
        }
    },
    
    // Set the initial component state
    getInitialState: function( props ){
        
        props = props || this.props;
        
        // Set initial application using props
        return {
            tweets: props.tweets,
            count: 0,
            page: 0,
            paging: 0,
            skip: 0,
            done: false           
        };
    },
    
    componentWillReceiveProps: function( newProps, oldProps ){
        this.setState( this.getInitialState( newProps ) );
    },
    
    // Called directly after component rendering, only on client
    componentDidMount: function(){
        
        // Preserve self reference
        var self = this;
        
        // Initialize socker.io
        var socket = io.connect();
        
        // On tweet event emission...
        socket.on( 'tweet', function( data ){
            
            // Add a tweet to our queue
            self.addTweet( data );
        });
        
        // Attach scroll event too window for infinity paging
        window.addEventListener( 'scroll', this.checkWindowScroll );
    
    },
    
    // Render the component
    render: function(){
        
        return (
            <div className="tweets-app">
                <Tweets tweets={this.state.tweets} />
                <Loader paging={this.state.paging} />
                <NotificationBar count={this.state.count} onShowNewTweets={this.showNewTweets} />
            </div>        
        )
    }
    
     
});























































