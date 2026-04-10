from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FormSubmission
import json

from openai import OpenAI


class SmartFormView(APIView):

    def post(self, request):

        # ✅ Safe client initialization
        api_key = getattr(settings, "OPENAI_API_KEY", None)

        if not api_key:
            return Response(
                {"error": "OpenAI API key not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        client = OpenAI(api_key=api_key)

        # ✅ Get data
        data = request.data
        full_name = data.get('full_name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        message = data.get('message', '').strip()

        # ✅ Validation
        if not all([full_name, email, phone, message]):
            return Response(
                {"error": "All fields required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Default fallback
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

Give short improvement suggestions for each field.
Respond ONLY in JSON like:
{{"full_name": "...", "email": "...", "phone": "...", "message": "..."}}
"""

            # ✅ OpenAI call
            response = client.responses.create(
                model="gpt-4.1-mini",
                input=prompt
            )

            # ✅ safer response handling
            ai_text = getattr(response, "output_text", None)

            if not ai_text:
                raise Exception("Empty AI response")

            # ✅ parse JSON safely
            try:
                ai_json = json.loads(ai_text)
            except Exception:
                print("JSON parse failed, fallback used")

        except Exception as e:
            print("AI Error:", str(e))

        # ✅ Save to DB
        try:
            FormSubmission.objects.create(
                full_name=full_name,
                email=email,
                phone=phone,
                message=message,
                ai_suggestion=json.dumps(ai_json)
            )
        except Exception as e:
            return Response(
                {"error": f"Database error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # ✅ Final response
        return Response({
            "status": "success",
            "message": "Form submitted successfully!",
            "ai_suggestions": ai_json
        })