# Generated by Django 5.2.1 on 2025-06-18 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_user_avatar_alter_user_first_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='desired_category',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
