from pydantic import BaseModel

class DocxSettings(BaseModel):
    filename: str = "document"
    template: str = "default"
    includeToc: bool | None
    includePageNumbers: bool | None