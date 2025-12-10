export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold mb-4">
          Bienvenue sur notre Plateforme E-Commerce
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Découvrez notre sélection de produits de qualité
        </p>
        <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
          Découvrir les produits
        </button>
      </div>
    </section>
  )
}

