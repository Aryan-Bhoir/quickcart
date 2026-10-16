from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    stock: int


class ProductUpdate(BaseModel):
    name: str
    description: str | None = None
    price: float
    stock: int
    is_active: bool


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price: float
    stock: int
    is_active: bool