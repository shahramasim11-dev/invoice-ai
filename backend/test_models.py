from google import genai

from app.core.config import get_settings

settings = get_settings()
client = genai.Client(api_key=settings.gemini_api_key)
SKIP = ("image", "tts", "live", "audio", "embedding", "robotics", "computer")


def check(name: str) -> None:
    try:
        reply = client.models.generate_content(
            model=name, contents="Reply with the single word: ok"
        )
        print(f"  OK    {name}  ->  {reply.text.strip()[:20]}")
    except Exception as e:
        print(f"  FAIL  {name}  ->  {str(e)[:150]}")


print("Configured model:", settings.gemini_model)
check(settings.gemini_model)

print("\nOther Flash models available to your key:")
others = [
    m.name.removeprefix("models/")
    for m in client.models.list()
    if "generateContent" in (m.supported_actions or [])
    and "flash" in m.name
    and not any(word in m.name for word in SKIP)
]
for name in others[:4]:
    if name != settings.gemini_model:
        check(name)