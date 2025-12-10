# Backend E-Commerce - Django REST Framework

API REST pour le projet E-Commerce, construite avec Django et Django REST Framework.

## 🚀 Démarrage rapide

### Installation des dépendances

```bash
pip install -r requirements.txt
```

### Configuration de la base de données

1. Créez un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

2. Configurez les variables d'environnement dans `.env`

### Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Créer un superutilisateur

```bash
python manage.py createsuperuser
```

### Lancer le serveur de développement

```bash
python manage.py runserver
```

L'API sera accessible sur `http://localhost:8000`

## 📁 Structure du projet

```
backend/
├── ecommerce/          # Configuration du projet Django
│   ├── settings.py     # Paramètres Django
│   ├── urls.py         # URLs principales
│   └── wsgi.py         # Configuration WSGI
├── api/                # Application API
│   ├── models.py       # Modèles (Category, Product, Order)
│   ├── serializers.py  # Sérialiseurs DRF
│   ├── views.py        # Vues API (ViewSets)
│   ├── urls.py         # URLs de l'API
│   └── admin.py        # Configuration admin Django
├── manage.py           # Script de gestion Django
└── requirements.txt    # Dépendances Python
```

## 🛠️ Technologies

- **Django 4.2** - Framework web Python
- **Django REST Framework** - Framework pour APIs REST
- **PostgreSQL** - Base de données
- **django-cors-headers** - Gestion CORS
- **psycopg2** - Driver PostgreSQL

## 📝 Modèles de données

### Category
- name, description

### Product
- name, description, price, category, image, stock, is_active

### Order
- user, status, total_amount, items

### OrderItem
- order, product, quantity, price

## 🔌 Endpoints API

### Categories
- `GET /api/categories/` - Liste des catégories
- `POST /api/categories/` - Créer une catégorie
- `GET /api/categories/{id}/` - Détails d'une catégorie
- `PUT/PATCH /api/categories/{id}/` - Modifier une catégorie
- `DELETE /api/categories/{id}/` - Supprimer une catégorie

### Products
- `GET /api/products/` - Liste des produits
- `GET /api/products/?category={id}` - Produits par catégorie
- `POST /api/products/` - Créer un produit
- `GET /api/products/{id}/` - Détails d'un produit
- `PUT/PATCH /api/products/{id}/` - Modifier un produit
- `DELETE /api/products/{id}/` - Supprimer un produit

### Orders
- `GET /api/orders/` - Liste des commandes (utilisateur connecté)
- `POST /api/orders/` - Créer une commande
- `GET /api/orders/{id}/` - Détails d'une commande
- `POST /api/orders/{id}/add_item/` - Ajouter un article à la commande

### Users
- `GET /api/users/` - Liste des utilisateurs
- `GET /api/users/{id}/` - Détails d'un utilisateur

## 🔐 Authentification

L'API utilise l'authentification par session Django. Pour l'authentification :
- Connectez-vous via `/admin/` ou
- Utilisez l'authentification par token (à configurer si nécessaire)

## 🐳 Docker

Le projet est configuré pour fonctionner avec Docker Compose. Voir `docker-compose.yml` à la racine du projet.

## 📚 Documentation

La documentation interactive de l'API est disponible via Django REST Framework :
- Accédez à `/api/` pour voir les endpoints disponibles

