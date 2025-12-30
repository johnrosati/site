import React from "react";
import Button from "./Button";

const FilmSynopsis = () => (
  <div className="bg-paper text-ink">
    <div className="p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">
        {/* Media */}
        <div className="lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5 bg-paper">
            <video
              src={process.env.PUBLIC_URL + "/videos/video3.mp4"}
              poster="https://via.placeholder.com/1200x675"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto block"
            />
          </div>
        </div>

        {/* Copy */}
        <div>
          <header className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              River of Days
            </h1>

            {/* Lede: one strong sentence instead of centered multi-paragraph copy */}
            <p className="text-base sm:text-lg leading-relaxed text-ink/80 max-w-prose">
              A contemplative short film weaving three generations in a small riverside
              town—fleeting beauty, ordinary regrets, and the quiet ways time changes us.
            </p>
          </header>

          <div className="mt-6 space-y-5 text-sm sm:text-base leading-relaxed text-ink/90 max-w-prose">
            <p>
              The film opens with Kenji, an elderly man in his late 70s, who spends his
              days fishing. Each cast triggers memories of tenderness, regret, and dreams
              unfulfilled.
            </p>

            <p>
              Parallel to Kenji’s story is Aya, a young woman in her late 20s, who has
              returned home, discovering that life’s imperfections provide meaning.
            </p>

            <p>
              Interspersed is Yuta, a boy of ten, whose summer days by the river with his
              dog, Momo, mark his first brush with mortality.
            </p>

            <p>
              Their stories culminate in a poignant moment by the river, where past,
              present, and future converge.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              href="https://twitter.com/riverofdays"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              Follow River of Days on X
            </Button>
          </div>
          <div className="mt-10 max-w-prose">
            <figure className="group overflow-hidden rounded-xl ring-1 ring-black/5 bg-paper">
              <img
                src={process.env.PUBLIC_URL + "/RODposter.jpg"}
                alt="River of Days film poster"
                className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FilmSynopsis;
