*******
Paxos
*******

Introduction
============
If only one agent uses the database, there is no synchronization problem. On the other hand, if two or more agents use the database, we must guarantee synchronization.
On a :term:`passive server`, there is no synchronization system. Each agent must participate to make this synchronization possible, the agents must reach a "consensus". There is no communication between agents, to reach this consensus, agents must communicate via the :term:`passive server`.

**Goal**: This section describes how agents can reach a :term:`consensus`. To do this, we will define a protocol that these agents must follow.
