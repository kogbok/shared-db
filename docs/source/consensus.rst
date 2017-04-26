*******
Consensus
*******

Introduction
============
If only one agent uses the database, there is no synchronization problem. On the other hand, if two or more agents use the database, we must guarantee synchronization.
On a :term:`passive server`, there is no synchronization system. Each agent must participate to make this synchronization possible, the agents must reach a "consensus". There is no communication between agents, to reach this consensus, agents must communicate via the :term:`passive server`.


The state-machine approach is a general method for implementing an arbitrary distributed system. The system is designed as a deterministic state machine that executes a sequence of commands, and a consensus algorithm ensures that. This reduces the problem of buildingan arbitrary system to solving the consensus problem. 
We need an algorithme an algorithm to transform any finite-state machine (FSM) into a fault-tolerant distributed system.
=> Time, clocks, and the orderingof events in a distributed system
=> Implementingfault-tolerant services usingthe state
machine approach
state machine replication




**Goal**: This section describes how agents can reach a :term:`consensus`. To do this, we will define a protocol that these agents must follow.
**Constraints**:
- The agents and their means of communication may have breakdowns.
- The solution must ensure that all cases are managed safely.

**problem**: On asynchronous system there is no fault-tolerant algorithm to ensure consensus is reached in a bounded time. This is the **FLP result** discribe in this article :cite:`Fischer1985` `Dijkstra Prize in 2001 <https://en.wikipedia.org/wiki/Dijkstra_Prize>`_.
The FLP result does not state that consensus can never be reached, but progression towards consensus is not guaranteed.

In this situation what do we want?
- A guarantee of safety: no inconsistency possible.
- Blocking situations (which prevent progression towards consensus) must be difficult to create.
=> This is what Paxos protocols propose.

Paxos is not the only solution for solve the consensus, raft, blockchain ... but we thinks in shared-db passive server, paxos is the best approch.