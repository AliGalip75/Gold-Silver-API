from django.db import models

class GoldPrice(models.Model):
    # Choices for the type of gold
    GOLD_TYPES = [
        ('gram', 'Gram Altın'),
        ('ceyrek', 'Çeyrek Altın'),
        ('yarim', 'Yarım Altın'),
        ('tam', 'Cumhuriyet (Tam) Altın'),
        ('gumus', 'Gümüş (Gram)'),
    ]

    gold_type = models.CharField(max_length=20, choices=GOLD_TYPES)
    # Price when the user sells to the jeweler (Alış)
    price_buy = models.DecimalField(max_digits=10, decimal_places=2)
    # Price when the user buys from the jeweler (Satış)
    price_sell = models.DecimalField(max_digits=10, decimal_places=2)
    # Timestamp for when the data was fetched
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Return readable string in admin panel
        return f"{self.get_gold_type_display()} - {self.created_at.strftime('%d/%m/%Y %H:%M')}"