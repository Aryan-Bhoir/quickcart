from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db

from app.models.user import User
from app.models.order import Order

from app.schemas.order import OrderResponse

from app.services.order import (
    create_order,
    get_user_orders,
    cancel_order
)


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("/", response_model=OrderResponse)
def place_order(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order, error = create_order(
        db,
        current_user
    )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    return order


@router.get("/", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_orders(
        db,
        current_user
    )


@router.put(
    "/{order_id}/cancel",
    response_model=OrderResponse
)
def cancel_user_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order, error = cancel_order(
        db,
        order_id,
        current_user
    )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    return order