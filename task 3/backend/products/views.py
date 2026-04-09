

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product

class ProductSearchView(APIView):
    def get(self, request):
        query = request.GET.get('q', '')

        products = Product.objects.filter(name__icontains=query)[:10]

        data = [
            {
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "image": p.image
            }
            for p in products
        ]

        return Response(data)