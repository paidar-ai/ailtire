Ok I have a BaseForm, BaseList, BaseCard that all class definitions can use or have an override by writting their own.

Normally I would create inheritance to handle this. But svelte does not have the concept. I also would like the Base components to be used if none are defined for the individual class in the architecture.

So I need to figure out through a factory of some sort to use the write Form Dynamically. 

For example when I have an object that has several associations and I want to see the details of a specific object I should get the object name and look if that component exists if it doesn't then I need to call the Base components.
