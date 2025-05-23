import pytest
from app import create_app, db
from app.models import User, Producto
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        user = User(username='test')
        user.set_password('1234')
        db.session.add(user)
        db.session.commit()
        yield app.test_client()

def get_auth_header(client):
    with client.application.app_context():
        user = User.query.filter_by(username='test').first()
        token = create_access_token(identity=user.id)
    return {'Authorization': f'Bearer {token}'}

def test_crud_productos(client):
    headers = get_auth_header(client)

    # Crear producto
    rv = client.post('/api/productos', json={'nombre': 'Leche', 'codigo_barras': '123456'}, headers=headers)
    assert rv.status_code == 201

    # Listar productos
    rv = client.get('/api/productos', headers=headers)
    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) == 1

    # Actualizar producto
    prod_id = data[0]['id']
    rv = client.put(f'/api/productos/{prod_id}', json={'nombre': 'Leche Entera'}, headers=headers)
    assert rv.status_code == 200

    # Eliminar producto
    rv = client.delete(f'/api/productos/{prod_id}', headers=headers)
    assert rv.status_code == 200
