from app.server import app

# Vercel需要的handler
def handler(event, context):
    return app(event, context)