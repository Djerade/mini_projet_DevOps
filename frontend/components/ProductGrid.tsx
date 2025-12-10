'use client'

import { useState } from 'react'

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Produit Premium',
    price: 99.99,
    image: 'https://via.placeholder.com/300x300?text=Produit+1',
    description: 'Description du produit premium',
  },
  {
    id: 2,
    name: 'Produit Standard',
    price: 49.99,
    image: 'https://via.placeholder.com/300x300?text=Produit+2',
    description: 'Description du produit standard',
  },
  {
    id: 3,
    name: 'Produit Économique',
    price: 29.99,
    image: 'https://via.placeholder.com/300x300?text=Produit+3',
    description: 'Description du produit économique',
  },
  {
    id: 4,
    name: 'Produit Deluxe',
    price: 149.99,
    image: 'https://via.placeholder.com/300x300?text=Produit+4',
    description: 'Description du produit deluxe',
  },
]

export default function ProductGrid() {
  const [products] = useState<Product[]>(mockProducts)

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        Nos Produits
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">
                  {product.price.toFixed(2)} €
                </span>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

