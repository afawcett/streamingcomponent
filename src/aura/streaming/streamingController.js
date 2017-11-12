({
    doInit: function(component, event, helper) {
        var action = component.get("c.getSessionId");
        action.setCallback(this, function(response) {
        
            // Configure CometD for this component
            var sessionId = response.getReturnValue();
            var cometd = new window.org.cometd.CometD();
            cometd.configure({
                url: window.location.protocol + '//' + window.location.hostname + '/cometd/41.0/',
                requestHeaders: { Authorization: 'OAuth ' + sessionId},
                appendMessageTypeToURL : false
            });
            cometd.websocketEnabled = false;
            component.set('v.cometd', cometd);

            // Connect to 
            cometd.handshake($A.getCallback(function(status) {
                if (status.successful) {
                    var eventName = component.get("v.channel");
                    cometd.subscribe(eventName, $A.getCallback(function(message) {
                            var messageEvent = component.getEvent("onMessage");
	                        if(messageEvent!=null) {
                                messageEvent.setParam("payload", message.data.payload);
                                messageEvent.fire();                            
	                        }
                        }
                    ));
                } else {
                    // TODO: Throw an event / set error property here?
                    console.log('streaming component: ' + status);
                }
            }));

        });
        $A.enqueueAction(action);
    },
    handleDestroy : function (component, event, helper) {
        // Ensure this component disconnects from the server
		var cometd = component.get("v.cometd");
        cometd.disconnect(function(disconnectReply) 
			{ 
                if(disconnectReply.successful) {
                    console.log('streaming component: Success disconnect')
                } else {
                    console.log('streaming component: Failed disconnect')                    
                }
            });
    }
})