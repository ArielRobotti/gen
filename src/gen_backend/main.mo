import Types "./types";
import Map "mo:map/Map";
import { nhash; phash; n32hash } "mo:map/Map";
import Set "mo:map/Set";
import Array "mo:base/Array";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Rand "mo:random/Rand";
import { now } "mo:base/Time";
import { print } "mo:base/Debug";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";

shared ({ caller = Deployer }) actor class CriptoCritters() = self {

  type User = Types.User;
  type Genome = Types.Genome;
  type Critter = Types.Critter;
  type CritterId = Types.CritterId;
  type OwnershipRecord = Types.OwnershipRecord;
  type Notification = Types.Notification;

  let NanoSecPerDay : Int = 24 * 60 * 60 * 1_000_000_000;

  stable let users = Map.new<Principal, User>();
  stable let notificationsMap = Map.new<Principal, [Notification]>();
  stable let userInternalEconomyData = Map.new<Principal, Types.EconomyData>();
  stable let referralCodes = Map.new<Nat32, Principal>();
  stable let deletedUsers = Map.new<Principal, User>();

  stable var admins : [Principal] = [Deployer];

  stable let critters = Map.new<CritterId, Critter>();
  stable let crittersByGeneration = Map.new<Nat, { births : Nat; deaths : Nat }>();
  stable var recordBirths = List.nil<(Int, Nat)>();
  stable var recordDeaths = List.nil<(Int, Nat)>();
  stable var lastCritterId = 0;

  let usersMinting = Set.new<Principal>();

  /////////////////////////////////////// Configuration variables ////////////////////////////////////////////

  stable var maxMintingPerDayPerAccount = 5;

  /////////////////////////////////////// Admin functions ////////////////////////////////////////////////////

  public shared ({ caller }) func addAdmin(a : Principal) : async () {
    var isAdmin = false;
    for (admin in admins.vals()) {
      if (admin == a) { return };
      if (admin == caller) { isAdmin := true };
    };
    if (not isAdmin) { return };
    admins := Array.tabulate<Principal>(admins.size() + 1, func x = if (x < admins.size()) { admins[x] } else { a });
  };
  
  public shared ({ caller }) func setLimitPerDay(l: Nat): async {#Ok}{
    assert(isAdmin(caller));
    maxMintingPerDayPerAccount := l;
    #Ok
  };

  public query func getLimitPerDay(): async Nat{
    maxMintingPerDayPerAccount;
  };

  

  public shared query func info() : async Types.PublicInfo {
    {
      usersQty = Map.size(users);
      adminsQty = admins.size();
      crittersByGeneration = Map.toArray<Nat, { births : Nat; deaths : Nat }>(crittersByGeneration);
      birthsLastWeek = getBirthsFromDaysAgo(7);
      deathsLastWeek = getKillsFromDaysAgo(7);
      birthsLastDay = getBirthsFromDaysAgo(1);
      deathsLastDay = getKillsFromDaysAgo(1);
      birthsLastMonth = getBirthsFromDaysAgo(30);
      deathsLastMonth = getKillsFromDaysAgo(30);
    };
  };

  // public shared ({ caller }) func resetAll() : async { #Ok; #Err } {
  //   if (not isAdmin(caller)) { return #Err };
  //   Map.clear(users);
  //   Map.clear(critters);
  //   Map.clear(crittersByGeneration);
  //   Map.clear(deletedUsers);
  //   recordBirths := List.nil<(Int, Nat)>();
  //   recordDeaths := List.nil<(Int, Nat)>();
  //   lastCritterId := 0;
  //   #Ok;
  // };

  public shared query ({ caller }) func getMetadataCritters(): async [Types.CritterMetadata]{
    assert(isAdmin(caller));
    Iter.toArray(Map.vals<CritterId, Critter>(critters));
  };

  public shared query func critterBalanceOf(p: Principal): async Nat {
    var result = 0;
    for (critter in Map.vals(critters)) {
      if(critter.owner == p) {
        result += 1;
      }
    };
    result
  };

  public query func getMetadataFrom(p: Principal): async [Types.CritterMetadata]{
    Array.filter<Types.CritterMetadata>(Iter.toArray(
      Map.vals<CritterId, Critter>(critters)),
      func x = x.owner == p
    );
  };

  public shared query ({ caller }) func getUsers() : async [User] {
    if (not isAdmin(caller)) { return [] };
    return Iter.toArray(Map.vals<Principal, User>(users));
  };

  public shared ({ caller }) func deleteUser(p : Principal) : async {
    #Ok;
    #Err;
  } {
    if (not isAdmin(caller)) { return #Err };
    switch (Map.remove<Principal, User>(users, phash, p)) {
      case null { return #Err };
      case (?user) {
        ignore Map.put<Principal, User>(deletedUsers, phash, p, user);
      };
    };
    #Ok;
  };

  public shared ({ caller }) func restoreUser(p : Principal) : async {
    #Ok;
    #Err;
  } {
    if (not isAdmin(caller)) { return #Err };
    switch (Map.remove<Principal, User>(deletedUsers, phash, p)) {
      case null { return #Err };
      case (?user) {
        ignore Map.put<Principal, User>(users, phash, p, user);
      };
    };
    #Ok;
  };

  public shared ({ caller }) func garbageCollector() : async { #Ok; #Err } {
    if (not isAdmin(caller)) { return #Err };
    Map.clear(deletedUsers);
    #Ok;
  };

  public shared ({ caller }) func getDeletedUsers() : async [User] {
    if (not isAdmin(caller)) { return [] };
    return Iter.toArray(Map.vals<Principal, User>(deletedUsers));
  };

  //////////////////////////////////// Private functions ////////////////////////////////////////////////////

  func isAdmin(user : Principal) : Bool {
    for (admin in admins.vals()) {
      if (admin == user) { return true };
    };
    return false;
  };

  

  public func mintQtyLastDay(p: Principal): async Nat {
    let dataArray = Iter.toArray<{dateBorn: Int; owner: Principal}>(Map.vals<Nat, Critter>(critters));
    var i = dataArray.size() - 1: Nat;
    var minted = 0;
    while (i >= 0) {
      if (now() < dataArray[i].dateBorn  + 24 * 60 * 60 * 1_000_000_000) {
        if (p == dataArray[i].owner ) { minted += 1 };
      } else {
        return minted;
      };
      i -= 1;
    };
    return minted
  };

  func getBirthsFromDaysAgo(days: Nat) : Nat {
    let dataArray = Iter.toArray<{dateBorn: Int; owner: Principal}>(Map.vals<Nat, Critter>(critters));
    var counter = 0;
    var i = dataArray.size() - 1: Nat;
    while (i > 0) {
      if ( now() < dataArray[i].dateBorn + 24 * 60 * 60 * 1_000_000_000 * days) {
        counter += 1;
      } else {
        return counter;
      };
      i -= 1;
    };
    counter
  };

  func getKillsFromDaysAgo(days: Nat) : Nat {
    var counter = 0;
    
    counter

  };

  func registerBirth(timestamp : Int, generation : Nat, id: Nat) {
    ignore List.push<(Int, Nat)>((timestamp, id), recordBirths);
    let prevStatus = Map.get<Nat, { births : Nat; deaths : Nat }>(crittersByGeneration, nhash, generation);
    switch prevStatus {
      case null {
        ignore Map.put<Nat, { births : Nat; deaths : Nat }>(
          crittersByGeneration,
          nhash,
          generation,
          { births = 1; deaths = 0 },
        );
      };
      case (?status) {
        ignore Map.put<Nat, { births : Nat; deaths : Nat }>(
          crittersByGeneration,
          nhash,
          generation,
          { status with births = status.births + 1 },
        );
      };
    };
  };

  func pushNotification(to : Principal, notification : Notification) {
    let updateNotifications = switch (Map.remove<Principal, [Notification]>(notificationsMap, phash, to)) {
      case null { [notification] };
      case (?current) {
        Array.tabulate<Notification>(
          current.size() + 1,
          func x = if (x < current.size()) { current[x] } else { notification },
        );
      };
    };
    // TODO Send email in case
    ignore Map.put<Principal, [Notification]>(notificationsMap, phash, to, updateNotifications);
  };

  func getNotifications(p : Principal) : [Notification] {
    switch (Map.get<Principal, [Notification]>(notificationsMap, phash, p)) {
      case null { [] };
      case (?notif) { notif };
    };
  };

  func getUnReadMessages(p : Principal) : [Types.PrevMsg] {
    // TODO
    [];
  };

  func getReferralCode(p : Principal) : Nat32 {
    Principal.hash(p);
  };

  func applyReferralProgram(code : Nat32, referred : Principal, nameReffered : Text) : ?Principal {
    let referralUser = Map.get<Nat32, Principal>(referralCodes, n32hash, code);
    switch referralUser {
      case null {};
      case (?referral) {
        switch (Map.get<Principal, Types.EconomyData>(userInternalEconomyData, phash, referral)) {
          case null {
            let data : Types.EconomyData = {
              Types.DefaulEconomyData with
              referreds = [referred];
            };
            ignore Map.put<Principal, Types.EconomyData>(userInternalEconomyData, phash, referral, data);
          };
          case (?data) {
            let dataUpdated : Types.EconomyData = {
              data with
              referreds = Array.tabulate<Principal>(
                data.referreds.size() + 1,
                func x = if (x < data.referreds.size()) { data.referreds[x] } else {
                  referred;
                },
              );
            };
            ignore Map.put<Principal, Types.EconomyData>(userInternalEconomyData, phash, referral, dataUpdated);
          };
        };
        pushNotification(referral, { date = now(); kind = #NewRefferal(nameReffered); read = false });
      };
    };
    return referralUser;
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  public shared ({ caller }) func signUp({ name : Text; code : ?Nat32 }) : async Types.SignInResult {
    if (Principal.isAnonymous(caller)) {
      return #Err("Anonymous caller")
    };

    switch (Map.get<Principal, User>(users, phash, caller)) {
      case ( ?user) {
        return #Ok({
          user;
          notifications = getNotifications(caller);
          activityStatus = Map.get<Principal, Types.EconomyData>(userInternalEconomyData, phash, caller);
          messagesPrev : [{date : Int; sender : Text; title : Text}] = []; // TODO
        })
      };
      case null {}
    };
    
    let newUser : User = {
      Types.userDefault() with
      principal = caller;
      name;
      registrationDate = now();
      crittersId = [];
    };
    ignore Map.put<Principal, User>(users, phash, caller, newUser);

    switch code {
      case null {};
      case (?code) {
        switch (applyReferralProgram(code, caller, name)) {
          case null {};
          case (?referralUser) {
            ignore Map.put<Principal, Types.EconomyData>(
              userInternalEconomyData,
              phash,
              caller,
              { Types.DefaulEconomyData with referredBy = ?referralUser },
            );
          };
        };
      };
    };

    #Ok({
      user = newUser;
      notifications = [];
      messagesPrev = [{
        date = now();
        sender = "System";
        title = "Wellcome to Crypto Critters";
      }];
      activityStatus = Map.get<Principal, Types.EconomyData>(userInternalEconomyData, phash, caller);
    });
  };

  public shared query ({ caller }) func signIn() : async Types.SignInResult {
    if (Principal.isAnonymous(caller)) {
      return #Err("Anonymous caller")
    };
    let user = Map.get<Principal, (User)>(users, phash, caller);
    switch user {
      case null { #Err("Caller is not a User") };
      case (?user) {
        let activityStatus = Map.get<Principal, Types.EconomyData>(userInternalEconomyData, phash, caller);
        #Ok({
          user;
          notifications = getNotifications(caller);
          messagesPrev = getUnReadMessages(caller);
          activityStatus;
        });
      };
    };
  };

  public shared ({ caller }) func generateReferralCode() : async Nat32 {
    assert(not Principal.isAnonymous(caller));
    let code = getReferralCode(caller);
    ignore Map.put<Nat32, Principal>(referralCodes, n32hash, code, caller);
    code;
  };

  public shared ({ caller }) func readNotification(date : Int) : async () {
    switch (Map.remove<Principal, [Notification]>(notificationsMap, phash, caller)) {
      case null {};
      case (?notifications) {
        let updatedNotifications = Array.tabulate<Notification>(
          notifications.size(),
          func x = if (notifications[x].date == date) {
            { notifications[x] with read = true };
          } else {
            notifications[x];
          },
        );
        ignore Map.put<Principal, [Notification]>(notificationsMap, phash, caller, updatedNotifications);
      };
    };
  };

  func safeMintBasicCritter({ owner : Principal; genomeLength : Nat }) : async CritterId {
    print("Minteando");
    let rand = Rand.Rand();
    let genomeNat = await rand.randArray(genomeLength);
    let genome = Array.tabulate<Nat8>(genomeLength, func i = Nat8.fromNat(genomeNat[i]));
    lastCritterId += 1;
    let newCritter : Critter = {
      id = lastCritterId;
      name = "";
      dateBorn = now();
      generation = 0;
      genome;
      parent_a = 0;
      parent_b = 0;
      childs = [];
      owner;
      ownershipRecord : OwnershipRecord = List.make({ fromDate = now(); owner });
    };
    ignore Map.put<Nat, Critter>(critters, nhash, newCritter.id, newCritter);
    pushNotification(
      owner,
      {
        date = now();
        kind = #MintingCompleted(newCritter.id);
        read = false;
      },
    );
    registerBirth(now(), 0, newCritter.id);
    lastCritterId;
  };

  func verifyTransaction(id : Nat) : Bool {
    true;
    //TODO
  };

  func userIsMinting(user : Principal) : Bool {
    Set.has<Principal>(usersMinting, phash, user);
  };

  public shared ({ caller }) func mintCritter({ transactionId : Nat; genomeLength : Nat}) : async Types.MintResult {
    let user = Map.get<Principal, User>(users, phash, caller);

    if(Principal.isAnonymous(caller)){ 
      return #Err("Anonymous caller") 
    };

    ////// Quitar cuando se complete el flujo de minteo de pago
    if((await mintQtyLastDay(caller)) >= maxMintingPerDayPerAccount) {
      return #Err("Maximum per day exceeded")
    };

    ///////////////////////////////////////////////////////////

    switch user {
      case null { return #Err("Caller is not a user") };
      case (?user) {
        if (not verifyTransaction(transactionId)) {
          return #Err("Transaction not verified");
        };

        if (userIsMinting(caller)) {
          return #Err("The Caller is minting a Critter right now");
        };

        Set.add<Principal>(usersMinting, phash, caller);
        let newCritterId = await safeMintBasicCritter({
          owner = caller;
          genomeLength;
        });
        let crittersId = Array.tabulate<Nat>(
          user.crittersId.size() + 1,
          func x = if (x < user.crittersId.size()) { user.crittersId[x] } else {
            newCritterId;
          },
        );
        ignore Map.put<Principal, User>(users, phash, caller, { user with crittersId });
        ignore Set.remove<Principal>(usersMinting, phash, caller);
        print("Minteo finalizado con éxito");
        #Ok(newCritterId);
      };
    };

  };

  func crossing_over(a : Nat8, b : Nat8, mut : Nat) : Nat8 {
    let prom : Nat = (Nat8.toNat(a) + Nat8.toNat(b)) / 2;
    let withMutation = if (prom + mut <= 255) { prom + mut } else {
      prom - mut : Nat;
    };
    Nat8.fromNat(withMutation);
  };

  func safeProcreate(a : Critter, b : Critter) : async (CritterId, CritterId) {
    let mutationGenerator = Rand.Rand();
    mutationGenerator.setRange(0, 16);
    let mutationsArray = await mutationGenerator.randArray(a.genome.size() * 2);
    let genome1 = Array.tabulate<Nat8>(a.genome.size(), func i = crossing_over(a.genome[i], b.genome[i], mutationsArray[i]));
    let genome2 = Array.tabulate<Nat8>(a.genome.size(), func i = crossing_over(a.genome[i], b.genome[i], mutationsArray[i + a.genome.size()]));

    lastCritterId += 1;
    let generation = Nat.max(a.generation, b.generation) + 1;
    let newCritter1 : Critter = {
      id = lastCritterId;
      name = "";
      parent_a = a.id;
      parent_b = b.id;
      childs = [];
      dateBorn = now();
      generation;
      owner = a.owner;
      ownershipRecord : OwnershipRecord = List.make({
        fromDate = now();
        owner = a.owner;
      });
      genome = genome1;
    };
    ignore Map.put<Nat, Critter>(critters, nhash, newCritter1.id, newCritter1);

    lastCritterId += 1;
    let newCritter2 : Critter = {
      id = lastCritterId;
      name = "";
      parent_a = a.id;
      parent_b = b.id;
      childs = [];
      dateBorn = now();
      generation;
      owner = b.owner;
      ownershipRecord : OwnershipRecord = List.make({
        fromDate = now();
        owner = b.owner;
      });
      genome = genome2;
    };
    ignore Map.put<Nat, Critter>(critters, nhash, newCritter2.id, newCritter2);

    let updateChidsA = Array.tabulate<Nat>(
      a.childs.size() + 2,
      func x = if (x < a.childs.size()) { a.childs[x] } else {
        [newCritter1.id, newCritter2.id][x - a.childs.size()];
      },
    );

    let updateChidsB = Array.tabulate<Nat>(
      b.childs.size() + 2,
      func x = if (x < b.childs.size()) { b.childs[x] } else {
        [newCritter1.id, newCritter2.id][x - b.childs.size()];
      },
    );

    ignore Map.put<Nat, Critter>(critters, nhash, a.id, { a with childs = updateChidsA });
    ignore Map.put<Nat, Critter>(critters, nhash, b.id, { b with childs = updateChidsB });
    registerBirth(now(), generation, newCritter1.id);
    registerBirth(now(), generation, newCritter2.id);
    (newCritter1.id, newCritter2.id);

  };

  // func consanguinity(spcm_a: Critter, spcm_b: Critter ): Nat {

  // }

  public shared ({ caller }) func procreate(id_a : CritterId, id_b : CritterId) : async {
    #Ok : (CritterId, CritterId);
    #Err : Text;
  } {
    switch (Map.get<CritterId, Critter>(critters, nhash, id_a)) {
      case null {
        #Err("There is no creature associated with id " # Nat.toText(id_a));
      };
      case (?spcm_a) {
        if (spcm_a.owner != caller) {
          return #Err("Caller is not owner of Critter A");
        };
        switch (Map.get<CritterId, Critter>(critters, nhash, id_b)) {
          case null {
            #Err("There is no creature associated with id " # Nat.toText(id_b));
          };
          case (?spcm_b) {
            if (spcm_a.genome.size() != spcm_b.genome.size()) {
              return #Err("The species do not have a compatible genome");
            };
            // if(consanguinity(spcm_a, spcm_b) < 4){return #Err("rejection by degree of consanguinity")};
            #Ok(await safeProcreate(spcm_a, spcm_b));
          };
        };
      };
    };
  };

  public shared query func getCritter(id : CritterId) : async {
    #Ok : Critter;
    #Err;
  } {
    return switch (Map.get<CritterId, Critter>(critters, nhash, id)) {
      case null { #Err };
      case (?spcm) { #Ok(spcm) };
    };
  };

  func getCrittersByPrincipal(owner : Principal) : [Critter] {
    switch (Map.get<Principal, User>(users, phash, owner)) {
      case null { [] };
      case (?user) {
        let defaultCritter : Critter = {
          id = 0;
          name = "";
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
          func x = switch (Map.get<CritterId, Critter>(critters, nhash, user.crittersId[x])) {
            case null { defaultCritter };
            case (?creature) {
              if (owner == creature.owner) {
                creature;
              } else {
                defaultCritter;
              };
            };
          },
        );
        Array.filter<Critter>(_critters, func x = x.id != 0);
      };
    };

  };

  public shared query ({ caller }) func getMyCritters() : async [Critter] {
    getCrittersByPrincipal(caller);
  };

};
