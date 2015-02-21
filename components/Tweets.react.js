/** @jsx React.DOM */

var React = require( 'react' );
var Tweet = require( './Tweet.react.js' );

module.exports = Tweets = React.createClass({
    
    // Render our tweets
    render: function(){
        
        // Build list item of single tweet components using map
        var content = this.props.tweets.map( function( tweet ){
            return (
                <Tweet key={tweet.twid} tweet={tweet} />
            )
        });
        
        return (
            <ul className="tweets">{content}</ul>
        )
    }
});