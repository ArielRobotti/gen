import { useSession } from "../context/sessionContext";
import { useEffect, useState } from "react";
import { Critter } from "../declarations/backend/backend.did"


const Dashboard = () => {
  const { backend } = useSession();
  const [critters, setCritters] = useState<Critter[]>([])

  useEffect(() => {
    const fecthCritters = async () => {
      setCritters(await backend.getMyCritters());
    }
    fecthCritters();
  }, [backend]);

  useEffect(() => {
    console.log("Critters:", critters[0]);
  }, [critters]);

  return (
    <div className="dashboard text-white">
      <h1>Bienvenido al dashboard</h1>
      <p>Este es el dashboard</p>
      {critters.map((critter) => (
        <div key={critter.id.toString()}>
          Critter ID: {critter.id.toString()}
        </div>
      ))}
    </div>
  );
}
export default Dashboard;