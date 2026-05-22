from pydantic import BaseModel


class DocxSettings(BaseModel):
    filename: str = "document"
    template: str = "default"
    includeToc: bool = False
    includePageNumbers: bool = False