from app.services.storage.supabase_storage import SupabaseStorage

data = open("Grocery Store Receipt.pdf", "rb").read()
print(SupabaseStorage().upload(data, "Grocery Store Receipt.pdf", "application/pdf"))