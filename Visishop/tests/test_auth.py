import pytest
from app import create_app, db
from app.models import User

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def test_register_login(client):
    # Registro
    rv = client.post('/auth/register', json={'username': 'test', 'password': '1234'})
    assert rv.status_code == 201

    # Login
    rv = client.post('/auth/login', json={'username': 'test', 'password': '1234'})
    assert rv.status_code == 200
    assert 'token' in rv.get_json()
