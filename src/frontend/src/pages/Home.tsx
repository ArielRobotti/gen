
import { useSession } from "../context/sessionContext";
import { useEffect, useRef, useState } from "react";
// import {Critter} from "../components/Critter";
// import { arrayBuffer } from "stream/consumers";
// import * as THREE from "three";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Sparkles } from "lucide-react";

const critterLore = `In the forgotten corners of the primordial void, they slumbered.

  A handful of Critters—remnants of a life long erased—awoke as the Genesis Matrix roared back to life, triggered by a mysterious Oracle beyond time and form.
  
  From its depths surged a new wave of existence: unpredictable, chaotic, and dazzling. The Critters returned, scattered across shattered dimensions, tasked with reigniting the flame of civilization after the Great Fragmentation.

  Though they appear simple, something stirs within them: glimmers of thought, crude morality, a sense of kinship. They build, explore, evolve.

  But woven into the very strands of their being lies a silent risk.

  Not a villain.
  Not a curse.
  A possibility.

  The Seed of Malice, a genetic echo from a forgotten origin, lives inside every Critter. Sometimes inert. Sometimes... not. Its awakening isn’t destiny—it’s probability.

  Each new Critter summoned tips the scales.

  Will they thrive as stewards of harmony?
  Or will the Seed bloom, pulling them toward darkness?

  The Oracle does not interfere.
  It watches.
  And the game has begun.`;

const Home = () => {

  const { isAuthenticated, user, backend, login } = useSession();
  const [regiterInvite, setRegisterInvite] = useState(false);
  const [textMintButton, setTextMintButton] = useState("¡Bring your own Critter to life!");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Auto-play audio al montar el componente
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay bloqueado por el navegador. El usuario debe interactuar primero.", err);
      });
    }
  }, []);

  const togglePlayLore = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.play().catch(err => console.error("Play error:", err));
      } else {
        audio.pause();
      }
    }
  };

  const handleClickMint = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!user) {
      setRegisterInvite(true);
      setRegisterInvite(true)
      return
    }
    setTextMintButton("Minting");
    const mintResult = await backend.mintCritter({ genomeLength: BigInt(4 * 1024), transactionId: BigInt(0) });
    if("Err" in mintResult) {
      if( mintResult. Err === 'The Caller is minting a Critter right now'){
        setTextMintButton("Minting!!!");
      }
    } else {
      setTextMintButton("¡Bring your own Critter to life!")
    }
    console.log("Mint result:", mintResult);
  }
  return (
    <div className="space-y-10 flex flex-col items-center mt-10 w-full overflow-x-hidden">
      <section className="p-12 animate-float custom-scrollbar bg-gradient-to-r from-[#000000cc] to-[#223399dd] text-white p-8 rounded-2xl shadow-2xl max-w-xl mx-auto h-100 overflow-y-auto">
        <div className="flex flex-col items-center mb-2">
          <h3 className="text-[22px] font-bold mb-3">
            The Awakening of the Critters
          </h3>
          <button onClick={togglePlayLore} className="cursor-pointer w-20">🔊 </button>
        </div>
        <p className="text-[16px] whitespace-pre-line leading-relaxed mb-2">
          {critterLore}
        </p>

      </section>

      {/* Top Critters */}
      <section>
        {/* <h2 className="text-3xl font-semibold mb-6">🏆 Critters Destacados</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* {mockTopCritters.map((critter) => (
            <Card key={critter.id} className="bg-white rounded-2xl shadow-md">
              <CardContent className="p-4 space-y-2">
                <img
                  src={critter.image}
                  alt={critter.name}
                  className="rounded-xl w-full h-40 object-cover"
                />
                <h3 className="text-xl font-bold">{critter.name}</h3>
                <p className="text-sm text-gray-500">Rareza: {critter.rarity}</p>
                <p className="text-sm text-gray-500">Poder: {critter.power}</p>
              </CardContent>
            </Card>
          ))} */}
        </div>
      </section>
      <div 
        className="flex w-[330px] text-lg text-white mt-12 p-4 rounded-xl animate-heartbeat bg-[#022469d0] hover:bg-[#123479] transition duration-300 shadow-lg cursor-pointer"
        onClick={handleClickMint}
      >
        <button>
          <div></div>
          🔥 {textMintButton}
        </button>
        {/* <div className="bg-[#555555] h-4 w-4 rounded-full bor"></div>  //Spinner */}
      </div>

      {regiterInvite && (<>
        <div onClick={() => setRegisterInvite(false)} className="fixed inset-0 flex items-center justify-center"></div>
        <div className="w-[300px] mx-auto bg-[#0c0c2fee] text-gray-300 p-2  text-lg text-center cursor-pointer rounded-lg">
          Please register to be able to mint your Critter
        </div>
      </>
      )}
      <audio ref={audioRef} src="/Lore.en.mp3" preload="auto" />
      <div className="flex-col items-center justify-center w-200 h-200">

        {/* <Critter points={new Array(5000).fill(1).map(() =>
          new THREE.Vector3().randomDirection().multiplyScalar(
            Math.random() * 0.5 + 9.5
          )
        )}/> */}
        {/* <Critter data={new Uint8Array([])} /> */}

      </div>
    </div>
  );
};

export default Home;

