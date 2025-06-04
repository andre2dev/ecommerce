from flask_restx import Namespace, Resource, fields
from flask import request, jsonify

from .cart import cart_update_model, product_model

from ..Controller.OrdersController import create_from
from ..Models.OrdersModel import Orders

order_ns = Namespace('Order', description='Order operations')
order_model = order_ns.model('order',  {
    "id": fields.Integer(description='order identifier'),
    "created_at": fields.DateTime(description='Cart creation timestamp'),
    "amount": fields.Float(description='total order amount'),
    "products": fields.List(fields.Nested(product_model), description='List of products'),
    "updated_at": fields.DateTime(description='Cart update timestamp')
})


@order_ns.route('/order')

class OrderCreate(Resource):
    @order_ns.response(200, 'Success', order_model)
    @order_ns.response(400, 'No input data provided')
    @order_ns.response(500, 'Internal Server Error')
   
    
    @order_ns.param('order_id', 'Order identificator')
    def get(self, order_id):
        '''Returns details of an order'''
        order = Orders.query.filter(Orders.id==order_id).first()
        res = jsonify(order.serialized) if order else jsonify({'error': 'Order not found'}), 404
        return res


@order_ns.route('/order/<order_id>')
@order_ns.expect(cart_update_model, validate=True) # payload model
class OrderGet(Resource):
    @order_ns.response(200, 'Success', order_model)
    @order_ns.response(400, 'No input data provided')
    @order_ns.response(500, 'Internal Server Error')    
    def post(self):
        ''' Create order'''
        try:
            payload = request.get_json()
            if not payload:
                return {'message': 'No input data provided'}, 400
            order = create_from(payload['cart_code'])
            return jsonify(order.serialized) , 200
        except Exception as e:
            return {'message': str(e)}, 500

    
    

# {
#   "amount": "123.45",
#   "created_at": "2025-06-02T15:15:17.977420",
#   "id": 1,
#   "products": [
#     {
#       "id": "1",
#       "quantity": 1,
#       "thumbnailUrl": "https://placehold.co/100",
#       "title": "Caneca Azul",
#       "unitPrice": "123.45"
#     }
#   ],
#   "status": "DONE",
#   "updated_at": "2025-06-02T15:15:17.977420"
# }