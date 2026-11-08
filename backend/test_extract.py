from app.services.extractor.gemini_extractor import GeminiExtractor
from app.services.gemini_gateway import GeminiGateway

data = open("Grocery Store Receipt.pdf", "rb").read()
print(GeminiExtractor(GeminiGateway.from_settings()).extract(data, "application/pdf"))