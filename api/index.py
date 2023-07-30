from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        content_len = int(self.headers.get('Content-Length'))
        params = json.loads(self.rfile.read(content_len))
        puzzle_info = self.create_puzzle(params)
        self.wfile.write(json.dumps(puzzle_info).encode())

    @staticmethod
    def create_puzzle(params):
        return {'puzzle': '1 1 3 8', 'solutions': ['1 x 1 x 3 x 8']}
