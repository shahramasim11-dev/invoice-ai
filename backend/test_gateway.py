from types import SimpleNamespace

from google.genai import errors

from app.services.gemini_gateway import GeminiGateway
from app.services.gemini_retry import RetryPolicy


def busy():
    return errors.ServerError(
        503, {"error": {"code": 503, "message": "overloaded", "status": "UNAVAILABLE"}}
    )


class FakeModels:
    def __init__(self, behaviors):
        self.behaviors = behaviors
        self.calls = []

    def generate_content(self, model, contents, config=None):
        self.calls.append(model)
        outcome = self.behaviors[model]
        if isinstance(outcome, Exception):
            raise outcome
        return SimpleNamespace(text=outcome)


class FakeClient:
    def __init__(self, behaviors):
        self.models = FakeModels(behaviors)


def make(behaviors):
    client = FakeClient(behaviors)
    gateway = GeminiGateway(
        "key",
        ["main", "backup"],
        retry=RetryPolicy(attempts=3, base_delay=0.01),
        client=client,
    )
    return gateway, client.models


g, m = make({"main": "from main", "backup": "from backup"})
print("1.", g.generate_text("hi"), "| calls:", m.calls)

g, m = make({"main": busy(), "backup": "from backup"})
print("2.", g.generate_text("hi"), "| calls:", m.calls)

g, m = make({"main": busy(), "backup": busy()})
try:
    g.generate_text("hi")
except errors.ServerError:
    print("3. gave up after", len(m.calls), "calls:", m.calls)

bad = errors.ClientError(
    400, {"error": {"code": 400, "message": "bad", "status": "INVALID_ARGUMENT"}}
)
g, m = make({"main": bad, "backup": "from backup"})
try:
    g.generate_text("hi")
except errors.ClientError:
    print("4. real error raised at once | calls:", m.calls)