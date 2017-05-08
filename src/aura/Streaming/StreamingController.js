({
    handleError: function(component, error, helper) {
        console.log(error.getParams().description);
    },
    handleMessage: function(component, message, helper) {
        var payload = message.getParams().payload;
        var compEvent = component.getEvent("messageReceived");
        compEvent.setParams({"payload" : payload });
        compEvent.fire();
    }    
})