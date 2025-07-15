from fastapi import APIRouter, WebSocket

ws_router = APIRouter(prefix="/ws", tags=["websocket"])


@ws_router.websocket("/env_values")
async def broadcast_env_values_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
