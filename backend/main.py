import io
import os
import uuid
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import pypandoc
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

def get_readable_size(bytes_size: int) -> str:
    if bytes_size == 0: 
        return "0 Bytes"
    
    units = ("Bytes", "KB", "MB", "GB")
    unit_index = int(math.floor(math.log(bytes_size, 1024)))
    divisor = math.pow(1024, unit_index)
    readable_value = round(bytes_size / divisor, 2)
    return f"{readable_value} {units[unit_index]}"

@app.post("/convert/")
async def convert_md_to_docx(file: UploadFile = File(...)):
    if not file.filename.endswith('.md'):
        raise HTTPException(status_code=400, detail="Only md file allowed")
    
    # Create temporary file
    temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=".docx")
    temp_output_path = temp_output.name
    temp_output.close() 
    
    try:
        # Read the md file contents
        md_content = await file.read()

        # Convert text via pypandoc
        docx_output = pypandoc.convert_text(
            md_content.decode("utf-8"), 
            'docx', 
            format='md', 
            extra_args=['--standalone'],
            outputfile=temp_output_path
        )

        with open(temp_output_path, "rb") as f:
            docx_bytes = f.read()

        # Store the BytesIO object in dictionary
        buffer = io.BytesIO(docx_bytes)

        # Get file size
        raw_size = buffer.getbuffer().nbytes
        readable_size = get_readable_size(raw_size)
        
        # Generate unique ID
        file_id = str(uuid.uuid4())

        original_name = file.filename.rsplit(".", 1)[0]

        in_memory_store[file_id] = {
            "filename": f"{original_name}.docx",
            "content": buffer,
            "size": readable_size
        }

        return {
            "file_id": file_id, 
            "filename": f"{original_name}.docx",
            "size": readable_size
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Konversi gagal: {str(e)}")
    finally:
        if os.path.exists(temp_output_path):
            os.remove(temp_output_path)

@app.get("/download/{file_id}")
async def download_file(file_id: str):
    # Check if the file exist in storage
    file_data = in_memory_store.get(file_id)
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found or expired")

    buffer = file_data["content"]
    filename = file_data["filename"]

    # Rewind the buffer
    buffer.seek(0)

    headers = {
        "Content-Disposition": f"attachment; filename={filename}",
        "Access-Control-Expose-Headers": "Content-Disposition" # Penting untuk frontend
    }

    # Stream the file
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers=headers
    )