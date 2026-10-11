from app.services.extractor.gemini_extractor import GeminiExtractor

data = open("Grocery Store Receipt.pdf", "rb").read()
print(GeminiExtractor().extract(data, "application/pdf"))