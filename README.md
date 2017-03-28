# what

shared-db is an open source project that gives the user the freedom to choose where to store his data. This is a database that the software developer integrates into its product. This open source project is designed to meet both end-user and developer needs. 

1. For the end-user
    - He remains master of his data. 
    - He can choose to store his data wherever he wants: 
        1. On a server: NAS, remote server, ...
        2. On  services: personal service like [Cozy](www.cozy.io/en/), or database service like CouchDB. 
        3. It will also be possible to store his data on a free storage service like Google Drive or Dropbox, with encrypted data. 
 
2. For the developer: 
    - This project allows to change his business model: data storage will no longer be a cost. This cost reduction makes it possible to imagine a business model different from that based on the exploitation of data. 
    - A software product that allows users to choose where to store their data has a competitive advantage over competitors. 
 
Different technical solutions are possible, thanks to initiatives such as the European project [SyncFree](https://syncfree.lip6.fr/), or passive consensus techniques. These choices do not allow to create products like Twitter or Facebook, but allow different uses such as: messaging applications, document editing, or data management for IoT. 


# how
This database address 5 technical challenges:
* Offline mode: you can find a description of this approach in this paper [Write Fast, Read in the Past](https://hal.inria.fr/hal-01158370/document)
* Concurrent editing, with automatic synchronization thanks to [CRDT](http://hal.upmc.fr/inria-00555588/document)
* Passive consensus for work on passive server like free storage services. you can find exemple [here](http://ieeexplore.ieee.org/document/7436648/)
* Garbage collector technique with multi processus
* Intuitive integration on common frameworks including React, Angular

# when
This project is just in the creation phase, if one part of the code is present on this repo there remains much to do
