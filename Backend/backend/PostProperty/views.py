# views.py
import json
import os
from django.db.models import Q, Avg
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from .models import PropertyListing, FavouriteProperty, Inquiry, Review
from .serializers import (
    PropertyListingSerializer, FavouritePropertySerializer,
    InquirySerializer, ReviewSerializer
)


# ── Pagination ────────────────────────────────────────────────────────────────
class PropertyPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 48


# ── Property CRUD ─────────────────────────────────────────────────────────────
class PropertyListingCreateView(CreateAPIView):
    queryset = PropertyListing.objects.all()
    serializer_class = PropertyListingSerializer
    permission_classes = [IsAuthenticated]


class PropertyListingListView(ListAPIView):
    serializer_class = PropertyListingSerializer
    permission_classes = [AllowAny]
    pagination_class = PropertyPagination

    def get_queryset(self):
        qs = PropertyListing.objects.filter(status='Active').order_by('-created_at')
        p = self.request.query_params

        if p.get('city'):
            qs = qs.filter(city__icontains=p['city'])
        if p.get('property_type'):
            qs = qs.filter(property_type=p['property_type'])
        if p.get('bedrooms'):
            qs = qs.filter(bedrooms=p['bedrooms'])
        if p.get('search'):
            qs = qs.filter(
                Q(title__icontains=p['search']) |
                Q(city__icontains=p['search']) |
                Q(locality__icontains=p['search']) |
                Q(description__icontains=p['search'])
            )
        if p.get('verified') == 'true':
            qs = qs.filter(is_verified=True)

        # Price filtering (price stored as CharField)
        min_p = p.get('min_price')
        max_p = p.get('max_price')
        if min_p or max_p:
            result = []
            for prop in qs:
                try:
                    price = float(str(prop.price).replace(',', '').replace('₹', '').strip())
                    if min_p and price < float(min_p):
                        continue
                    if max_p and price > float(max_p):
                        continue
                    result.append(prop)
                except Exception:
                    pass
            return result
        return qs

    def get_serializer_context(self):
        return {'request': self.request}


class PropertyDetailView(RetrieveAPIView):
    queryset = PropertyListing.objects.all()
    serializer_class = PropertyListingSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}


class SimilarPropertiesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            prop = PropertyListing.objects.get(id=id)
        except PropertyListing.DoesNotExist:
            return Response([], status=200)
        similar = PropertyListing.objects.filter(
            city=prop.city, property_type=prop.property_type, status='Active'
        ).exclude(id=id)[:4]
        return Response(PropertyListingSerializer(similar, many=True, context={'request': request}).data)


class UserListingsView(ListAPIView):
    serializer_class = PropertyListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PropertyListing.objects.filter(
            seller_email=self.request.user.email
        ).order_by('-created_at')

    def get_serializer_context(self):
        return {'request': self.request}


class UserListingDeleteView(DestroyAPIView):
    serializer_class = PropertyListingSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return PropertyListing.objects.filter(seller_email=self.request.user.email)


# ── Favourites ────────────────────────────────────────────────────────────────
class ToggleFavouriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, property_id):
        try:
            prop = PropertyListing.objects.get(id=property_id)
        except PropertyListing.DoesNotExist:
            return Response({'error': 'Property not found'}, status=404)
        fav, created = FavouriteProperty.objects.get_or_create(user=request.user, property=prop)
        if not created:
            fav.delete()
            return Response({'status': 'removed'})
        return Response({'status': 'added'})


class FavouriteListView(ListAPIView):
    serializer_class = FavouritePropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FavouriteProperty.objects.filter(user=self.request.user).select_related('property')


# ── Inquiry ───────────────────────────────────────────────────────────────────
class PropertyInquiryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, property_id):
        try:
            prop = PropertyListing.objects.get(id=property_id)
        except PropertyListing.DoesNotExist:
            return Response({'error': 'Property not found'}, status=404)

        serializer = InquirySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        inquiry = serializer.save(property=prop, user=request.user)

        # Notify seller via email (console in dev)
        try:
            send_mail(
                subject=f'New Inquiry: {prop.title}',
                message=(
                    f"You have a new inquiry for your property: {prop.title}\n\n"
                    f"From: {inquiry.name}\nPhone: {inquiry.phone}\n\n"
                    f"Message:\n{inquiry.message}\n\n"
                    f"Buyer email: {request.user.email}"
                ),
                from_email=settings.EMAIL_HOST_USER or 'noreply@bankebiharigroup.com',
                recipient_list=[prop.seller_email],
                fail_silently=True,
            )
        except Exception:
            pass

        return Response({'message': 'Inquiry sent successfully!'}, status=201)


