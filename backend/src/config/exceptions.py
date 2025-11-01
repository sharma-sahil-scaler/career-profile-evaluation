class AppException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ConfigurationError(AppException):
    def __init__(self, message: str):
        super().__init__(message, status_code=500)


class DatabaseError(AppException):
    def __init__(self, message: str):
        super().__init__(message, status_code=500)


class CacheError(AppException):
    def __init__(self, message: str):
        super().__init__(message, status_code=500)


class OpenAIError(AppException):
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message, status_code=status_code)


class ValidationError(AppException):
    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class RateLimitError(AppException):
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, status_code=429)


class NotFoundError(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404)
