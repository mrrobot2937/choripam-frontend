#!/usr/bin/env python3

import re

# Leer el archivo
with open('services/database_service.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar el método create_order
pattern = r'def create_order\(self, order_input: CreateOrderInput\) -> OrderModel:\s*"""Crear un nuevo pedido"""\s*order_id = str\(uuid\.uuid4\(\)\)\s*now = datetime\.now\(\)\s*query = """\s*CREATE \(o:Order \{\s*id: \$order_id,\s*restaurant_id: \$restaurant_id,\s*customer_name: \$customer_name,\s*customer_phone: \$customer_phone,\s*customer_email: \$customer_email,\s*products: \$products,\s*total: \$total,\s*payment_method: \$payment_method,\s*delivery_method: \$delivery_method,\s*mesa: \$mesa,\s*delivery_address: \$delivery_address,\s*status: \'pending\',\s*created_at: \$created_at,\s*updated_at: \$created_at\s*\}\s*\)\s*RETURN o\s*"""\s*with self\.db\.get_session\(\) as session:\s*result = session\.run\(query, \{\s*"order_id": order_id,\s*"restaurant_id": order_input\.restaurant_id,\s*"customer_name": order_input\.customer_name,\s*"customer_phone": order_input\.customer_phone,\s*"customer_email": order_input\.customer_email,\s*"products": json\.dumps\(\[vars\(p\) for p in order_input\.products\]\),\s*"total": order_input\.total,\s*"payment_method": order_input\.payment_method,\s*"delivery_method": order_input\.delivery_method,\s*"mesa": order_input\.mesa,\s*"delivery_address": order_input\.delivery_address,\s*"created_at": now\.isoformat\(\)\s*\}\)\s*record = result\.single\(\)\s*if record:\s*return self\._record_to_order\(record\)\s*raise Exception\("Error creando pedido"\)'

replacement = '''def create_order(self, order_input: CreateOrderInput) -> OrderModel:
        """Crear un nuevo pedido"""
        order_id = str(uuid.uuid4())
        now = datetime.now()
        
        # Obtener nombres de productos
        products_with_names = []
        for product_input in order_input.products:
            product = self.get_product(product_input.id)
            if product:
                products_with_names.append({
                    "id": product_input.id,
                    "name": product.name,
                    "quantity": product_input.quantity,
                    "price": product_input.price
                })
            else:
                # Fallback si no se encuentra el producto
                products_with_names.append({
                    "id": product_input.id,
                    "name": f"Producto {product_input.id}",
                    "quantity": product_input.quantity,
                    "price": product_input.price
                })
        
        query = """
        CREATE (o:Order {
            id: $order_id,
            restaurant_id: $restaurant_id,
            customer_name: $customer_name,
            customer_phone: $customer_phone,
            customer_email: $customer_email,
            products: $products,
            total: $total,
            payment_method: $payment_method,
            delivery_method: $delivery_method,
            mesa: $mesa,
            delivery_address: $delivery_address,
            status: 'pending',
            created_at: $created_at,
            updated_at: $created_at
        })
        RETURN o
        """
        
        with self.db.get_session() as session:
            result = session.run(query, {
                "order_id": order_id,
                "restaurant_id": order_input.restaurant_id,
                "customer_name": order_input.customer_name,
                "customer_phone": order_input.customer_phone,
                "customer_email": order_input.customer_email,
                "products": json.dumps(products_with_names),
                "total": order_input.total,
                "payment_method": order_input.payment_method,
                "delivery_method": order_input.delivery_method,
                "mesa": order_input.mesa,
                "delivery_address": order_input.delivery_address,
                "created_at": now.isoformat()
            })
            
            record = result.single()
            if record:
                return self._record_to_order(record)
                
        raise Exception("Error creando pedido")'''

# Reemplazar el método
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Escribir el archivo modificado
with open('services/database_service.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Método create_order actualizado exitosamente") 