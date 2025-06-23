from rest_framework import serializers
from core.models import Service

class ServiceSerializer(serializers.ModelSerializer):
    payment_type = serializers.ChoiceField(
        choices=[('barter', 'Barter'), ('token', 'Token')],
        write_only=True, 
        required=True
    )

    class Meta:
        model = Service
        fields = '__all__' 
        read_only_fields = ['owner', 'created_at', 'updated_at'] 

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.price > 0: 
            ret['payment_type'] = 'token'
        else: 
            ret['payment_type'] = 'barter'
        return ret

    def validate(self, data):
        payment_type = data.get('payment_type')
        category = data.get('category') #
        desired_category = data.get('desired_category') 
        price = data.get('price')

        if payment_type == 'barter':
            if not category:
                raise serializers.ValidationError({"category": "Service category is required for barter services."})
            if not desired_category:
                raise serializers.ValidationError({"desired_category": "Desired category is required for barter services."})
            if price is not None and price != 0:
                raise serializers.ValidationError({"price": "Price must be 0 for barter services."})
            
            data['price'] = 0 # 
           
        elif payment_type == 'token':
            if not category: 
                raise serializers.ValidationError({"category": "Service category is required for token services."})
            if desired_category is not None:
                raise serializers.ValidationError({"desired_category": "Desired category is not allowed for token services."})
            
           
            if price is None or price != 10:
                data['price'] = 10
            
            data['desired_category'] = None 
        else:
            raise serializers.ValidationError({"payment_type": "Invalid payment type. Must be 'barter' or 'token'."})

        if 'payment_type' in data:
            del data['payment_type']

        return data