protocol passive paxos with one storage service
// consensus :
//  - deux approches decrite dans visual group theory (si ca fonctionne)
//  - reprendre la presentation du site raft
//  - state machine input -> log append only


*******
Paxos
*******



First we describe the simplest form of paxos, which is static paxos. After we describe passive paxos we will be the paxos used in shared-db.

Static Paxos
============
The Goal is to describe Paxos for Dummies, we start from black box to white box description.

Black box: the big picture
-----------
.. figure:: _static/images/static_paxos_view_0.svg
   :width: 200pt

=> Paxos is like an append log. paxos produit an append log of value.
- in effect each value is added to the end of a write-only log that gets longer and longer.
- in fact there is a way to garbage collect from the front of the log, but surprisingly rarely used.

thinking of paxos as a way to make a durable log of messages is the right way to view the protocol 


Open the box: 
---------------

The protocol has two phases:

1 - prepare phase: the system prepare the acceptors to commit some action. several tries may be  required.
2 - decide phase: the system decide what value will be choosed. Sometimes the decision is that no value will be choosed. 


Fig2:
                    BOX P1                           BOX P2

value candidate              
------>          phase 1 prepare ---xxxx>xxx       
                                                                      
value candidate              
------>          phase 1 prepare ---------------> phase 2 decide ------------> value choosed


Core description
---------------

Fig3:

2 phase , each have 2 step



White box: in action
-----------

Fig4
activity diagram


review
-----------
=> this paxos is the slower form of Paxos , we can speed it up but doing so makes it very complex.


Disk Paxos
=============

define
 - Quorum
 - Synod


the need / context:

overview:
Is it possible to replace all acceptor processes with the Quorum state ?. With Disk Paxos the answer is yes.
(Disk Paxos is a variant of Paxos that replaces acceptor processes with disks that support only read block and write block operations to store the quorum state.)
In Disk Paxos the Quorum state is stored on disk. Each leader owns a block on every disk to which it can write its messages.

protocol:
//To run phase 1 of the Synod protocol, a leader executes the following for each disk.
//   The leader writes a p1a message in its own block on the disk and reads the blocks of other leaders on the same disk to check if there is a p1a message with a higher ballot number.
//   If the leader does not discover a higher ballot number on a majority of disks, its ballot is adopted.
//   If it discovers a p1a message with a higher ballot number,it starts over with a higher ballot number.
//For phase 2, the leader repeats the same process with p2a messages to determine if its proposals are accepted.


conclusion:



Passive Paxos
=============
In passive Paxos we have no Disk, inplace we use a service whose register each message between proposer and acceptor.
This service is a list append only. The only constraint requested from a passive server is to provide this service.
We can find the accepted proposal by examining the logs contained in the list append only 


what is a list append only
-----------

protocol
-----------


// passive-paxos is a simple adaptation of static-paxos where the choose to know wich proposal is accepted is make by the proposer
//- 

//Role:
// - the storage service provide an append only list service., all client  communicate wih this service.
// - node are client of the storage service.





// client state: offline - online
// on line sub state: Follower, Proposer
// - prepare: to propose a value, a client send the msg "PREPARE" the value with a proposal number to the append only list. the proposal number must be unique. the client state switch from follower to proposer
// - the client discard his proposition if an another proposal with bigger proposal number appear in the append list.



how simulate a list append only with storage service API
=============

we want to use common storage service (like dropbox, google drive, baidu, ...) for simulate a list apend only.
All this solution is present in the passive paxos article.

table with solution for each service




.. bibliography:: references.bib