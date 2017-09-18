({
    handleMessage : function(component, event, helper) {
        component.set("v.lastMessagePayload", JSON.stringify(event.getParam("payload")));
    }
})