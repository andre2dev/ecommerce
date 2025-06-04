from flask_restx import Namespace, Resource, fields
from ..Models.CartModel import Cart as CartModel
from flask import jsonify, request
from .products import product_model
from ..Controller.CartController import update_cart

cart_ns = Namespace('Cart', description='Cart operations')
cart_model = cart_ns.model('cart',  {
    "code": fields.String(description='cart unique code - acts as a identifier'),
    "created_at": fields.DateTime(description='Cart creation timestamp'),
    "id": fields.String(description='cart internal id'),
    "products": fields.List(fields.Nested(product_model), description='List of products'),
    "updated_at": fields.DateTime(description='Cart update timestamp')
})

carts_model = cart_ns.model('carts',  {
  "carts": fields.Nested(cart_model, description='Carts')
})

product_cart_model = cart_ns.model('Product_cart', {
      "amount": fields.Float(description='Price of product'),
      "id": fields.Integer(description='Product id'),
      "quantity": fields.Integer(description='Product quantity'),
      "thumbnailUrl": fields.String(description='Product thumbnail URL'),
      "title": fields.String(description='Product title (or names)'),
      "unitPrice": fields.Float(description='Product unity price')

    })

cart_update_model = cart_ns.model('cart_update',  {
    "code": fields.String(description='cart unique code - acts as a identifier'),
    "created_at": fields.DateTime(description='Cart creation timestamp'),
    "id": fields.String(description='cart internal id'),
    "products": fields.List(fields.Nested(product_cart_model), description='List of products'),
    "updated_at": fields.DateTime(description='Cart update timestamp')
})


@cart_ns.route('/cart')
class CartsList(Resource):
    
    @cart_ns.response(200, 'Success', carts_model)
    @cart_ns.response(500, 'Internal Server Error')
    def get(self):
        '''Returns a list of carts'''
        carts = CartModel.query.all()
        return jsonify({'carts': c.serialized for c in carts})
    

@cart_ns.route('/cart/<cart_code>')
@cart_ns.param('cart_code', 'Cart unique code')
class CartGetUpdate(Resource):
    @cart_ns.response(200, 'Success', cart_model)
    @cart_ns.response(400, 'No input data provided')
    @cart_ns.response(500, 'Internal Server Error')

    def get(self, cart_code):
        '''Returns details of a cart'''
        cart = CartModel.query.filter(CartModel.code == cart_code).one()
        return jsonify(cart.serialized)
    


    @cart_ns.expect(cart_update_model, validate=True) # payload model
    def put(self, cart_code):
        '''Updates a cart'''
        try:
            payload = request.get_json()
            if not payload:
                return {'message': 'No input data provided'}, 400
            result = update_cart(payload, cart_code)
            return result, 200
        except Exception as e:
            return {'message': str(e)}, 500