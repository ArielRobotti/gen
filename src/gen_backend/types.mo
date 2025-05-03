// import Map "mo:map/Map";
import List "mo:base/List";

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


    public type OwnershipRecord = List.List<{
        owner: Principal;
        fromDate: Int;
    }>;

    public type CritterId = Nat;

    public type Critter = {
        id: CritterId;
        parent_a: CritterId;
        parent_b: CritterId;
        childs: [CritterId];
        dateBorn: Int;
        generation: Nat;
        owner: Principal;
        ownershipRecord: OwnershipRecord;
        genome: Genome;
    };

    public type Genome = [Nat8];

    type Account = { owner: Principal ; subaccount: ?Blob};

    public type User = {
        name: Text;
        photo: ?Blob;
        wallet: ?Account;
        email: ?Text;
        registrationDate: Int;
        crittersId: [Nat];      
    };

    public let userDefault: User = {
        name: Text = "";
        photo: ?Blob = null;
        wallet: ?Account = null;
        email: ?Text = null;
        registrationDate: Int = 0;
        crittersId: [Nat] = [];
    };

    public type SignInResult = {
        #Ok: User;
        #Err: Text;
    };


}