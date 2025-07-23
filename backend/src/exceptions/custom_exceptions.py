class LatestMeasurementUnavailableException(Exception):
    def __init__(self, message: str = "Latest measurement is temporarily unavailable."):
        self.message = message
