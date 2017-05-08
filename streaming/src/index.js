import QueryString from 'query-string';
import LCC from 'lightning-container';
import JSForce from 'jsforce';

// Obtain the channel from the URL param
let channel = "";
const queryParams = QueryString.parse(location.search);
if (queryParams && queryParams.channel) {
    channel = decodeURIComponent(queryParams.channel).replace(/\+/g, ' ');
}

// Subscribe to the channel and echo messages to the containing LC
let sid = LCC.getRESTAPISessionKey();
let conn = new JSForce.Connection({accessToken: sid});
conn.streaming.topic(channel).subscribe(function(message) {
  LCC.sendMessage(message.payload);
});