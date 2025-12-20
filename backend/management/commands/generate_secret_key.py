"""
Commande Django pour générer une SECRET_KEY sécurisée.
Usage: python manage.py generate_secret_key
"""
import os
from django.core.management.base import BaseCommand
import secrets
import string


class Command(BaseCommand):
    help = 'Génère une SECRET_KEY Django sécurisée'

    def add_arguments(self, parser):
        parser.add_argument(
            '--length',
            type=int,
            default=50,
            help='Longueur de la clé (défaut: 50)',
        )
        parser.add_argument(
            '--output',
            type=str,
            help='Fichier de sortie (ex: .env)',
        )

    def handle(self, *args, **options):
        length = options['length']
        output_file = options.get('output')
        
        # Générer une clé sécurisée
        chars = string.ascii_letters + string.digits + string.punctuation
        # Exclure les caractères qui peuvent poser problème dans les variables d'environnement
        chars = chars.replace("'", '').replace('"', '').replace('\\', '').replace('$', '')
        secret_key = ''.join(secrets.choice(chars) for _ in range(length))
        
        self.stdout.write(self.style.SUCCESS('\n✅ SECRET_KEY générée avec succès:\n'))
        self.stdout.write(secret_key)
        self.stdout.write('\n')
        
        if output_file:
            try:
                # Lire le fichier existant s'il existe
                env_content = ''
                if os.path.exists(output_file):
                    with open(output_file, 'r') as f:
                        env_content = f.read()
                
                # Mettre à jour ou ajouter SECRET_KEY
                lines = env_content.split('\n')
                updated = False
                new_lines = []
                
                for line in lines:
                    if line.startswith('SECRET_KEY='):
                        new_lines.append(f'SECRET_KEY={secret_key}')
                        updated = True
                    else:
                        new_lines.append(line)
                
                if not updated:
                    # Ajouter à la fin si pas trouvé
                    if new_lines and new_lines[-1]:
                        new_lines.append('')
                    new_lines.append(f'SECRET_KEY={secret_key}')
                
                # Écrire le fichier
                with open(output_file, 'w') as f:
                    f.write('\n'.join(new_lines))
                
                self.stdout.write(
                    self.style.SUCCESS(f'✅ SECRET_KEY ajoutée dans {output_file}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'❌ Erreur lors de l\'écriture dans {output_file}: {e}')
                )
        else:
            self.stdout.write(
                self.style.WARNING(
                    '\n💡 Pour sauvegarder dans un fichier .env, utilisez:\n'
                    f'   python manage.py generate_secret_key --output .env\n'
                )
            )
        
        self.stdout.write(
            self.style.WARNING(
                '\n⚠️  IMPORTANT: Ne partagez JAMAIS cette clé publiquement!\n'
                '   - Ajoutez .env à .gitignore (déjà fait)\n'
                '   - Ne commitez JAMAIS le fichier .env\n'
                '   - Utilisez des variables d\'environnement en production\n'
            )
        )

        

