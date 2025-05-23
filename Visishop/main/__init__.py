from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt, cors, csrf
from .routes import main_bp
from .auth import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)
    csrf.init_app(app)

    # Registrar blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(main_bp, url_prefix='/api')

    return app
