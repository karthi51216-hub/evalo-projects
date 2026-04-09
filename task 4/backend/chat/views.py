

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Chat


class ChatView(APIView):

    def post(self, request):
        # 🔹 get message safely
        user_msg = request.data.get("message", "")

        if not user_msg:
            return Response({"error": "Message required"}, status=400)

        user_msg_lower = user_msg.lower()

        # 🔥 Smart fallback AI
        if "hi" in user_msg_lower:
            bot_reply = "Hello! எப்படி உதவலாம்?"
        elif "price" in user_msg_lower:
            bot_reply = "Please check our latest product pricing on the site."
        elif "product" in user_msg_lower:
            bot_reply = "We have laptops, mobiles, and tablets available!"
        else:
            bot_reply = f"You said: {user_msg}"

        # 👉 real AI (optional)
        try:
            import openai
            from django.conf import settings

            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

            res = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_msg}]
            )

            bot_reply = res.choices[0].message.content

        except Exception as e:
            print("AI error:", e)

        # 💾 Save to DB
        Chat.objects.create(
            user_message=user_msg,
            bot_response=bot_reply
        )

        return Response({
            "user": user_msg,
            "bot": bot_reply
        })


# 🔹 history API
class ChatHistoryView(APIView):

    def get(self, request):
        chats = Chat.objects.all().order_by("-created_at")[:10]

        data = [
            {
                "user": c.user_message,
                "bot": c.bot_response
            }
            for c in chats
        ]

        return Response(data)