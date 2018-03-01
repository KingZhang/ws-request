const observer = (() => {
    function Observer() {
        this.callbacks = {};
    }

    function notifyObservers(observers, eventObject) {
        for (let i = 0; i < observers.length; i++) {
            observers[i](eventObject);
            if (observers[i].once) {
                observers.shift(i, 1);
                i -= 1;
            }
        }
    }

    function fireEvent(observerName, responseData, callbacks) {
        // invoke scoped observers
        let observers = callbacks[observerName];
        if (observers && observers.length > 0) {
            notifyObservers(observers, responseData);
        }

        // invoke global observers
        observers = callbacks['*'];
        if (observers && observers.length > 0) {
            notifyObservers(observers, responseData);
        }
    }

    /**
     * Register an observer listener for a particular observer or all observers.
     *
     * @param {string} observerName -- the name of the observer or '*' for global observers
     * @param {function} callback -- the callback function invoked if publish.
     * @param {boolean} once -- if callback invoked once only
     */
    Observer.prototype.subscribe = function(observerName, callback, once) {
        if (once) {
            callback.once = true;
        }
        const { callbacks } = this;
        if (callbacks[observerName] === undefined) {
            callbacks[observerName] = [];
        }
        callbacks[observerName].unshift(callback);
    };

    /**
     * unsubscribe an observer and corresponse callback
     * @param {string} observerName -- observer name
     * @param {function} callback -- callback function instance
     */
    Observer.prototype.unsubscribe = function(observerName, callback) {
        const observers = this.callbacks[observerName];

        if (observers === undefined) {
            return;
        }

        for (let i = 0; i < observers.length; i++) {
            if (observers[i] === callback) {
                observers.splice(i, 1);
                return;
            }
        }
    };

    /**
     * publish function
     * @param {string} observerName -- observer name
     * @param {object} responseData -- servver response data, json object
     */
    Observer.prototype.publish = function(observerName, responseData) {
        fireEvent(observerName, responseData, this.callbacks);
    };

    return Observer;
})();

export default observer;
