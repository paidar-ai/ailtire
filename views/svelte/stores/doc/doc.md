Notes: 9/24/2025

I should have a base store for all models in the architecture and give the developer the ability to override if it desired. This will give the front end developer the ability to create their own store to store indidivudal objects or lists of objectes if desired.

I need to have the ability to dynamically create const exported lists that the WebUI can use to present things to the user. Like the list of actors, models, packages, etc... Anytime the actors is required it should get it from the globally accessible exported writable variable. That way any update to the list or inidividual object will automatically be reflected in the user interface.

So the baseStore is critical to be used and then if the architect wants to create their owne they just inherit from the store.

The store should have the following exposed methods and exposed writable variables.

Exposed writable variables.

* Actor.list - List of Actors of the system
* Actor.selected - Selected actor for the user session.
* Actor.nodes - For TreeViews
* Actor.schema - For the UI Forms.


Exposed methods
Big Question is if all of the components should use the Store Interface instead of calling the api class. I think the store should be the entry point. if that is the case then the store can be updated which keeps the UI consistent.

Actor.list()
Actor.get(id)
Actor.select(id);
Actor.search(q,p,s)
Actor.update(obj, data);
Actor.remove(obj)
Actor.addTo(obj, assocName, assocObj);
Actor.removeFrom(obj, assocName, assocObj);
Actor.call(path, body)
Actor.getSchema()

Actor would be replaced be the name of the Class being used.
