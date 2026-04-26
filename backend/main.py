import io
import os
import uuid
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import pypandoc
from pydantic import BaseModel
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"] 
)

# Temporary in-memory storage 
in_memory_store = {}

def process_and_store_conversion(md_content: str, base_filename: str) -> dict:
    """
    Handles the conversion of Markdown content to .docx, stores it in memory, 
    and returns metadata for retrieval.
    """
    # Ensure filename ends with .docx
    if base_filename.endswith('.md'):
        base_filename = base_filename.rsplit(".", 1)[0]
    final_filename = base_filename if base_filename.endswith(".docx") else f"{base_filename}.docx"

    # Create temporary file for output
    temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=".docx")
    temp_output_path = temp_output.name
    temp_output.close() 

    try:
        pypandoc.convert_text(
            md_content, 
            'docx', 
            format='md', 
            extra_args=['--standalone'],
            outputfile=temp_output_path
        )

        # Read values from the generated .docx file
        with open(temp_output_path, "rb") as f:
            docx_bytes = f.read()

        buffer = io.BytesIO(docx_bytes)
        file_id = str(uuid.uuid4())
        size = buffer.getbuffer().nbytes

        # Store in in-memory storage
        in_memory_store[file_id] = {
            "filename": final_filename,
            "content": buffer,
            "size": size
        }

        return {
            "file_id": file_id, 
            "filename": final_filename,
            "size": size
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
    finally:
        if os.path.exists(temp_output_path):
            os.remove(temp_output_path)

class MarkdownRequest(BaseModel):
    content: str
    filename: str = "document"

@app.post("/convert-text/")
async def convert_text_to_docx(request: MarkdownRequest) -> dict:
    return process_and_store_conversion(request.content, request.filename)

@app.post("/convert/")
async def convert_md_to_docx(file: UploadFile = File(...)) -> dict:
    if not file.filename.endswith('.md'):
        raise HTTPException(status_code=400, detail="Only .md files are allowed")
    
    content = await file.read()
    return process_and_store_conversion(content.decode("utf-8"), file.filename)

@app.get("/download/{file_id}")
async def download_file(file_id: str) -> StreamingResponse:
    file_data = in_memory_store.get(file_id)
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found or expired")

    buffer = file_data["content"]
    filename = file_data["filename"]

    # Rewind the buffer
    buffer.seek(0)

    headers = {
        "Content-Disposition": f"attachment; filename={filename}",
        "Access-Control-Expose-Headers": "Content-Disposition" # Important for frontend
    }

    # Stream the file
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers=headers
    )