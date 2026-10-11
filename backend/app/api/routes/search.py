from fastapi import APIRouter, Depends, HTTPException, Query

from app.api.deps import get_search_service
from app.schemas.search import SearchResponse
from app.services.search.base_query_parser import QueryParseError
from app.services.search_service import SearchService

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=SearchResponse)
def search_invoices(
    q: str = Query(min_length=2, max_length=200),
    service: SearchService = Depends(get_search_service),
):
    try:
        filters, invoices = service.search(q)
    except QueryParseError as e:
        raise HTTPException(502, str(e))
    return {"interpreted_filters": filters, "invoices": invoices}