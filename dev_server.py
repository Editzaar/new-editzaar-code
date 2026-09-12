import http.server
import socketserver
import os
import sys
import json
import urllib.request
import urllib.error

PORT = 8080

class EditzaarDevServerHandler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.0"

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        # 1. Telegram Notification Proxy Endpoint
        if self.path == '/api/notify-telegram':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                chat_id = data.get('chat_id')
                text = data.get('text')
                bot_token = data.get('bot_token') or os.environ.get('TELEGRAM_BOT_TOKEN', '')

                if bot_token and chat_id and text:
                    tg_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
                    req_payload = json.dumps({
                        "chat_id": chat_id,
                        "text": text,
                        "parse_mode": data.get("parse_mode", "HTML")
                    }).encode('utf-8')

                    req = urllib.request.Request(tg_url, data=req_payload, headers={'Content-Type': 'application/json'})
                    with urllib.request.urlopen(req, timeout=10) as response:
                        res_body = response.read()
                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(res_body)
                        return
                else:
                    print(f"\n[LOCAL TELEGRAM ALERT LOG]\nChat ID: {chat_id}\n{text}\n")
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True, "mode": "local_logged"}).encode('utf-8'))
                    return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        # 2. Local Google Drive Upload Handler / Mock
        elif self.path == '/api/upload-drive':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                _ = self.rfile.read(content_length)

            response_data = {
                "success": True,
                "message": "File streamed successfully to 5TB Google Drive queue",
                "folderPath": "Agency Projects/Client_Uploads",
                "driveShareUrl": f"https://drive.google.com/drive/folders/editzaar_upload_{int(os.path.getmtime(__file__))}"
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
            return

        return super().do_POST()

    def do_GET(self):
        url_path = self.path.split('?')[0].split('#')[0]
        query_hash = self.path[len(url_path):]

        # 1. Handle domain links clicked without protocol (e.g. /www.collegementor or /pages/www.collegementor)
        stripped_domain = url_path.replace('/pages/', '/').lstrip('/')
        if stripped_domain.startswith('www.') or any(stripped_domain.endswith(tld) for tld in ['.com', '.in', '.org', '.net', '.io', '.co']):
            target_url = 'https://' + stripped_domain
            self.send_response(302)
            self.send_header('Location', target_url)
            self.end_headers()
            return

        # 2. Handle asset requests under /pages/ (e.g. /pages/js/..., /pages/css/..., /pages/media/...)
        if url_path.startswith('/pages/') and not os.path.exists('.' + url_path):
            root_equiv = url_path[6:]  # remove '/pages'
            if os.path.exists('.' + root_equiv):
                self.path = root_equiv + query_hash
                return super().do_GET()

        # 3. Handle dashboard shortcuts (/admin -> /dashboard/admin.html, /dashboard -> /dashboard/index.html)
        if url_path.rstrip('/') in ['/admin', '/dashboard/admin']:
            self.path = '/dashboard/admin.html' + query_hash
            return super().do_GET()
        if url_path.rstrip('/') in ['/dashboard', '/login']:
            self.path = '/dashboard/index.html' + query_hash
            return super().do_GET()

        # 4. Clean URL rewrite support (e.g. /work or /work/ -> /work.html)
        norm_path = url_path.rstrip('/')
        if norm_path != '' and not os.path.exists('.' + url_path):
            # Check root .html
            if os.path.exists('.' + norm_path + '.html'):
                self.path = norm_path + '.html' + query_hash
                return super().do_GET()
            # Check pages/ .html
            if os.path.exists('./pages' + norm_path + '.html'):
                self.path = '/pages' + norm_path + '.html' + query_hash
                return super().do_GET()
            # If relative link appended to subroute (e.g. /work/services or /work/pricing)
            sub_name = norm_path.split('/')[-1]
            if os.path.exists('./' + sub_name + '.html'):
                self.path = '/' + sub_name + '.html' + query_hash
                return super().do_GET()

        return super().do_GET()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == '__main__':
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    with ThreadedTCPServer(("0.0.0.0", PORT), EditzaarDevServerHandler) as httpd:
        print(f"[Editzaar] Dev server running at http://localhost:{PORT}")
        print(f"[Editzaar] Features: Clean URLs + /api/notify-telegram + /api/upload-drive active")
        sys.stdout.flush()
        httpd.serve_forever()
