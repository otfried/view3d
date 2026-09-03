#!/usr/bin/env python3
"""Encode a URL so it can be passed as a query parameter value.

Usage:
    ./encode_url.py 'http://localhost:8000/models/aarhus.glb'

Prints the percent-encoded string, suitable for use as
    http://localhost:5173/?load=<encoded>
"""

import sys
from urllib.parse import quote

if len(sys.argv) != 2:
    sys.exit(f"usage: {sys.argv[0]} URL")

print(quote(sys.argv[1], safe=""))
