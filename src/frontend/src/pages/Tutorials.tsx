import React, { useEffect, useState } from 'react';
import { useSession } from "../context/sessionContext";
  
const TutorialesPage: React.FC = () => {
  const [tutos, setTutos] = useState<string[]>([]);
  const { backend } = useSession();

  useEffect(() => {
    const fetchTutos = async () => {
        const response = await backend.getTutorials();
        if(response) {
            setTutos(response)
        }
    };
    fetchTutos();
  }, [backend]);

  return (
    <div className="p-1 md:p-4 space-y-8">
      <h1 className="text-xl md:text-3xl font-bold text-white text-center">Tutorials</h1>
        <div className="grid gap-8 sm:grid-cols-1  lg:grid-cols-2">

        {tutos.map((code, index) => (
        <div className="w-full max-w-[800px] mx-auto aspect-video p-2">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${code}`}
          title={`YouTube video ${index}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      ))}
        </div>
    </div>
  );
};

export default TutorialesPage;
