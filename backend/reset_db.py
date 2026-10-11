from app.core.database import Base, engine
from app.models import invoice  # noqa: F401  (registers the models)

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Tables recreated")