import { useSession } from "../context/sessionContext";
import { useEffect, useState } from "react";
import { Critter } from "../declarations/backend/backend.did"
import { Critter as CritterView } from "../components/Critter"


const Dashboard = () => {
  const { backend, user, identity, activityData } = useSession();
  const [critters, setCritters] = useState<Critter[]>([])


  useEffect(() => {
    const fecthCritters = async () => {
      setCritters(await backend.getMyCritters());
    }
    fecthCritters();
  }, [backend]);

  return (
    <div className="text-white animate-fade-in">
      <h1 className="text-[22px] text-center mt-4">Dashboard</h1>

      {user && <div className="text-[16px] ml-2 mt-5 max-w-[700px]">
        <hr className="my-4" />
        <p className="ml-2">
          <span className="mr-3">User Name: </span>
          {user?.name}
        </p>
        <p className="ml-2">
          <span className="mr-3">Email: </span>
          {user?.email[0]}
        </p>
        <p className="ml-2">
          <span className="mr-3">Principal ID:</span>
          {identity.getPrincipal().toText()}
        </p>
        {user.wallet.length === 1 && (<p>Wallet Owner:  {user.wallet[0].owner.toText()}</p>)}
        <p className="ml-2">Total referred users: {activityData?.[0]?.referreds?.length ?? 0}</p>
        <p className="ml-2 ">CRT Token Balance: {activityData?.[0]?.balanceCRT ?? 0}</p>
        <p className="ml-2 ">Referral Program rewards: {activityData?.[0]?.referreds?.length === 0 ? 0: "In progress"}</p>

        

        <hr className="my-4" />
      </div>}

      <div className="flex flex-row flex-wrap justify-center items-center gap-6 p-1">

        {critters.map((critter) => (
          <div
            key={critter.id.toString()}
            className="w-full md:max-w-[480px] bg-gradient-to-br from-[#11182800] to-[#1f2a4488] border border-[#22336677] text-white rounded-2xl shadow-lg p-1 md:p-3"
          >
            <h2 className="text-3xl text-center mt-2 mb-5 drop-shadow-[0_0_10px_rgba(50,255,255,1)]">
              🧬 Critter ID:  {critter.id.toString()}
            </h2>

            <div className="flex justify-center mb-5">
              <div className="w-full aspect-square max-w-[400px] md:max-w-[600px]" >
                <CritterView data={Uint8Array.from(critter.genome)} />
              </div>
            </div>

            <div className="space-y-1 text-sm md:text-base leading-snug px-2">
              <p><span className="font-semibold mr-2">🪪 Name:</span> {critter.name}</p>
              <p><span className="font-semibold mr-2">⏳ Generation:</span> {critter.generation}</p>
              <p><span className="font-semibold mr-2">📅 Born:</span> {new Date(Number(critter.dateBorn) / 1000000).toLocaleString()}</p>
              <p className="break-all">
                <span className="font-semibold mr-2">👤 Owner: </span> 
                {`${critter.owner.toString().slice(0, 23)} ... ${critter.owner.toString().slice(-3)}`}
                </p>
              <p><span className="font-semibold mr-2">🧬 Parent A / ID:</span> {critter.parent_a.toString()}</p>
              <p><span className="font-semibold mr-2">🧬 Parent B / ID:</span> {critter.parent_b.toString()}</p>
              <p>
                <span className="font-semibold">👶 Children:</span>{" "}
                {critter.childs.length > 0
                  ? critter.childs.map((c) => c.toString()).join(", ")
                  : "None"}
              </p>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}
export default Dashboard;