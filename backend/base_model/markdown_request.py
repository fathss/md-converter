from pydantic import BaseModel

from base_model.docx_settings import DocxSettings

class MarkdownRequest(BaseModel):
    content: str
    settings: DocxSettings