# Streaming API Lightning Component
Lightning Component for the Salesforce Streaming API based on the examples [here](https://github.com/developerforce/LightningContainerExamples).

**IMPORTANT NOTE**: This is based on pre-release functionality from Salesforce.

<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

Documentation
-------------

This is work in progress, there is also a blog to follow with more details on the architecture. In short it leverages Lightning Container Component with a small NodeJS browser app to connect to the Streaming API and proxy messages back to the outer Lightning Component.

~~~~
<aura:component implements="flexipage:availableForAllPageTypes">
    <aura:attribute name="lastMessagePayload" type="String" access="private"/>
    <aura:handler name="messageReceived" event="c:StreamingEvent" action="{!c.handleMessage}"/>
    <c:streaming channel="/event/MyEvent__e"/>
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
