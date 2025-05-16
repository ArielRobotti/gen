import { useEffect, useState } from "react";
import { useSession } from "../context/sessionContext";
import { PublicInfo } from "../declarations/backend/backend.did"

const safeStringify = (data: unknown, indent = 2) => {
  return JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
    , indent);
};

const Metrics = () => {
  const { backend } = useSession();
  const [metrics, setMetrics] = useState<PublicInfo | null>(null);

  useEffect(() => {
    console.log("Efecutando efecto")
    const fetchInfo = async () => {
      if (backend) {
        console.log("Hay backend")
        const info = await backend.info();
        console.log(info)
        setMetrics(info);
      }
    };

    fetchInfo();
  }, [backend]);

  return (
  <>
    {backend && metrics === null && (
      <div className="text-white p-4">Cargando métricas...</div>
    )}
    {metrics && (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center animate-fade-in">
        <h2 className="text-2xl text-white font-bold mb-6">Platform public metrics</h2>
        <div className="bg-gray-800/20 p-6 rounded-lg max-w-[600px] w-full border border-gray-700">
          <pre className="text-gray-200 overflow-x-auto text-sm font-mono">
            {safeStringify(metrics)}
          </pre>
        </div>
      </div>
    )}
  </>
);
};
export default Metrics