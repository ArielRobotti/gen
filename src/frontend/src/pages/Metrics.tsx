import { useEffect, useState } from "react";
import { useSession } from "../context/sessionContext";
import { PublicInfo } from "../declarations/backend/backend.did"
import Line  from "../components/graphics/Line";


const Metrics = () => {
  const { backend } = useSession();
  const [metrics, setMetrics] = useState<PublicInfo | null>(null);

  useEffect(() => {
  
    const fetchInfo = async () => {
      if (backend) {
        const info = await backend.info();
        setMetrics(info);
      }
    };

    fetchInfo();
  }, [backend]);

  return (
  <>
    {backend && metrics === null &&  (
      <div className="text-white p-2 text-center">Loading metrics ...</div>
    )}
    {metrics && (
      <> 
      <h1 className="text-white text-[26px] text-center mt-10">Statistic</h1>
        <div className="flex flex-col lg:flex-row min-h-screen mt-10 items-center animate-fade-in ">
          
          <Line
            data={metrics.userRegistrationsPerDay}
            note={`Current Users:  ${metrics.usersQty}`}
            title={"User registered chart"}  
            />

          <Line
            data={metrics.mintPerDay}
            note={`Total Supply:  ${metrics.mintPerDay[metrics.mintPerDay.length -1]}`}
            title={"Critters minted chart"}  
            />
        </div>
      </>

      
    )}
  </>
);
};
export default Metrics