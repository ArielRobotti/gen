// import Map "mo:map/Map";
import List "mo:base/List";
import Principal "mo:base/Principal";


module{

    // public type Gene = {
    //     geneSequence: [Nat8]
    // };

    // public type Chromosome = {
    //     genes: Map.Map<Nat, Gene>
    // };

    // public type Genome = {
    //     chromosomes: Map.Map<Nat, Chromosome>;
    // };

    // public type CritterDataInit = { 
    //     genomeSize: Nat8;
    //     chromosomeSize: Nat8;
    //     geneSize: Nat8;
    // };

    public type NotificationKind = {
        #Welcome;
        #MintingCompleted: Nat;
        #ReproductionCompleted: Nat;
        #CritterDied: Nat;
        #NewRefferal: Text;
        #ReferralMinted;
    };

    public type Notification = {
        date: Int;
        kind: NotificationKind;
        read: Bool;
    };

    public type OwnershipRecord = List.List<{
        owner: Principal;
        fromDate: Int;
    }>;

    public type CritterId = Nat;

    public type CritterMetadata = {
        id: CritterId;
        name: Text;
        parent_a: CritterId;
        parent_b: CritterId;
        childs: [CritterId];
        dateBorn: Int;
        generation: Nat;
        owner: Principal;
        ownershipRecord: OwnershipRecord;
    };

    public type Critter = CritterMetadata and {
        genome: Genome;
    };

    public type Genome = [Nat8];

    type Account = { owner: Principal ; subaccount: ?Blob};

    public type User = {
        principal: Principal;
        name: Text;
        photo: ?Blob;
        wallet: ?Account;
        email: ?Text;
        registrationDate: Int;
        crittersId: [Nat];      
    };

    public func userDefault(): User {
        return {
            principal = Principal.fromText("2vxsx-fae");
            name: Text = "";
            photo: ?Blob = null;
            wallet: ?Account = null;
            email: ?Text = null;
            registrationDate: Int = 0;
            crittersId: [Nat] = [];
        };
    };

    type Value = {
        #text: Text;
        #nat: Nat;
        #blob: Blob;
        #bool: Bool;
        #int: Int;
    };

    public type EconomyData = {
        balanceCRT: Nat;
        referreds: [Principal];
        referredBy: ?Principal;
        othter: [{key: Text; value: Value}]

    };
    
    public let DefaulEconomyData: EconomyData = {
        balanceCRT = 0;
        referreds = [];
        referredBy = null;
        othter = []
    };

    public type SignInResult = {
        #Ok: (
            {
                user: User; 
                notifications: [Notification];
                messagesPrev: [PrevMsg];
                activityStatus: ?EconomyData;
            }
        );
        #Err: Text;
    };

    public type PrevMsg = {sender: Text; title: Text; date: Int};

    public type Msg = PrevMsg and {
        content: Text;
        multimedia: {
            mimeType: Text;
            data: Blob; // 1.5 MB Max
        }
    };

    public type Chat = {
        id: Nat32;
        name: Text;
        msgs: [Msg];
    };
 
    public type MintResult = {
        #Ok: CritterId;
        #Err: Text;
    };

    public type PublicInfo = {
        usersQty: Nat;
        adminsQty: Nat;
        crittersByGeneration: [(Nat, {births : Nat; deaths : Nat})];
        birthsLastWeek: Nat;
        deathsLastWeek: Nat;
        birthsLastDay: Nat;
        deathsLastDay: Nat;
        birthsLastMonth: Nat;
        deathsLastMonth: Nat;
    };



}