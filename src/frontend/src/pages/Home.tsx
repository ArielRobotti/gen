
import { useSession } from "../context/sessionContext";
import { useEffect, useRef } from "react";
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

      return;
    }
    const mintResult = await backend.mintCritter({ genomeLength: BigInt(46), transactionId: BigInt(0) });
    console.log("Mint result:", mintResult);
  }
  return (
    <div className="p-6 space-y-10 flex flex-col items-center">
      {/* Lore Section */}
      <section className="animate-float custom-scrollbar bg-gradient-to-r from-gray-900 to-blue-900 text-white p-8 rounded-2xl shadow-2xl max-w-xl mx-auto h-100 overflow-y-auto">
        <h3 className="text-[22px] text-center font-bold mb-4 flex items-center gap-2">
          {/* <Sparkles className="w-6 h-6 text-yellow-400" /> */}
          The Awakening of the Critters
          <button onClick={togglePlayLore}>🔊 </button>
        </h3>

        <p className="text-[14px] whitespace-pre-line leading-relaxed">
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

      {/* Call to Action */}
      <div className="text-center mt-12">
        <button
          className="text-lg text-white px-6 py-3 rounded-xl animate-heartbeat bg-[#022469d0]"
          onClick={handleClickMint}
        >
          🔥 ¡Crea tu propio Critter ahora!
        </button>
      </div>
      <audio ref={audioRef} src="/Lore.en.mp3" preload="auto" />
    </div>
  );
};

export default Home;

