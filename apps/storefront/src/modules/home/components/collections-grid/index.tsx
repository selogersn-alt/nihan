import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading } from "@modules/common/components/ui"

const collectionsList = [
  {
    title: "Soin & Cosmétiques",
    subtitle: "L'excellence dermatologique",
    description: "Des formules épurées et des outils de beauté pensés pour magnifier votre éclat naturel.",
    image: "/images/skincare.png",
    link: "/categories/beauty",
    cta: "Découvrir la Beauté",
  },
  {
    title: "Loungewear & Bain",
    subtitle: "La douceur du satin",
    description: "Des matières nobles et soyeuses pour habiller vos moments d'intimité d'une élégance sans effort.",
    image: "/images/loungewear.png",
    link: "/categories/loungewear",
    cta: "Découvrir le Vestiaire",
  },
  {
    title: "Joyaux & Accessoires",
    subtitle: "L'éclat du minimalisme",
    description: "Des détails précieux et durables conçus pour sculpter votre signature stylistique au quotidien.",
    image: "/images/jewelry.png",
    link: "/categories/accessories",
    cta: "Découvrir la Joaillerie",
  },
]

export default function CollectionsGrid() {
  return (
    <div className="bg-[#FAF9F5] py-20 small:py-32 border-b border-[#EAE6DF]">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16 small:mb-24 space-y-4">
          <span className="text-[10px] small:text-xs tracking-[0.4em] text-[#88857E] font-semibold uppercase block">
            Maison NIHAN
          </span>
          <Heading
            level="h2"
            className="font-serif text-3xl small:text-5xl font-light text-[#1A1A1A] tracking-[0.1em] uppercase"
          >
            L'Univers Privé
          </Heading>
          <div className="w-10 h-[1px] bg-[#88857E] mx-auto my-4" />
          <p className="font-sans text-xs small:text-sm text-[#6E6B64] tracking-wide leading-relaxed">
            Une sélection rigoureuse d'essentiels haut de gamme façonnés pour sublimer chaque instant de votre quotidien.
          </p>
        </div>

        {/* Collections Cards Grid */}
        <div className="grid grid-cols-1 small:grid-cols-3 gap-8 small:gap-12">
          {collectionsList.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col justify-between bg-white border border-[#EAE6DF] hover:shadow-xl transition-all duration-500 ease-in-out p-6 rounded-none relative overflow-hidden"
            >
              <div className="space-y-6">
                {/* Image Container */}
                <div className="w-full aspect-[4/5] overflow-hidden bg-[#FAF9F5] border border-[#EAE6DF] relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-[0.02] group-hover:bg-opacity-0 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <span className="text-[9px] tracking-[0.3em] text-[#88857E] font-medium uppercase block">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif text-xl small:text-2xl font-light text-[#1A1A1A] tracking-wider uppercase">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-[#6E6B64] tracking-wide leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="mt-8 pt-4 border-t border-[#F2EDE4]">
                <LocalizedClientLink
                  href={item.link}
                  className="inline-block text-[10px] font-bold tracking-[0.25em] text-[#1A1A1A] uppercase border-b border-[#1A1A1A] pb-1 hover:opacity-75 transition-opacity"
                >
                  {item.cta}
                </LocalizedClientLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
