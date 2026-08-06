"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Swal from "sweetalert2";

import {Button} from "@/components/ui/button";

type GrupoFosforosProps = {
  cantidad: number;
};

function GrupoFosforos({cantidad}: GrupoFosforosProps) {
  return (
    <div className="group">
      {Array.from({length: cantidad}).map((_, i) => (
        <img key={i} alt="Fósforo" className={`fosforo${i + 1}`} src="/fosforo.png" />
      ))}
    </div>
  );
}

function renderFosforos(counter: number) {
  const grupos = [];

  for (let i = 0; i < counter; i += 5) {
    grupos.push(<GrupoFosforos key={i} cantidad={Math.min(5, counter - i)} />);
  }

  return grupos;
}

export default function HomePage() {
  const router = useRouter();

  const [cargando, setCargando] = useState(true);

  const [limite, setLimite] = useState(30);
  const [equipo1, setEquipo1] = useState("Nosotros");
  const [equipo2, setEquipo2] = useState("Ellos");

  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);

  useEffect(() => {
    const partidaGuardada = sessionStorage.getItem("partida");

    if (!partidaGuardada) {
      router.push("/");

      return;
    }

    try {
      const partida = JSON.parse(partidaGuardada);

      setEquipo1(partida.equipo1 || "Nosotros");
      setEquipo2(partida.equipo2 || "Ellos");

      const limiteGuardado = Number(partida.limite);

      if (limiteGuardado === 15 || limiteGuardado === 30) {
        setLimite(limiteGuardado);
      }

      setCargando(false);
    } catch {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (cargando) return;

    sessionStorage.setItem(
      "partida",
      JSON.stringify({
        equipo1,
        equipo2,
        limite,
        counter1,
        counter2,
      }),
    );
  }, [equipo1, equipo2, limite, counter1, counter2, cargando]);

  function addition(decider: number) {
    if (decider == 1 && counter1 < limite) {
      setCounter1((c) => c + 1);

      if (counter1 == limite - 1) {
        showWinner(decider);
      }
    }

    if (decider == 2 && counter2 < limite) {
      setCounter2((c) => c + 1);

      if (counter2 == limite - 1) {
        showWinner(decider);
      }
    }
  }

  function subtraction(decider: number) {
    if (decider == 1 && counter1 > 0) {
      setCounter1((c) => c - 1);
    }

    if (decider == 2 && counter2 > 0) {
      setCounter2((c) => c - 1);
    }
  }

  function restart() {
    setCounter1(0);
    setCounter2(0);
  }

  function showWinner(decider: number) {
    if (decider == 1) {
      Swal.fire({
        title: "Felicidades!",
        text: `El ganador ha sido: ${equipo1}.`,
        icon: "success",
      });
    }
    if (decider == 2) {
      Swal.fire({
        title: "Felicidades!",
        text: `El ganador ha sido: ${equipo2}.`,
        icon: "success",
      });
    }
  }

  return (
    <main className="flex justify-center">
      <section className="flex flex-col items-center justify-center bg-[url(/texturaPapelMarron.png)] bg-cover">
        <div className="grid h-screen grid-cols-[1fr_2px_1fr]">
          <section className="w-full max-w-md space-y-5 p-5">
            <div className="text-center font-serif text-2xl font-semibold italic text-slate-900">
              <p>{equipo1}:</p>
              <p>{counter1}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                className="h-12 w-12 bg-[#cfa005] text-3xl font-bold hover:bg-[#b48b03]"
                onClick={() => addition(1)}
              >
                +
              </Button>
              <Button
                className="h-12 w-12 bg-[#cfa005] text-3xl font-bold hover:bg-[#b48b03]"
                onClick={() => subtraction(1)}
              >
                -
              </Button>
            </div>
            <div className="flex flex-col items-center">{renderFosforos(counter1)}</div>
          </section>
          <div className="w-[3px] self-stretch bg-black" />
          <section className="w-full max-w-md space-y-5 p-5">
            <div className="text-center font-serif text-2xl font-semibold italic text-slate-900">
              <p>{equipo2}:</p>
              <p>{counter2}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                className="h-12 w-12 bg-[#cfa005] text-3xl font-bold hover:bg-[#b48b03]"
                onClick={() => addition(2)}
              >
                +
              </Button>
              <Button
                className="h-12 w-12 bg-[#cfa005] text-3xl font-bold hover:bg-[#b48b03]"
                onClick={() => subtraction(2)}
              >
                -
              </Button>
            </div>
            <div className="flex flex-col items-center">{renderFosforos(counter2)}</div>
          </section>
        </div>
        <div className="m-4">
          <Button
            className="bg-[#cfa005] px-8 font-serif font-bold italic hover:bg-[#b48b03]"
            onClick={() => restart()}
          >
            Reiniciar
          </Button>
        </div>
      </section>
    </main>
  );
}
