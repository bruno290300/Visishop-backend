from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_wtf import CSRFProtect

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()
csrf = CSRFProtect()
