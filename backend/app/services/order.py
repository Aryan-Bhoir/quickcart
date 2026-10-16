from sqlalchemy.orm import Session

from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User


def create_order(
    db: Session,
    user: User
):
    cart_items = db.query(CartItem).filter(
        CartItem.user_id == user.id
    ).all()

    if not cart_items:
        return None, "Cart is empty"

    total_amount = 0

    for cart_item in cart_items:
        product = db.query(Product).filter(
            Product.id == cart_item.product_id
        ).first()

        if product is None:
            return None, "Product not found"

        if not product.is_active:
            return None, f"Product '{product.name}' is not active"

        if cart_item.quantity > product.stock:
            return None, f"Not enough stock for '{product.name}'"

        total_amount += product.price * cart_item.quantity

    new_order = Order(
        user_id=user.id,
        total_amount=total_amount,
        status="pending"
    )

    db.add(new_order)
    db.flush()

    for cart_item in cart_items:
        product = db.query(Product).filter(
            Product.id == cart_item.product_id
        ).first()

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=cart_item.quantity,
            price=product.price
        )

        db.add(order_item)

        product.stock -= cart_item.quantity

    for cart_item in cart_items:
        db.delete(cart_item)

    db.commit()
    db.refresh(new_order)

    return new_order, None


def get_user_orders(
    db: Session,
    user: User
):
    return db.query(Order).filter(
        Order.user_id == user.id
    ).all()


def cancel_order(
    db: Session,
    order_id: int,
    user: User
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id
    ).first()

    if order is None:
        return None, "Order not found"

    if order.status != "pending":
        return None, "Only pending orders can be cancelled"

    for item in order.items:
        if item.product_id is not None:
            product = db.query(Product).filter(
                Product.id == item.product_id
            ).first()

            if product is not None:
                product.stock += item.quantity

    order.status = "cancelled"

    db.commit()
    db.refresh(order)

    return order, None