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

    // public type CreatureDataInit = { 
    //     genomeSize: Nat8;
    //     chromosomeSize: Nat8;
    //     geneSize: Nat8;
    // };


    public type OwnershipRecord = List.List<{
        owner: Principal;
        fromDate: Int;
    }>;

    public type CreatureId = Nat;

    public type Creature = {
        id: CreatureId;
        parent_a: CreatureId;
        parent_b: CreatureId;
        childs: [CreatureId];
        dateBorn: Int;
        generation: Nat;
        owner: Principal;
        ownershipRecord: OwnershipRecord;
        genome: Genome;
    };

    public type Genome = [Nat8];

    public type User = {
        name: Text;
        registrationDate: Int;
        creaturesId: [Nat];      
    };

    public type SignInResult = {
        #Ok: User;
        // {
        //     name: Text;
        //     creatures: [Creature];
        //     registrationDate: Int
        // };
        #Err: Text;
    };


}