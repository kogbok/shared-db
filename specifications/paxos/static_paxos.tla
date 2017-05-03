---- MODULE static_paxos ----
EXTENDS Integers, Sequences, TLC

CONSTANT Acceptors

(*
--algorithm static_paxos
variables
  messages = {}; \* The set of messages that have been sent.
  acceptor_max_ballot; \* acceptor_max_ballot[a] is the highest-number ballot acceptor a has participated in.

define
  largest_ballot_id(acceptor_id) == CHOOSE msg \in messages:(msg.type = "1a") /\ (msg.bal > acceptor_max_ballot[acceptor_id]) /\ ;
end define

procedure send(m)
begin
  l1: messages := messages \union {m};
  l2: return;
end procedure

\* Phase 1a: A leader selects a ballot number b and sends a 1a message     
\* with ballot b to a majority of acceptors.  It can do this only if it    
\* has not already sent a 1a message for ballot b.                     
procedure phase_1a(ballot_number)
begin
  l1: assert(~ \E msg \in messages : (msg.type = "1a") /\ (msg.bal = ballot_number));
      call send([type |-> "1a", bal |-> ballot_id]);
  l2: return;
end procedure

\* Phase 1b: If an acceptor receives a 1a message with ballot b greater   
\* than that of any 1a message to which it has already responded, then it 
\* responds to the request with a promise not to accept any more proposals
\* for ballots numbered less than b and with the highest-numbered ballot 
\* (if any) for which it has voted for a value and the value it voted for
\* in that ballot.  That promise is made in a 1b message.                 
procedure phase_1b(acceptor_id)
begin
  l1: if(\E msg \in messages: (msg.type = "1a") /\ (msg.bal > acceptor_max_ballot[acceptor_id])) then
        print<<"f">>
      end if;
  l2: return;
end procedure


begin
  l1: call phase_1a("t");
end algorithm
*)

\*
\*

\* BEGIN TRANSLATION
\* Label l1 of procedure send at line 20 col 7 changed to l1_
\* Label l2 of procedure send at line 21 col 7 changed to l2_
\* Label l1 of procedure phase_1a at line 29 col 7 changed to l1_p
\* Label l2 of procedure phase_1a at line 31 col 7 changed to l2_p
\* Label l1 of procedure phase_1b at line 42 col 7 changed to l1_ph
CONSTANT defaultInitValue
VARIABLES messages, acceptor_max_ballot, pc, stack, m, ballot_id, acceptor_id

vars == << messages, acceptor_max_ballot, pc, stack, m, ballot_id, 
           acceptor_id >>

Init == (* Global variables *)
        /\ messages = {}
        /\ acceptor_max_ballot = defaultInitValue
        (* Procedure send *)
        /\ m = defaultInitValue
        (* Procedure phase_1a *)
        /\ ballot_id = defaultInitValue
        (* Procedure phase_1b *)
        /\ acceptor_id = defaultInitValue
        /\ stack = << >>
        /\ pc = "l1"

l1_ == /\ pc = "l1_"
       /\ messages' = (messages \union {m})
       /\ pc' = "l2_"
       /\ UNCHANGED << acceptor_max_ballot, stack, m, ballot_id, acceptor_id >>

l2_ == /\ pc = "l2_"
       /\ pc' = Head(stack).pc
       /\ m' = Head(stack).m
       /\ stack' = Tail(stack)
       /\ UNCHANGED << messages, acceptor_max_ballot, ballot_id, acceptor_id >>

send == l1_ \/ l2_

l1_p == /\ pc = "l1_p"
        /\ Assert((~ \E msg \in messages : (msg.type = "1a") /\ (msg.bal = ballot_id)), 
                  "Failure of assertion at line 29, column 7.")
        /\ /\ m' = [type |-> "1a", bal |-> ballot_id]
           /\ stack' = << [ procedure |->  "send",
                            pc        |->  "l2_p",
                            m         |->  m ] >>
                        \o stack
        /\ pc' = "l1_"
        /\ UNCHANGED << messages, acceptor_max_ballot, ballot_id, acceptor_id >>

l2_p == /\ pc = "l2_p"
        /\ pc' = Head(stack).pc
        /\ ballot_id' = Head(stack).ballot_id
        /\ stack' = Tail(stack)
        /\ UNCHANGED << messages, acceptor_max_ballot, m, acceptor_id >>

phase_1a == l1_p \/ l2_p

l1_ph == /\ pc = "l1_ph"
         /\ IF (\E msg \in messages: (msg.type = "1a") /\ (msg.bal > acceptor_max_ballot[acceptor_id]))
               THEN /\ PrintT(<<"f">>)
               ELSE /\ TRUE
         /\ pc' = "l2"
         /\ UNCHANGED << messages, acceptor_max_ballot, stack, m, ballot_id, 
                         acceptor_id >>

l2 == /\ pc = "l2"
      /\ pc' = Head(stack).pc
      /\ acceptor_id' = Head(stack).acceptor_id
      /\ stack' = Tail(stack)
      /\ UNCHANGED << messages, acceptor_max_ballot, m, ballot_id >>

phase_1b == l1_ph \/ l2

l1 == /\ pc = "l1"
      /\ /\ ballot_id' = "t"
         /\ stack' = << [ procedure |->  "phase_1a",
                          pc        |->  "Done",
                          ballot_id |->  ballot_id ] >>
                      \o stack
      /\ pc' = "l1_p"
      /\ UNCHANGED << messages, acceptor_max_ballot, m, acceptor_id >>

Next == send \/ phase_1a \/ phase_1b \/ l1
           \/ (* Disjunct to prevent deadlock on termination *)
              (pc = "Done" /\ UNCHANGED vars)

Spec == Init /\ [][Next]_vars

Termination == <>(pc = "Done")

\* END TRANSLATION



====
