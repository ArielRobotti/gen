import Types "./types";
import Map "mo:map/Map";
import { nhash; phash } "mo:map/Map";
import Array "mo:base/Array";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Rand "mo:random/Rand";
import { now } "mo:base/Time";
import { print } "mo:base/Debug";

actor {

  type User = Types.User;
  type Genome = Types.Genome;
  type Critter = Types.Critter;
  type CritterId = Types.CritterId;
  type OwnershipRecord = Types.OwnershipRecord;

  stable let users = Map.new<Principal, User>();
  stable let critters = Map.new<CritterId, Critter>();
  stable var lastCritterId = 0;

  public shared ({ caller }) func signUp(name: Text): async Types.SignInResult{
    if(Map.get<Principal, User>(users, phash, caller) != null) {return #Err("Caller is already User")};
    let newUser: User = { 
      Types.userDefault with
      name;
      registrationDate = now();
      crittersId = [];
    };
    ignore Map.put<Principal, User>(users, phash, caller, newUser);
    #Ok(newUser)
  };

  public shared query ({ caller }) func signIn(): async Types.SignInResult{
    let user = Map.get<Principal, User>(users, phash, caller);
    switch user {
      case null {#Err("Caller is not a User")};
      case ( ?user ) {
        #Ok(user)
      }
    }
  };

  func safeMintBasicCritter({owner: Principal; genomeLength: Nat}): async CritterId{
    let rand = Rand.Rand();
    let genomeNat = await rand.randArray(genomeLength);
    let genome = Array.tabulate<Nat8>(genomeLength, func i = Nat8.fromNat(genomeNat[i]));
    lastCritterId += 1;
    let newCritter: Critter = {
      id = lastCritterId;
      dateBorn = now();
      generation = 0;
      genome;
      parent_a = 0;
      parent_b = 0;
      childs = [];
      owner;
      ownershipRecord: OwnershipRecord = List.make({fromDate = now(); owner})
    };
    ignore Map.put<Nat, Critter>(critters, nhash, newCritter.id, newCritter);
    lastCritterId;
  };

  func verifyTransaction(id: Nat): Bool {
    true;
    //TODO
  };

  public shared ({ caller }) func mintCritter({transactionId: Nat; genomeLength: Nat}): async {#Err: Text; #Ok: CritterId} {
    let user = Map.get<Principal, User>(users, phash, caller);
    switch user {
      case null {return #Err("Caller is not a user")};
      case ( ?user ){
        if(not verifyTransaction(transactionId)){
          return #Err("Transaction not verified");
        };
        let newCritterId = await safeMintBasicCritter({owner = caller; genomeLength});
        let crittersId = Array.tabulate<Nat>(
          user.crittersId.size() + 1,
          func x = if( x < user.crittersId.size()) {user.crittersId[x]} else {newCritterId}
        );
        ignore Map.put<Principal, User>(users, phash, caller, {user with crittersId});
        #Ok(newCritterId)
      }
    };
    
  };

  func crossing_over(a: Nat8, b: Nat8, mut: Nat): Nat8 {
    let prom: Nat = (Nat8.toNat(a) + Nat8.toNat(b)) / 2;
    let withMutation = if (prom + mut <= 255) {prom + mut} else {prom - mut: Nat};
    Nat8.fromNat(withMutation)
  };

  func safeProcreate(a: Critter, b: Critter): async (CritterId, CritterId) {
    let mutationGenerator = Rand.Rand();
    mutationGenerator.setRange(0, 16);
    let mutationsArray = await mutationGenerator.randArray(a.genome.size() * 2);
    let genome1 = Array.tabulate<Nat8>(a.genome.size(), func i = crossing_over(a.genome[i], b.genome[i], mutationsArray[i]));
    let genome2 = Array.tabulate<Nat8>(a.genome.size(), func i = crossing_over(a.genome[i], b.genome[i], mutationsArray[i + a.genome.size()]));

    lastCritterId += 1;
    let newCritter1: Critter = {
      id = lastCritterId;
      parent_a = a.id;
      parent_b = b.id;
      childs = [];
      dateBorn = now();
      generation = Nat.max(a.generation, b.generation ) + 1;
      owner = a.owner;
      ownershipRecord: OwnershipRecord = List.make({fromDate = now(); owner = a.owner});
      genome = genome1;
    };
    ignore Map.put<Nat, Critter>(critters, nhash, newCritter1.id, newCritter1);

    lastCritterId += 1;
    let newCritter2: Critter = {
      id = lastCritterId;
      parent_a = a.id;
      parent_b = b.id;
      childs = [];
      dateBorn = now();
      generation = a.generation + 1;
      owner = b.owner;
      ownershipRecord: OwnershipRecord = List.make({fromDate = now(); owner = b.owner});
      genome = genome2;
    };
    ignore Map.put<Nat, Critter>(critters, nhash, newCritter2.id, newCritter2);

    let updateChidsA = Array.tabulate<Nat>(
      a.childs.size() + 2,
      func x = if(x < a.childs.size()) { a.childs[x]} else {[newCritter1.id, newCritter2.id][x - a.childs.size()]}
    );

    let updateChidsB = Array.tabulate<Nat>(
      b.childs.size() + 2,
      func x = if(x < b.childs.size()) { b.childs[x]} else {[newCritter1.id, newCritter2.id][x - b.childs.size()]}
    );

    ignore Map.put<Nat, Critter>(critters, nhash, a.id, {a with childs = updateChidsA});
    ignore Map.put<Nat, Critter>(critters, nhash, b.id, {b with childs = updateChidsB});

    (newCritter1.id, newCritter2.id);

  };

  // func consanguinity(spcm_a: Critter, spcm_b: Critter ): Nat {

  // }

  public shared ({ caller }) func procreate(id_a: CritterId, id_b: CritterId): async {#Ok: (CritterId, CritterId); #Err: Text} {
    switch (Map.get<CritterId, Critter>(critters, nhash, id_a)) { 
      case null {#Err("There is no creature associated with id " # Nat.toText(id_a))};
      case ( ?spcm_a ) {
        if(spcm_a.owner != caller) {return #Err("Caller is not owner of Critter A")};
        switch (Map.get<CritterId, Critter>(critters, nhash, id_b)) {
          case null { #Err("There is no creature associated with id " # Nat.toText(id_b))};
          case ( ?spcm_b ) {
            if(spcm_a.genome.size() != spcm_b.genome.size()) {return #Err("The species do not have a compatible genome")};
            // if(consanguinity(spcm_a, spcm_b) < 4){return #Err("rejection by degree of consanguinity")};
            #Ok(await safeProcreate(spcm_a, spcm_b))
          }
        }
      }
    }
  };
  
  public shared query func getCritter(id: CritterId): async {#Ok: Critter; #Err} {
    return switch (Map.get<CritterId, Critter>(critters, nhash, id)){
      case null { #Err };
      case ( ?spcm ) {#Ok(spcm)}
    }
  };

  func getCrittersByPrincipal(owner: Principal): [Critter] {
    switch (Map.get<Principal, User>(users, phash, owner)) {
      case null {[]};
      case ( ?user ){
        let defaultCritter: Critter = {
          id = 0;
          parent_a = 0;
          parent_b = 0;
          childs = [];
          dateBorn = 0;
          generation = 0;
          owner;
          ownershipRecord = List.nil();
          genome = [];
        };
        let _critters = Array.tabulate<Critter>(
          user.crittersId.size(),
          func x = switch (Map.get<CritterId, Critter>(critters, nhash, user.crittersId[x])){
            case null {defaultCritter};
            case ( ?creature ) {
              if(owner == creature.owner){
                creature
              } else {
                defaultCritter
              }
            }
          }
        );
        Array.filter<Critter>( _critters, func x = x.id != 0 )
      }
    };

  };

  public shared query ({ caller }) func getMyCritters(): async [Critter]{
    getCrittersByPrincipal(caller)
  };

};
