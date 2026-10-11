from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import invoices
from app.core.config import get_settings
from app.api.routes import invoices, search

settings = get_settings()

app = FastAPI(title="InvoiceAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(invoices.router)
app.include_router(invoices.router)
app.include_router(search.router)

@app.get("/health")
def health():
    return {"status": "ok"}