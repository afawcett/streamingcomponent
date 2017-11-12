# Streaming API Lightning Component
For more information see [here](https://andyinthecloud.com/2017/11/12/platform-events-and-lightning-components/).

<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

Documentation
-------------

This Lightning Component makes it easier to use the **[Streaming API](https://developer.salesforce.com/docs/atlas.en-us.api_streaming.meta/api_streaming/intro_stream.htm)** and thus **[Platform Events](https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/)** in your Lightning Components. Simply state the **channel**, e.g. /topic/mytopic or /event/MyEvent__e along with an **onMessage** handler.

~~~~
<aura:component implements="flexipage:availableForAllPageTypes">
    <aura:attribute name="lastMessagePayload" type="String" access="private"/>
    <c:streaming channel="/event/MyEvent__e" onMessage="{!c.handleMessage}"/>
    <div>{!v.lastMessagePayload}</div>
</aura:component>
~~~~

~~~~
({
	handleMessage : function(component, event, helper) {
	    component.set("v.lastMessagePayload", JSON.stringify(event.getParam("payload")));
	}
})
~~~~

**NOTE:** This component will work with PushTopic's as well.

![Demo](https://raw.githubusercontent.com/afawcett/streamingcomponent/master/images/StreamingAPIDemo.png)

Instructions
------------

1. Deploy via the button above (to Summer'17 org)
2. Create a Platform Event with an API name of MyEvent__e
3. Add a field with an API name of Message__c
4. Add the StreamingDemo component to a Lightning Page via Lightning App Builder
5. Issue the following code from Execute Annonymous
6. Observe the message in the Lightning page created above

~~~~
// Create event to publish
List<MyEvent__e> events = new List<MyEvent__e>();
events.add(new MyEvent__e(Message__c = 'My Message'));

// Call method to publish events
List<Database.SaveResult> results = EventBus.publish(events);

// Inspect publishing result for each event
for (Database.SaveResult sr : results) {
    if (sr.isSuccess()) {
        System.debug('Successfully published event.');
    } else {
        for(Database.Error err : sr.getErrors()) {
            System.debug('Error returned: ' +
                        err.getStatusCode() +
                        err.getMessage());
        }
    }       
}
~~~~
