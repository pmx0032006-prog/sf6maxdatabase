type CharacterDetailHeaderProps = {
  en: string;
  ja: string;
};

export function CharacterDetailHeader({ en, ja }: CharacterDetailHeaderProps) {
  return (
    <section className="bg-[#0a0f0c] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-10 sm:px-5 sm:py-12 lg:px-6">
        <h1 className="font-display text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-7xl">
          {en}
        </h1>
        <p className="mt-3 text-base text-white/50 sm:text-lg">{ja}</p>
      </div>
    </section>
  );
}
