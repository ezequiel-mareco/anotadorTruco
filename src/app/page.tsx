"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";

export default function Home() {
  const router = useRouter();

  const [equipo1, setEquipo1] = useState("");
  const [equipo2, setEquipo2] = useState("");
  const [limite, setLimite] = useState(30);

  function comenzarPartida() {
    const partida = {
      equipo1,
      equipo2,
      limite,
    };

    sessionStorage.setItem("partida", JSON.stringify(partida));
    router.push("/anotador");
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center ">
      <div className="flex w-full max-w-md flex-col rounded-xl bg-black/40 p-8 backdrop-blur">
        <h1 className="mb-6 text-center text-4xl font-bold text-white">Anotador de Truco</h1>
        <h2 className="mt-4">Ingresa los nombres de los equipos: (opcional)</h2>
        <input
          className="mt-2 rounded border p-2 text-black"
          maxLength={15}
          placeholder="Nombre equipo 1"
          value={equipo1}
          onChange={(e) => setEquipo1(e.target.value)}
        />
        <span className="mt-1 text-right text-xs text-gray-300">{equipo1.length}/15</span>

        <input
          className="mt-4 rounded border p-2 text-black"
          maxLength={15}
          placeholder="Nombre equipo 2"
          value={equipo2}
          onChange={(e) => setEquipo2(e.target.value)}
        />
        <span className="mt-1 text-right text-xs text-gray-300">{equipo2.length}/15</span>

        <h2 className="mt-4">Selecciona el límite de puntos:</h2>
        <RadioGroup value={limite.toString()} onValueChange={(value) => setLimite(Number(value))}>
          <div className="mt-2 flex items-center space-x-2">
            <RadioGroupItem id="15" value="15" />
            <label htmlFor="15">15 puntos</label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem id="30" value="30" />
            <label htmlFor="30">30 puntos</label>
          </div>
        </RadioGroup>
        <Button className="mt-8" onClick={comenzarPartida}>
          Comenzar partida
        </Button>
      </div>
    </section>
  );
}
