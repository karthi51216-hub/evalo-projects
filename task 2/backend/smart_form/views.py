

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FormSubmission
import json

from openai import OpenAI

client = OpenAI(api_key=settings.OPENAI_API_KEY)


class SmartFormView(APIView):

    def post(self, request):
        data = request.data
        full_name = data.get('full_name', '')
        email = data.get('email', '')
        phone = data.get('phone', '')
        message = data.get('message', '')

        if not all([full_name, email, phone, message]):
            return Response(
                {"error": "All fields required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # default fallback
        ai_json = {
            "full_name": "Looks good!",
            "email": "Looks good!",
            "phone": "Looks good!",
            "message": "Looks good!"
        }

        try:
            prompt = f"""
User submitted a form:
Name: {full_name}
Email: {email}
Phone: {phone}
Message: {message}

Give brief improvement suggestions for each field.
Respond ONLY in JSON format like:
{{"full_name": "...", "email": "...", "phone": "...", "message": "..."}}
"""

            response = client.responses.create(
                model="gpt-4.1-mini",
                input=prompt
            )

            ai_text = response.output_text

            # try parse
            try:
                ai_json = json.loads(ai_text)
            except:
                print("JSON parse failed, using fallback")

            print("AI Success:", ai_json)

        except Exception as e:
            print("AI Error (fallback used):", str(e))

        # Save to DB
        try:
            FormSubmission.objects.create(
                full_name=full_name,
                email=email,
                phone=phone,
                message=message,
                ai_suggestion=json.dumps(ai_json)
            )
        except Exception as e:
            print("DB Error:", str(e))
            return Response(
                {"error": "Database error: " + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "status": "success",
            "message": "Form submitted successfully!",
            "ai_suggestions": ai_json
        })
    