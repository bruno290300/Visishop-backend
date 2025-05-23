from flask import Blueprint, request, jsonify
from .models import User
from .extensions import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'msg': 'Faltan datos'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'msg': 'Usuario ya existe'}), 409

    user = User(username=data['username'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({'msg': 'Usuario creado'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'msg': 'Faltan datos'}), 400

    user = User.query.filter_by(username=data['username']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'msg': 'Usuario o contraseña incorrectos'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({'token': access_token}), 200

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({'id': user.id, 'username': user.username}), 200
