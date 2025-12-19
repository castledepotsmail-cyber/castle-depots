import requests
from django.core.mail.backends.base import BaseEmailBackend
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class NextJSEmailBackend(BaseEmailBackend):
    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        sent_count = 0
        api_url = getattr(settings, 'NEXTJS_API_URL', 'http://localhost:3000') + '/api/send-email'
        api_secret = getattr(settings, 'EMAIL_API_SECRET', '')

        if not api_secret:
            logger.error("EMAIL_API_SECRET is not set. Cannot send emails via Next.js.")
            return 0

        headers = {
            'Authorization': f'Bearer {api_secret}',
            'Content-Type': 'application/json'
        }

        for message in email_messages:
            try:
                payload = {
                    'subject': message.subject,
                    'to': message.to,
                    'from': message.from_email,
                    'text': message.body,
                }

                # Check for HTML content
                if hasattr(message, 'alternatives'):
                    for content, mimetype in message.alternatives:
                        if mimetype == 'text/html':
                            payload['html'] = content
                            break
                
                # If body is HTML (sometimes implicit in Django)
                if message.content_subtype == 'html':
                    payload['html'] = message.body
                    # Ideally we should generate a text version too, but for now:
                    if 'text' not in payload:
                        payload['text'] = "Please view this email in an HTML-compatible client."

                response = requests.post(api_url, json=payload, headers=headers, timeout=10)
                
                if response.status_code == 200:
                    sent_count += 1
                else:
                    logger.error(f"Failed to send email via Next.js: {response.status_code} - {response.text}")
            
            except Exception as e:
                logger.error(f"Exception sending email via Next.js: {str(e)}")
                if not self.fail_silently:
                    raise

        return sent_count
