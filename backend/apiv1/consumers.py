import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class Consumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.room_group_name = "realtime_env_ws"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    
    # Receive message from room group
    async def env_data(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}))
