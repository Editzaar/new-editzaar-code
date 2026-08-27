import http.server
import socketserver
import os
import sys

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        url_path = self.path.split('?')[0].split('#')[0]
        # If requesting a path without extension (e.g. /pricing, /services, /work)
        if url_path != '/' and not os.path.exists('.' + url_path):
            if os.path.exists('.' + url_path + '.html'):
                query_hash = self.path[len(url_path):]
                self.path = url_path + '.html' + query_hash
        return super().do_GET()

if __name__ == '__main__':
    PORT = 8080
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Serving at http://localhost:{PORT} with Clean URL support")
        sys.stdout.flush()
        httpd.serve_forever()