# ── Reviews ───────────────────────────────────────────────────────────────────
class PropertyReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, property_id):
        reviews = Review.objects.filter(property_id=property_id).select_related('user').order_by('-created_at')
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request, property_id):
        try:
            prop = PropertyListing.objects.get(id=property_id)
        except PropertyListing.DoesNotExist:
            return Response({'error': 'Property not found'}, status=404)

        if Review.objects.filter(user=request.user, property=prop).exists():
            return Response({'error': 'You have already reviewed this property.'}, status=400)

        rating = request.data.get('rating')
        comment = request.data.get('comment', '')

        if not rating or int(rating) not in range(1, 6):
            return Response({'error': 'Rating must be between 1 and 5.'}, status=400)

        review = Review.objects.create(
            property=prop, user=request.user,
            rating=int(rating), comment=comment
        )
        return Response(ReviewSerializer(review).data, status=201)


# ── Gemini AI Chat ────────────────────────────────────────────────────────────
class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message', '').strip()
        if not user_message:
            return Response({'error': 'Message is required.'}, status=400)

        gemini_key = os.getenv('GEMINI_API_KEY')
        if not gemini_key:
            return Response({'reply': 'AI chat is not configured. Please add GEMINI_API_KEY to your .env file.'})

        # Build property context (last 20 active listings)
        listings = PropertyListing.objects.filter(status='Active').order_by('-created_at')[:20]
        context_lines = []
        for p in listings:
            context_lines.append(
                f"ID:{p.id} | {p.title} | {p.city}, {p.locality} | "
                f"{p.property_type} | {p.bedrooms or 'N/A'} BHK | "
                f"{p.size_sqft} sqft | ₹{p.price} | {p.construction_status}"
            )
        property_context = "\n".join(context_lines)

        system_prompt = (
            "You are a helpful real estate assistant for Banke Bihari Group, "
            "a real estate company in Vrindavan and Mathura, Uttar Pradesh, India. "
            "Help users find properties, answer questions about listings, and provide guidance. "
            "Be concise, friendly, and helpful. Respond in the same language the user writes in.\n\n"
            f"Current available properties:\n{property_context}\n\n"
            "When recommending properties, mention the property ID, title, location, and price."
        )

        try:
            import urllib.request
            import urllib.error

            payload = json.dumps({
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser: {user_message}"}]}
                ]
            }).encode('utf-8')

            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}"
            req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})

            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                reply = data['candidates'][0]['content']['parts'][0]['text']
                return Response({'reply': reply})

        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            return Response({'reply': f'AI service error: {e.code}. Check your GEMINI_API_KEY.'})
        except Exception as e:
            return Response({'reply': f'Could not reach AI service: {str(e)}'})


# ── Price Trend ───────────────────────────────────────────────────────────────
class PriceTrendView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from django.db.models.functions import TruncMonth
        city = request.query_params.get('city', '')
        qs = PropertyListing.objects.filter(status='Active')
        if city:
            qs = qs.filter(city__icontains=city)

        # Group by month and compute average price
        results = []
        monthly = qs.annotate(month=TruncMonth('created_at')).values('month').order_by('month')
        seen = {}
        for p in qs.order_by('created_at'):
            month_key = p.created_at.strftime('%Y-%m')
            try:
                price = float(str(p.price).replace(',', '').replace('₹', '').strip())
                if month_key not in seen:
                    seen[month_key] = []
                seen[month_key].append(price)
            except Exception:
                pass

        for month, prices in seen.items():
            results.append({
                'month': month,
                'avg_price': round(sum(prices) / len(prices), 0),
                'count': len(prices)
            })
        return Response(results)
