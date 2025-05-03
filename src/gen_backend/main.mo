import Types "./types";
import Map "mo:map/Map";
import { nhash; phash } "mo:map/Map";
import Array "mo:base/Array";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Rand "mo:random/Rand";
import { now } "mo:base/Time"; 

actor {

  type User = Types.User;
  type Genome = Types.Genome;
  type Creature = Types.Creature;
  type CreatureId = Types.CreatureId;
  type OwnershipRecord = Types.OwnershipRecord;

  stable let users = Map.new<Principal, User>();
  stable let creatures = Map.new<CreatureId, Creature>();
  stable var lastCreatureId = 0;
  stable var inProcess = false;

  // public shared ({ caller }) func mintCreature(dataInit: CreatureDataInit): async (){
  //   let rand = Rand.Rand();


  // };

  // func reproduce(a: Genome, b: Genome): Genome {
  //   let chromosomes = Map.new<Nat, Chromosome>();
  //   for ((crz_id, chromo_a) in Map.toArray<Nat, Chromosome>(a.chromosomes).vals()){
  //     switch (Map.get<Nat, Chromosome>(b.chromosomes, nhash, crz_id)) {
  //       case null { };
  //       case ( ?chromo_b) {
  //         let genes = Map.new<Nat, Gene>();
  //         for ((gn_id, gene_a) in Map.toArray<Nat, Gene>(chromo_a.genes).vals()){
  //           switch (Map.get<Nat, Gene>(chromo_b.genes, nhash, gn_id)) {
  //             case null { ignore Map.put(genes, nhash, gn_id, gene_a) };
  //             case ( ?gene_a ) {
  //               assert(gene_a.geneSequence.size() == gene_a.geneSequence.size());
  //               let geneSequence = Array.tabulate<Nat8>(
  //                 gene_a.geneSequence.size(),
  //                 func i = Nat8.fromNat((Nat8.toNat(gene_a.geneSequence[i]) + Nat8.toNat(gene_a.geneSequence[i])) / 2),
  //               );
  //               ignore Map.put<Nat, Gene>(genes, nhash, gn_id, {geneSequence})

  //             };
  //           };
  //         };
  //         ignore Map.put<Nat, Chromosome>(chromosomes, nhash, crz_id, {genes});  
  //       } 
  //     }
  //   };
  //   {chromosomes}
  // };

  public shared ({ caller }) func signUp(name: Text): async {#Ok: User; #Err: Text}{
    if(Map.get<Principal, User>(users, phash, caller) != null) {return #Err("Caller is already User")};
    let newUser: User = {
      name;
      registrationDate = now();
      creaturesId = [];
    };
    ignore Map.put<Principal, User>(users, phash, caller, newUser);
    #Ok(newUser)
  };

  public shared query ({ caller }) func signIn(): async Types.SignInResult{
    let user = Map.get<Principal, User>(users, phash, caller);
    switch user {
      case null {#Err("Caller is not a User")};
      case ( ?user ) {
        let creatures = getCreaturesByPrincipal(caller);
        #Ok(user)
      }
    }
  };

  func safeMintBasicCreature({owner: Principal; genomeLength: Nat}): async CreatureId{
    let rand = Rand.Rand();
    let genomeNat = await rand.randArray(genomeLength);
    let genome = Array.tabulate<Nat8>(genomeLength, func i = Nat8.fromNat(genomeNat[i]));
    lastCreatureId += 1;
    let newCreature: Creature = {
      id = lastCreatureId;
      dateBorn = now();
      generation = 0;
      genome;
      parent_a = 0;
      parent_b = 0;
      childs = [];
      owner;
      ownershipRecord: OwnershipRecord = List.make({fromDate = now(); owner})
    };
    ignore Map.put<Nat, Creature>(creatures, nhash, newCreature.id, newCreature);
    lastCreatureId;
  };

  func verifyTransaction(id: Nat): Bool {
    true;
    //TODO
  };

  public shared ({ caller }) func mintCreature({transactionId: Nat; genomeLength: Nat}): async {#Err: Text; #Ok: CreatureId} {
    let user = Map.get<Principal, User>(users, phash, caller);
    switch user {
      case null {return #Err("Caller is not a user")};
      case ( ?user ){
        if(not verifyTransaction(transactionId)){
          return #Err("Transaction not verified");
        };
        let newCreatureId = await safeMintBasicCreature({owner = caller; genomeLength});
        let creaturesId = Array.tabulate<Nat>(
          user.creaturesId.size() + 1,
          func x = if( x < user.creaturesId.size()) {user.creaturesId[x]} else {newCreatureId}
        );
        ignore Map.put<Principal, User>(users, phash, caller, {user with creaturesId});
        #Ok(newCreatureId)
      }
    };
    
  };

  func crossing_over(a: Nat8, b: Nat8, mut: Nat): Nat8 {
    // Mejorar el algoritmo de cruzamiento
    let prom: Nat = (Nat8.toNat(a) + Nat8.toNat(b)) / 2;
    let withMutation = if (prom + mut <= 255) {prom + mut} else {prom - mut: Nat};
    Nat8.fromNat(withMutation)
  };

  func safeProcreate(a: Creature, b: Creature): async (CreatureId, CreatureId) {
    // assert(not inProcess);
    // inProcess := True;
    let mutationGenerator = Rand.Rand();
    mutationGenerator.setRange(0, 16);
    let mutationsArray = await mutationGenerator.randArray(a.genome.size() * 2);
    let genome1 = Array.tabulate<Nat8>(a.genome.size(), func i = crossing_over(a.genome[i], b.genome[i], mutationsArray[i]));
    let genome2 = Array.tabulate<Nat8>(a.genome.size(), func i = crossing_over(a.genome[i], b.genome[i], mutationsArray[i + a.genome.size()]));

    lastCreatureId += 1;
    let newCreature1: Creature = {
      id = lastCreatureId;
      parent_a = a.id;
      parent_b = b.id;
      childs = [];
      dateBorn = now();
      generation = Nat.max(a.generation, b.generation ) + 1;
      owner = a.owner;
      ownershipRecord: OwnershipRecord = List.make({fromDate = now(); owner = a.owner});
      genome = genome1;
    };
    ignore Map.put<Nat, Creature>(creatures, nhash, newCreature1.id, newCreature1);

    lastCreatureId += 1;
    let newCreature2: Creature = {
      id = lastCreatureId;
      parent_a = a.id;
      parent_b = b.id;
      childs = [];
      dateBorn = now();
      generation = a.generation + 1;
      owner = b.owner;
      ownershipRecord: OwnershipRecord = List.make({fromDate = now(); owner = b.owner});
      genome = genome2;
    };
    ignore Map.put<Nat, Creature>(creatures, nhash, newCreature2.id, newCreature2);

    let updateChidsA = Array.tabulate<Nat>(
      a.childs.size() + 2,
      func x = if(x < a.childs.size()) { a.childs[x]} else {[newCreature1.id, newCreature2.id][x - a.childs.size()]}
    );

    let updateChidsB = Array.tabulate<Nat>(
      b.childs.size() + 2,
      func x = if(x < b.childs.size()) { b.childs[x]} else {[newCreature1.id, newCreature2.id][x - b.childs.size()]}
    );

    ignore Map.put<Nat, Creature>(creatures, nhash, a.id, {a with childs = updateChidsA});
    ignore Map.put<Nat, Creature>(creatures, nhash, b.id, {b with childs = updateChidsB});

    // inProcess := false;
    (newCreature1.id, newCreature2.id);

  };

  // func consanguinity(spcm_a: Creature, spcm_b: Creature ): Nat {

  // }

  public shared ({ caller }) func procreate(id_a: CreatureId, id_b: CreatureId): async {#Ok: (CreatureId, CreatureId); #Err: Text} {
    switch (Map.get<CreatureId, Creature>(creatures, nhash, id_a)) { 
      case null {#Err("There is no creature associated with id " # Nat.toText(id_a))};
      case ( ?spcm_a ) {
        if(spcm_a.owner != caller) {return #Err("Caller is not owner of Creature A")};
        switch (Map.get<CreatureId, Creature>(creatures, nhash, id_b)) {
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
  
  public shared query func getCreature(id: CreatureId): async {#Ok: Creature; #Err} {
    return switch (Map.get<CreatureId, Creature>(creatures, nhash, id)){
      case null { #Err };
      case ( ?spcm ) {#Ok(spcm)}
    }
  };

  func getCreaturesByPrincipal(owner: Principal): [Creature] {
    switch (Map.get<Principal, User>(users, phash, owner)) {
      case null {[]};
      case ( ?user ){
        let defaultCreature: Creature = {
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
        let _creatures = Array.tabulate<Creature>(
          user.creaturesId.size(),
          func x = switch (Map.get<CreatureId, Creature>(creatures, nhash, user.creaturesId[x])){
            case null {defaultCreature};
            case ( ?creature ) {
              if(owner == creature.owner){
                creature
              } else {
                defaultCreature
              }
            }
          }
        );
        Array.filter<Creature>( _creatures, func x = x.id != 0 )
      }
    };

  };

  public shared ({ caller }) func getMyCreatures(): async [Creature]{
    getCreaturesByPrincipal(caller)
  };

};
