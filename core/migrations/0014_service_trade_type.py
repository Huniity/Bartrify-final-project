# Generated by Django 5.2.1 on 2025-06-24 03:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_remove_user_avatar_alter_user_avatar_upload'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='trade_type',
            field=models.CharField(choices=[('Barter', 'Barter'), ('Tokens', 'Tokens')], default='Barter', max_length=20),
        ),
    ]
