from pydantic import BaseModel


class OrderItemResponse(BaseModel):
    id: int
    product_id: int | None
    quantity: int
    price: float


class OrderResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    items: list[OrderItemResponse]