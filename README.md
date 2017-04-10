# What
shared-db is an open source project that gives the user the freedom to choose where to store his data. This is a database that the software developer integrates into its product. shared-db is designed to be a light database engine such as [SQLite](https://www.sqlite.org/about.html) or [UnQLite](https://unqlite.org/). As such database it can be integrated into an application but it add support for concurrent access and synchronization. This open source project is designed to meet the needs of three types of actors.

### For end users
* He can choose to store his data wherever he wants. At home if he is an expert, or use specific services.
* In this choice, free and already available solutions are possible like online storage services: DropBox, GoogleDrive, Baidu, .... It is an important point: Having a free storage place that the user already knows will simplify the adoption of the technology by the end user.
* After his choice he is free to change his mind, if tomorrow he wishes to change the place where his data are stored.

### For developers
As all choices there are advantages and disadvantages: The important thing is to bring many more benefits than the inconvenience.
* advantages:
  * shared editing become easy: Hides most of the complexity of concurrent editing and synchonization, thanks to conflict free data type.
  * data are modified locally: Local modification of data allows massive gains in latency.
  * automatic offline mode: Offline mode can still make changes and synchronize on the next connection.
  * cost reduction: Data storage is no longer a cost this makes it possible to reduce costs and to envisage different business models than the exploitation of personal data.
  * competitive advantage: Giving customers the freedom to choose the location of their data is a way to stand out from the competition. 
* disadvantages:
  * products like Twitter or Facebook are not possible, but the techno allow different uses such as: messaging applications, document editing, or data management for IoT.
  * The use of conflict free data type implies knowing what one can do and not to do. However, it is possible to propose more intuitive APIs, or to facilitate their integration into existing libraries or frameworks (react, angular, ...).

### For cloud platform
Several cloud platforms offer to store personal data with different strategies. We can list different players ranging from integrated solution to the definition of standard and tools: owncloud, cozy, nextcloud, ...
Each actor wants to attract developers to have applications. The cloud platform can be seen as a third type of computer, after PCs and smartphones. To attract developers these platforms may have an interest in integrating shared-db:
* Any applications that use shared-db will be able to use these platforms to store their data.

# How
This database address 5 technical challenges:
* Concurrent editing, with automatic synchronization thanks to [CRDT](http://hal.upmc.fr/inria-00555588/document).
* Passive consensus for work on passive server like free storage services. you can find exemple [here](http://ieeexplore.ieee.org/document/7436648/).
* Distributed garbage collector technique.
* Make integration as simple as possible on common frameworks including React, Angular.
* Offline mode: you can find a description of this approach in this paper [Write Fast, Read in the Past](https://hal.inria.fr/hal-01158370/document).


# When
This project is just in the creation phase, if one part of the code is present on this repo there remains much to do
