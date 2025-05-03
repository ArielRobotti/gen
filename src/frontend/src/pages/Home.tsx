import React from "react";
import { useSession } from "../context/sessionContext";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Sparkles } from "lucide-react";

const critterLore = `Luego de un largo letargo, en los confines del vacío primordial, un grupo minúsculo de Critters despertó con la ayuda de un oráculo misterioso. Este ser, cuya existencia trasciende las leyes del tiempo y la materia, activó un antiguo mecanismo olvidado: la Matriz Génesis.

De este mecanismo brotó una nueva oleada de vida, caótica y fascinante, con el propósito de repoblar los múltiples planos del multiverso devastado tras la Gran Fragmentación.

Los nuevos Critters, aunque primitivos en apariencia, traen consigo destellos de conciencia: valores morales rudimentarios, una chispa de empatía hacia el prójimo, y una incipiente noción de comunidad. Viven dispersos por realidades alternativas, reconstruyendo civilizaciones, experimentando, creciendo.

Sin embargo, no todo es luz.

Muy oculto en su genoma permanece la Semilla de la Maldad, un residuo oscuro de su antepasado olvidado: el Critter Zero. Esta semilla late, silenciosa, esperando las condiciones adecuadas para germinar.

El equilibrio pende de un hilo. A medida que más Critters son invocados, el multiverso se aproxima a una bifurcación: ¿evolucionarán como guardianes de la armonía... o como heraldos del caos?

El oráculo observa. El juego ha comenzado.`;

const Home = () => {

  const { isAuthenticated, user, backend, login } = useSession();
  const handleClickMint = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!user) {
      
      return;
    }
    const mintResult = await backend.mintCritter({genomeLength: BigInt(46), transactionId: BigInt(0)});
    console.log("Mint result:", mintResult);
  }
  return (
    <div className="p-6 space-y-10 flex flex-col items-center">
      {/* Lore Section */}
      <section className="animate-float custom-scrollbar bg-gradient-to-r from-gray-900 to-blue-900 text-white p-8 rounded-2xl shadow-2xl max-w-xl mx-auto h-100 overflow-y-auto">
        <h3 className="text-[22px] text-center font-bold mb-4 flex items-center gap-2">
          {/* <Sparkles className="w-6 h-6 text-yellow-400" /> */}
          El Despertar de los Critters
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
          className="text-lg text-white px-6 py-3 rounded-2xl animate-heartbeat"
          onClick={handleClickMint}
        >
          🔥 ¡Crea tu propio Critter ahora!
        </button>
      </div>
    </div>
  );
};

export default Home;

