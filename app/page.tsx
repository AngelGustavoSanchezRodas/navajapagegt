import { BackgroundGlow } from "@/shared/components/ui/BackgroundGlow";
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4">
      <BackgroundGlow
        color="turquoise"
        className="left-[-10%] top-[-10%] h-[32rem] w-[32rem]"
      />
      <BackgroundGlow
        color="magenta"
        className="right-[-10%] top-[20%] h-[24rem] w-[24rem]"
      />
      <BackgroundGlow
        color="mustard"
        className="bottom-[-10%] left-[20%] h-[16rem] w-[16rem]"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center pt-40 text-center">
        <h1 className="max-w-3xl text-5xl font-semibold text-slate-900">
          Crea, comparte y gestiona enlaces con una experiencia más limpia.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-slate-500">
          Pega tu URL y genera al instante un enlace corto y código QR. Sin
          registros obligatorios.
        </p>
        <div id="tool-container" className="my-16 w-full"></div>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-slate-900">
            Herramientas Destacadas
          </h2>
          <p className="text-slate-500">
            Descubre utilidades clave para acortar, compartir y gestionar tus
            enlaces en un solo lugar.
          </p>
        </div>
        <div className="mt-10 w-full">
          <FeaturesGrid />
        </div>
      </section>
    </main>
  );
}
