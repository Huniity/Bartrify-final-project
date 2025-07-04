# Generated by Django 5.2.1 on 2025-06-26 18:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0017_alter_servicerequest_status'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='review',
            options={'ordering': ['-created_at']},
        ),
        migrations.AddField(
            model_name='review',
            name='request',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='core.servicerequest'),
        ),
        migrations.AddField(
            model_name='review',
            name='service',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='core.service'),
        ),
        migrations.AlterField(
            model_name='review',
            name='rating',
            field=models.IntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')]),
        ),
        migrations.AlterUniqueTogether(
            name='review',
            unique_together={('user', 'request')},
        ),
    ]
