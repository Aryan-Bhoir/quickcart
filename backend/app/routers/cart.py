from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from app.models.user import User
from app.schemas.cart import (
    CartItemCreate,
    CartItemUpdate,
    CartItemResponse
)
from app.services.cart import (
    add_to_cart,
    get_user_cart,
    update_cart_item,
    remove_from_cart
)


router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)


@router.post("/", response_model=CartItemResponse)
def add_product_to_cart(
    cart_data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_item, error = add_to_cart(
        db,
        current_user,
        cart_data
    )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    return cart_item


@router.get("/", response_model=list[CartItemResponse])
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_cart(
        db,
        current_user
    )


@router.put("/{cart_item_id}", response_model=CartItemResponse)
def update_cart(
    cart_item_id: int,
    cart_data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_item, error = update_cart_item(
        db,
        current_user,
        cart_item_id,
        cart_data
    )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    return cart_item


@router.delete("/{cart_item_id}")
def delete_cart_item(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_item = remove_from_cart(
        db,
        current_user,
        cart_item_id
    )

    if cart_item is None:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    return {
        "message": "Cart item removed successfully"
    }