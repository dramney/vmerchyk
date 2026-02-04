from pydantic import BaseModel
from typing import Optional

class SiteStatus(BaseModel):
    url: str
    status_code: int
    is_alive: bool
    response_time: float
    label: str
    error: Optional[str] = None