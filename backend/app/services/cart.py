from sqlalchemy.orm import Session

from app.models.cart import CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemUpdate


def add_to_cart(
    db: Session,
    user: User,
    cart_data: CartItemCreate
):
    product = db.query(Product).filter(
        Product.id == cart_data.product_id
    ).first()

    if product is None:
        return None, "Product not found"

    if not product.is_active:
        return None, "Product is not active"

    if cart_data.quantity <= 0:
        return None, "Quantity must be greater than 0"

    if cart_data.quantity > product.stock:
        return None, "Not enough stock"

    existing_item = db.query(CartItem).filter(
        CartItem.user_id == user.id,
        CartItem.product_id == cart_data.product_id
    ).first()

    if existing_item:
        new_quantity = existing_item.quantity + cart_data.quantity

        if new_quantity > product.stock:
            return None, "Not enough stock"

        existing_item.quantity = new_quantity

        db.commit()
        db.refresh(existing_item)

        return existing_item, None

    new_item = CartItem(
        user_id=user.id,
        product_id=cart_data.product_id,
        quantity=cart_data.quantity
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item, None


def get_user_cart(
    db: Session,
    user: User
):
    return db.query(CartItem).filter(
        CartItem.user_id == user.id
    ).all()


def update_cart_item(
    db: Session,
    user: User,
    cart_item_id: int,
    cart_data: CartItemUpdate
):
    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == user.id
    ).first()

    if cart_item is None:
        return None, "Cart item not found"

    if cart_data.quantity <= 0:
        return None, "Quantity must be greater than 0"

    product = db.query(Product).filter(
        Product.id == cart_item.product_id
    ).first()

    if product is None:
        return None, "Product not found"

    if cart_data.quantity > product.stock:
        return None, "Not enough stock"

    cart_item.quantity = cart_data.quantity

    db.commit()
    db.refresh(cart_item)

    return cart_item, None


def remove_from_cart(
    db: Session,
    user: User,
    cart_item_id: int
):
    cart_item = db.query(CartItem).filter(
        CartItem.id == cart_item_id,
        CartItem.user_id == user.id
    ).first()

    if cart_item is None:
        return None

    db.delete(cart_item)
    db.commit()

    return cart_item