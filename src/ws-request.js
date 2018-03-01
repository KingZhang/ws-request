import Observer from './observer';

const wsrequest = (function() {
    /**
     * Wrapper for websocket connection
     * @param {String} serverUrl websocket URL
     * @param {Object} options { "monitorField" : "response-field-to-monitor", "dataField": "actual-data-field"}
     */
    function WSRequest(serverUrl, options) {
        // the monitor field in response message, default is 'event'
        this.monitorField = options.monitorField || 'event';
        // the data field in response message, default is 'data'
        this.dataField = options.dataField || 'data';
        // create Observer
        this.observer = new Observer();

        this.serverUrl = serverUrl;
        this.ws = null;
    }

    WSRequest.prototype.open = function() {
        const self = this;

        if (this.ws !== null) {
            this.close();
        }

        /* global WebSocket */
        // open websocket conneciton
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = function() {
            self.observer.publish('OPEN');
        };

        this.ws.onclose = function() {
            self.observer.publish('CLOSE');
            self.ws = null;
        };

        this.ws.onmessage = function(msg) {
            const response = JSON.parse(msg.data);
            // publish to all observers
            self.observer.publish(response[self.monitorField], response[self.dataField]);
        };
    };

    WSRequest.prototype.send = function(msg) {
        this.ws.send(msg);
    };

    WSRequest.prototype.close = function() {
        this.ws.close();
    };

    WSRequest.prototype.isOpen = function() {
        return this.ws !== null && this.ws.readyState === 1;
    };

    // inherit Observer subscribe&unsubscribe function
    WSRequest.prototype.subscribe = this.observer.subscribe;
    WSRequest.prototype.unsubscribe = this.observer.unsubscribe;

    return WSRequest;
})();

export default wsrequest;
