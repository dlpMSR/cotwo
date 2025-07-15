from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from src.websocket import ConnectionManager

ws_router = APIRouter(prefix="/ws", tags=["websocket"])


def setup_websocket_routes(manager: ConnectionManager):
    @ws_router.websocket("/env_values")
    async def broadcast_env_values_endpoint(websocket: WebSocket):
        await manager.connect(websocket)
        try:
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            manager.disconnect(websocket)
