"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Swal from "sweetalert2";

import {Button} from "@/components/ui/button";

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
      showFosforos(decider, counter1 + 1);
      if (counter1 == limite - 1) {
        showWinner(decider);
      }
    }

    if (decider == 2 && counter2 < limite) {
      setCounter2((c) => c + 1);
      showFosforos(decider, counter2 + 1);
      if (counter2 == limite - 1) {
        showWinner(decider);
      }
    }
  }

  function subtraction(decider: number) {
    if (decider == 1 && counter1 > 0) {
      setCounter1((c) => c - 1);
      showFosforos(decider, counter1 - 1);
    }

    if (decider == 2 && counter2 > 0) {
      setCounter2((c) => c - 1);
      showFosforos(decider, counter2 - 1);
    }
  }

  function restart() {
    setCounter1(0);
    showFosforos(1, 0);
    setCounter2(0);
    showFosforos(2, 0);
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

  function showFosforos(decider: number, counter: number) {
    const container1 = document.getElementById("imageContainer1");
    const container2 = document.getElementById("imageContainer2");

    if (decider == 1) {
      const gruposNow1 = container1?.querySelectorAll(".group");

      gruposNow1?.forEach((g) => container1?.removeChild(g));

      let group;

      for (let i = 0; i < counter; i++) {
        if (i % 5 === 0) {
          group = document.createElement("div");
          group.classList.add("group");
          container1?.appendChild(group);
        }
        const newFosforo = document.createElement("img");

        newFosforo.src = "/fosforo.png";
        newFosforo.classList.add("fosforo" + ((i % 5) + 1));
        group?.appendChild(newFosforo);
      }
    } else if (decider == 2) {
      const gruposNow2 = container2?.querySelectorAll(".group");

      gruposNow2?.forEach((g) => container2?.removeChild(g));

      let group;

      for (let i = 0; i < counter; i++) {
        if (i % 5 === 0) {
          group = document.createElement("div");
          group.classList.add("group");
          container2?.appendChild(group);
        }
        const newFosforo = document.createElement("img");

        newFosforo.src = "/fosforo.png";
        newFosforo.classList.add("fosforo" + ((i % 5) + 1));
        group?.appendChild(newFosforo);
      }
    }
  }

  return (
    <main className="flex justify-center">
      <section className="flex flex-col items-center justify-center bg-[url(/texturaPapelMarron.png)] bg-cover">
        <div className="flex h-[780px] justify-center space-x-10">
          <section className="space-y-5 p-5">
            <div className="text-center font-serif text-2xl font-semibold italic text-slate-900">
              <p>
                {equipo1}: {counter1}
              </p>
            </div>
            <div className="space-x-5">
              <Button
                className="bg-[#cfa005] font-serif font-bold italic hover:bg-[#b48b03]"
                onClick={() => addition(1)}
              >
                Sumar puntos
              </Button>
              <Button
                className="bg-[#cfa005] font-serif font-bold italic hover:bg-[#b48b03]"
                onClick={() => subtraction(1)}
              >
                Restar puntos
              </Button>
            </div>
            <div id="imageContainer1" />
          </section>
          <div className="w-1 justify-center rounded bg-black md:h-[630px] md:translate-y-[130px]" />
          <section className="space-y-5 p-5">
            <div className="text-center font-serif text-2xl font-semibold italic text-slate-900">
              <p>
                {equipo2}: {counter2}
              </p>
            </div>
            <div className="space-x-5">
              <Button
                className="bg-[#cfa005] font-serif font-bold italic hover:bg-[#b48b03]"
                onClick={() => addition(2)}
              >
                Sumar puntos
              </Button>
              <Button
                className="bg-[#cfa005] font-serif font-bold italic hover:bg-[#b48b03]"
                onClick={() => subtraction(2)}
              >
                Restar puntos
              </Button>
            </div>
            <div id="imageContainer2" />
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
