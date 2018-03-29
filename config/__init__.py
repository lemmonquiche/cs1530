from os import getenv
from os.path import join, dirname
from dotenv import load_dotenv

load_dotenv(join(dirname(__file__), '..', '.env'))


class ConfigurationException(Exception):
    pass


def raise_ce(missing):
    raise ConfigurationException("Missing " + missing + ".")

environment = getenv('FLASK_ENV', 'development')
sendgrid_api_key = getenv('SENDGRID_API_KEY') or raise_ce("Sendgrid API Key")
