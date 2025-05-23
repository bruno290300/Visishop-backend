from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.voz import transcribir_audio
from .models import Producto
from .extensions import db


main_bp = Blueprint('main', __name__)

routes_bp = Blueprint('routes', __name__)



@routes_bp.route('/transcribir_voz', methods=['POST'])
def transcribir_voz():
    if 'audio' not in request.files:
        return jsonify({'error': 'No se recibió archivo de audio'}), 400
    audio_file = request.files['audio']
    try:
        texto = transcribir_audio(audio_file)
        return jsonify({'texto': texto})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@main_bp.route('/productos', methods=['GET'])
@jwt_required()
def listar_productos():
    productos = Producto.query.all()
    return jsonify([{'id': p.id, 'nombre': p.nombre, 'codigo_barras': p.codigo_barras} for p in productos])



@main_bp.route('/productos/<int:id>', methods=['GET'])
@jwt_required()
def obtener_producto(id):
    p = Producto.query.get_or_404(id)
    return jsonify({'id': p.id, 'nombre': p.nombre, 'codigo_barras': p.codigo_barras})



@main_bp.route('/productos', methods=['POST'])
@jwt_required()
def crear_producto():
    data = request.get_json()
    if not data or not data.get('nombre') or not data.get('codigo_barras'):
        return jsonify({'msg': 'Faltan datos'}), 400

    if Producto.query.filter_by(codigo_barras=data['codigo_barras']).first():
        return jsonify({'msg': 'Producto con ese código ya existe'}), 409

    p = Producto(nombre=data['nombre'], codigo_barras=data['codigo_barras'])
    db.session.add(p)
    db.session.commit()
    return jsonify({'msg': 'Producto creado', 'id': p.id}), 201


@main_bp.route('/productos/<int:id>', methods=['PUT'])
@jwt_required()
def actualizar_producto(id):
    p = Producto.query.get_or_404(id)
    data = request.get_json()
    if not data:
        return jsonify({'msg': 'No hay datos para actualizar'}), 400

    if 'nombre' in data:
        p.nombre = data['nombre']
    if 'codigo_barras' in data:
        if Producto.query.filter(Producto.codigo_barras == data['codigo_barras'], Producto.id != id).first():
            return jsonify({'msg': 'Código de barras ya usado por otro producto'}), 409
        p.codigo_barras = data['codigo_barras']

    db.session.commit()
    return jsonify({'msg': 'Producto actualizado'})


@main_bp.route('/productos/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_producto(id):
    p = Producto.query.get_or_404(id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'msg': 'Producto eliminado'})



